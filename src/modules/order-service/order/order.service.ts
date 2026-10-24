import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import {
  PaymentCompletedEvent,
  PaymentEvents,
  PaymentFailedEvent,
} from 'src/modules/payment-service/payment/payment.events';

import {
  InventoryAdjustEvent,
  InventoryEvents,
  InventoryTransactionType,
} from 'src/common/events/inventory.events';
import {
  AddressValidateEvent,
  AddressValidationResult,
  UserEvents,
} from 'src/common/events/user.events';
import { IPaginatedResponse } from 'src/common/interface';
import { CartService } from 'src/modules/order-service/cart/cart.service';
import { CartDocument } from 'src/modules/order-service/cart/schemas/cart.schema';
import { CouponService } from 'src/modules/order-service/coupon/coupon.service';
import { CouponDocument } from 'src/modules/order-service/coupon/schemas/coupon.schema';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import {
  OrderCreatedEvent,
  OrderEvents,
  OrderPaymentRequestEvent,
  PaymentRequestResult,
} from '../../../common/events/order.events';
import { DiscountType } from '../coupon/schemas/coupon.schema';
import {
  ApplyCouponDto,
  CancelOrderDto,
  CheckoutDto,
  RetryPaymentDto,
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from './dto/order.dto';
import { OrderQueryOptions } from './dto/order.query-options.dto';
import {
  orderFilterableFields,
  orderSearchableFields,
} from './order.constants';
import {
  BillingInfo,
  Order,
  OrderDocument,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly couponService: CouponService,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async checkout(userId: string, payload: CheckoutDto): Promise<OrderDocument> {
    const cart = await this.cartService.getCartDocument(userId);

    const eligibleItems = (cart?.items || []).filter(
      (item) => item.isSelected !== false && !item.isOutOfStock,
    );

    if (eligibleItems.length === 0) {
      throw new BadRequestException(
        'No items selected or available for checkout',
      );
    }

    // Validate Coupon if provided
    let coupon: CouponDocument | undefined;
    if (payload.couponId) {
      coupon = await this.couponService.validateCoupon({
        userId,
        couponId: payload.couponId,
        orderAmount: cart.totalAmount,
      });
    }

    const billingInfo = this.calculateBilling(cart, coupon);

    // Validate Address via Event
    const [addressResult] = (await this.eventEmitter.emitAsync(
      UserEvents.VALIDATE_ADDRESS,
      new AddressValidateEvent({ userId, addressId: payload.addressId }),
    )) as AddressValidationResult[];

    if (!addressResult?.isValid) {
      throw new BadRequestException(
        addressResult?.error || 'Invalid shipping address',
      );
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const orderId = await this.generateNextOrderId(session);

      const orderItems = eligibleItems.map((item) => {
        const base = Number(item.price?.basePrice) || 0;
        const discount = Number(item.price?.discountPrice);
        const rate = Number(item.price?.discountRate);

        let unitPrice = base;
        if (!isNaN(discount) && discount > 0 && discount < base) {
          unitPrice = discount;
        } else if (!isNaN(rate) && rate > 0 && rate <= 100) {
          unitPrice = Math.round(base * (1 - rate / 100) * 100) / 100;
        }

        return {
          productId: item.productId,
          name: item.productName,
          thumbnail: item.productThumbnail,
          variantSku: item.variantSku,
          quantity: item.quantity,
          price: item.price,
          total: Math.round(unitPrice * item.quantity * 100) / 100,
        };
      });

      const order = new this.orderModel({
        orderId,
        userId: new Types.ObjectId(userId),
        items: orderItems,
        addressId: new Types.ObjectId(payload.addressId),
        status: OrderStatus.PENDING,
        billingInfo: {
          ...billingInfo,
          paymentMethod: payload.paymentIntent.method,
        },
        placedAt: new Date(),
        note: payload.note,
      });

      const savedOrder = await order.save({ session: session as any });

      // Deduct Inventory via Event (pass session for atomicity)
      for (const item of orderItems) {
        await this.eventEmitter.emitAsync(
          InventoryEvents.ADJUST_STOCK,
          new InventoryAdjustEvent({
            productId: item.productId.toString(),
            quantity: -item.quantity,
            type: InventoryTransactionType.SALE,
            variantSku: item.variantSku,
            referenceId: orderId,
            reason: `Order placement: ${orderId}`,
            session: session as any,
          }),
        );
      }

      // Clear Cart
      await this.cartService.clearCart(userId, session);

      // --- Payment Delegation ---
      const [paymentResult] = (await this.eventEmitter.emitAsync(
        OrderEvents.REQUEST_PAYMENT,
        new OrderPaymentRequestEvent({
          orderId: (savedOrder as any)._id.toString(),
          userId,
          totalAmount: billingInfo.payableAmount,
          paymentIntent: payload.paymentIntent,
          session: session as any,
        }),
      )) as PaymentRequestResult[];

      if (!paymentResult || paymentResult.status === 'FAILED') {
        throw new BadRequestException('Payment initiation failed');
      }

      // Update Order with payment result
      if (paymentResult.status === 'PAID') {
        savedOrder.billingInfo.paymentStatus = PaymentStatus.PAID;
        if (savedOrder.status === OrderStatus.PENDING) {
          savedOrder.status = OrderStatus.CONFIRMED;
          savedOrder.confirmedAt = new Date();
        }
      } else {
        savedOrder.billingInfo.paymentStatus = PaymentStatus.PENDING;
      }

      if (paymentResult.transactionId) {
        savedOrder.billingInfo.paymentTransactionId =
          paymentResult.transactionId;
      }

      const checkoutOrder = await savedOrder.save({ session: session as any });

      // Increment Coupon usage if applicable
      if (billingInfo.appliedCouponId) {
        const coupon = await this.couponService.findActiveCouponById(
          billingInfo.appliedCouponId.toString(),
          session as any,
        );
        if (coupon) {
          await this.couponService.incrementUsage(
            {
              couponId: coupon._id.toString(),
              userId: userId,
              orderId: savedOrder.orderId,
              discountAmount: billingInfo.couponDiscount,
            },
            session as any,
          );
        }
      }

      // Publish Event
      const event: OrderCreatedEvent = {
        orderId: savedOrder.orderId,
        userId: userId,
        items: orderItems.map((i) => ({
          productId: i.productId.toString(),
          name: i.name,
          variantSku: i.variantSku,
          quantity: i.quantity,
        })),
        totalAmount: savedOrder.billingInfo.totalAmount,
        payableAmount: savedOrder.billingInfo.payableAmount,
        timestamp: new Date(),
      };

      void this.eventEmitter.emit(OrderEvents.ORDER_CREATED, event);

      await session.commitTransaction();
      return {
        ...checkoutOrder.toObject(),
        paymentResult,
      } as any;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    order.status = dto.status;

    // Update timestamps based on status
    const now = new Date();
    switch (dto.status) {
      case OrderStatus.CONFIRMED:
        order.confirmedAt = now;
        break;
      case OrderStatus.SHIPPED:
        order.shippedAt = now;
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = now;
        order.billingInfo.paymentStatus = PaymentStatus.PAID; // Assuming COD becomes PAID on delivery
        break;
      case OrderStatus.CANCELLED:
        order.cancelledAt = now;
        order.cancellationReason = dto.reason || 'No reason provided';
        for (const item of order.items) {
          await this.eventEmitter.emitAsync(
            InventoryEvents.ADJUST_STOCK,
            new InventoryAdjustEvent({
              productId: item.productId.toString(),
              quantity: item.quantity,
              type: InventoryTransactionType.RETURN,
              variantSku: item.variantSku,
              referenceId: order.orderId,
              reason: `Order cancellation: ${order.orderId}`,
            }),
          );
        }
        break;
    }

    const updatedOrder = await order.save();
    void this.eventEmitter.emit(OrderEvents.ORDER_STATUS_UPDATED, {
      orderId: updatedOrder.orderId,
      userId: updatedOrder.userId?.toString(),
      status: updatedOrder.status,
      reason: updatedOrder.cancellationReason,
    });

    return updatedOrder;
  }

  async findAll(
    query: OrderQueryOptions,
  ): Promise<IPaginatedResponse<OrderDocument>> {
    const paginateQueries: any = pick(query, paginateOptions);
    if (paginateQueries.sortOrder) {
      paginateQueries.sortOrder = paginateQueries.sortOrder === 'asc' ? 1 : -1;
    }

    const { searchTerm, ...remainingFilters } = query;

    const filterQuery = {};

    if (searchTerm) {
      filterQuery['$or'] = orderSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }

    if (Object.keys(remainingFilters).length) {
      Object.entries(remainingFilters).forEach(([key, value]) => {
        if (orderFilterableFields.includes(key) && value) {
          if (
            (key === 'userId' || key === 'addressId') &&
            Types.ObjectId.isValid(value as string)
          ) {
            filterQuery[key] = new Types.ObjectId(value as string);
          } else {
            filterQuery[key] = value;
          }
        }
      });
    }

    // Special handling for nested paymentStatus in remainingFilters if passed as such,
    // but DTO maps it to top level. Let's ensure it maps correctly to billingInfo.paymentStatus
    if (query.paymentStatus) {
      delete filterQuery['paymentStatus'];
      filterQuery['billingInfo.paymentStatus'] = query.paymentStatus;
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<OrderDocument>({
      model: this.orderModel,
      paginationQuery: pagination,
      filterQuery,
      populate: ['addressId'],
    });
  }

  async findAllByUser(
    userId: string,
    query: OrderQueryOptions,
  ): Promise<IPaginatedResponse<OrderDocument>> {
    query.userId = userId;
    return this.findAll(query);
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).populate('addressId');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrderByOrderId(
    userId: string,
    orderId: string,
  ): Promise<OrderDocument> {
    const isObjectId = Types.ObjectId.isValid(orderId);
    const filterQuery: any = {
      userId: new Types.ObjectId(userId),
    };

    if (isObjectId) {
      filterQuery.$or = [{ orderId }, { _id: new Types.ObjectId(orderId) }];
    } else {
      filterQuery.orderId = orderId;
    }

    const order = await this.orderModel
      .findOne(filterQuery)
      .populate('addressId');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updatePaymentStatus(
    id: string,
    dto: UpdatePaymentStatusDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    order.billingInfo.paymentStatus = dto.status;
    if (dto.transactionId) {
      order.billingInfo.paymentTransactionId = dto.transactionId;
    }
    if (dto.failureReason) {
      order.billingInfo.paymentFailureReason = dto.failureReason;
    }

    if (dto.status === PaymentStatus.PAID) {
      // If payment is successful and order is PENDING, we might want to move it to CONFIRMED
      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.CONFIRMED;
        order.confirmedAt = new Date();
      }
    }

    const updatedOrder = await order.save();
    void this.eventEmitter.emit(OrderEvents.ORDER_STATUS_UPDATED, {
      orderId: updatedOrder.orderId,
      userId: updatedOrder.userId?.toString(),
      status: updatedOrder.status,
      paymentStatus: updatedOrder.billingInfo.paymentStatus,
    });

    return updatedOrder;
  }

  async cancelOrder(
    userId: string,
    orderId: string,
    dto: CancelOrderDto,
  ): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({
      orderId,
      userId: new Types.ObjectId(userId),
    });
    if (!order) throw new NotFoundException('Order not found');

    // Only allow cancellation if order is PENDING or CONFIRMED
    const cancellableStatuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Order cannot be cancelled in ${order.status} status`,
      );
    }

    return this.updateStatus(order._id as string, {
      status: OrderStatus.CANCELLED,
      reason: dto.reason,
    });
  }

  async retryPayment(
    userId: string,
    orderId: string,
    dto: RetryPaymentDto,
  ): Promise<any> {
    const order = Types.ObjectId.isValid(orderId)
      ? await this.orderModel.findOne({
          $or: [{ _id: new Types.ObjectId(orderId) }, { orderId }],
          userId: new Types.ObjectId(userId),
        })
      : await this.orderModel.findOne({
          orderId,
          userId: new Types.ObjectId(userId),
        });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot retry payment for a cancelled order');
    }

    if (order.billingInfo.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    order.billingInfo.paymentMethod = dto.paymentMethod;
    order.billingInfo.paymentAttempt =
      (order.billingInfo.paymentAttempt || 0) + 1;
    order.billingInfo.paymentFailureReason = undefined;

    // For COD: remain in PENDING status awaiting admin confirmation
    if (dto.paymentMethod === PaymentMethod.COD) {
      order.billingInfo.paymentStatus = PaymentStatus.PENDING;
      order.status = OrderStatus.PENDING;
      order.set('confirmedAt', undefined);
      const updatedOrder = await order.save();
      return {
        ...updatedOrder.toObject(),
        paymentResult: {
          status: PaymentStatus.PENDING,
        },
      };
    }

    // For online methods (CARD, MFS), re-delegate payment request
    const [paymentResult] = (await this.eventEmitter.emitAsync(
      OrderEvents.REQUEST_PAYMENT,
      new OrderPaymentRequestEvent({
        orderId: (order as any)._id.toString(),
        userId,
        totalAmount: order.billingInfo.payableAmount,
        paymentIntent: { method: dto.paymentMethod },
      }),
    )) as PaymentRequestResult[];

    if (!paymentResult || paymentResult.status === 'FAILED') {
      throw new BadRequestException('Payment initiation failed');
    }

    if (paymentResult.transactionId) {
      order.billingInfo.paymentTransactionId = paymentResult.transactionId;
    }

    if (paymentResult.status === 'PAID') {
      order.billingInfo.paymentStatus = PaymentStatus.PAID;
      order.status = OrderStatus.CONFIRMED;
      order.confirmedAt = new Date();
    } else {
      order.billingInfo.paymentStatus = PaymentStatus.PENDING;
    }

    const updatedOrder = await order.save();

    return {
      ...updatedOrder.toObject(),
      paymentResult,
    };
  }

  async getStats(): Promise<any> {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$billingInfo.paymentStatus', PaymentStatus.PAID] },
                '$billingInfo.payableAmount',
                0,
              ],
            },
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.PENDING] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', OrderStatus.CONFIRMED] }, 1, 0],
            },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', OrderStatus.SHIPPED] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', OrderStatus.DELIVERED] }, 1, 0],
            },
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ['$status', OrderStatus.CANCELLED] }, 1, 0],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      }
    );
  }

  async applyCoupon(userId: string, dto: ApplyCouponDto): Promise<BillingInfo> {
    const cart = await this.cartService.getCartDocument(userId);

    // Validate coupon
    const coupon = await this.couponService.validateCoupon({
      code: dto.code,
      userId,
      orderAmount: cart.totalAmount,
    });

    return this.calculateBilling(cart, coupon);
  }

  async removeCoupon(userId: string): Promise<BillingInfo> {
    const cart = await this.cartService.getCartDocument(userId);
    return this.calculateBilling(cart);
  }

  private calculateBilling(
    cart: CartDocument,
    coupon?: CouponDocument,
  ): BillingInfo {
    const totalAmount = cart.totalAmount || 0;
    const itemLevelDiscount = cart.totalDiscount || 0;
    const discountedSubTotal = Math.max(0, totalAmount - itemLevelDiscount);
    let couponDiscount = 0;

    // Delivery fee rule: Free if subtotal >= 500 or subtotal is 0, otherwise standard 60 BDT
    const freeDeliveryThreshold = 500;
    const defaultDeliveryFee = 60;
    let deliveryCharge =
      discountedSubTotal === 0 || discountedSubTotal >= freeDeliveryThreshold
        ? 0
        : defaultDeliveryFee;

    if (coupon && discountedSubTotal > 0) {
      if (coupon.discountType === DiscountType.PERCENTAGE) {
        const rawDiscount = Math.round(
          (discountedSubTotal * coupon.discountValue) / 100,
        );
        couponDiscount =
          coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0
            ? Math.min(rawDiscount, coupon.maxDiscountAmount)
            : rawDiscount;
        couponDiscount = Math.min(couponDiscount, discountedSubTotal);
      } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
        couponDiscount = Math.min(coupon.discountValue, discountedSubTotal);
      } else if ((coupon.discountType as any) === 'FREE_SHIPPING') {
        deliveryCharge = 0;
        couponDiscount = 0;
      }
    }

    const payableAmount = Math.max(
      0,
      discountedSubTotal - couponDiscount + deliveryCharge,
    );

    return {
      totalAmount,
      discount: itemLevelDiscount,
      appliedCouponId: coupon?._id,
      couponDiscount,
      deliveryCharge,
      payableAmount,
      walletUsed: 0,
      cashbackUsed: 0,
      paymentStatus: PaymentStatus.PENDING,
      paymentAttempt: 0,
    };
  }

  @OnEvent(PaymentEvents.PAYMENT_COMPLETED)
  async handlePaymentCompleted(event: PaymentCompletedEvent) {
    const order = Types.ObjectId.isValid(event.orderId)
      ? await this.orderModel.findById(event.orderId)
      : await this.orderModel.findOne({ orderId: event.orderId });

    if (!order) return;

    order.billingInfo.paymentStatus = PaymentStatus.PAID;
    order.billingInfo.paymentTransactionId = event.transactionId;
    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CONFIRMED;
      order.confirmedAt = event.paidAt || new Date();
    }
    await order.save();
  }

  @OnEvent(PaymentEvents.PAYMENT_FAILED)
  async handlePaymentFailed(event: PaymentFailedEvent) {
    const order = Types.ObjectId.isValid(event.orderId)
      ? await this.orderModel.findById(event.orderId)
      : await this.orderModel.findOne({ orderId: event.orderId });

    if (!order) return;

    order.billingInfo.paymentStatus = PaymentStatus.FAILED;
    order.billingInfo.paymentTransactionId = event.transactionId;
    order.billingInfo.paymentFailureReason = event.reason;
    await order.save();
  }

  private async generateNextOrderId(session?: any): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Atomic increment directly on MongoDB counters collection (no extra Mongoose schema needed)
    const result = await this.connection
      .collection('counters')
      .findOneAndUpdate(
        { _id: `order_${dateStr}` as any },
        { $inc: { seq: 1 } },
        {
          upsert: true,
          returnDocument: 'after',
          session: session || undefined,
        },
      );

    const seq = (result as any)?.seq ?? (result as any)?.value?.seq ?? 1;
    const sequence = seq.toString().padStart(4, '0');
    return `ORD-${dateStr}-${sequence}`; // e.g. ORD-260915-0001
  }
}
