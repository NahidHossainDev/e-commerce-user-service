import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
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
import { DiscountType } from '../coupon/schemas/coupon.schema';
import {
  ApplyCouponDto,
  CancelOrderDto,
  CheckoutDto,
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from './dto/order.dto';
import { OrderQueryOptions } from './dto/order.query-options.dto';
import {
  orderFilterableFields,
  orderSearchableFields,
} from './order.constants';
import { OrderCreatedEvent, OrderEvents } from './order.events';
import {
  BillingInfo,
  Order,
  OrderDocument,
  OrderStatus,
  PaymentStatus,
} from './schemas/order.schema';
import { generateOrderId } from './utils/order.utils';

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
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
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
      const orderId = generateOrderId();

      const orderItems = cart.items.map((item) => {
        const unitPrice =
          item.price.discountPrice > 0
            ? item.price.discountPrice
            : item.price.basePrice;
        return {
          productId: item.productId,
          name: item.productName,
          thumbnail: item.productThumbnail,
          variantSku: item.variantSku,
          quantity: item.quantity,
          price: item.price,
          total: unitPrice * item.quantity,
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

      // Increment Coupon usage if applicable
      if (billingInfo.appliedCouponId) {
        const coupon = await this.couponService.findActiveCouponById(
          billingInfo.appliedCouponId.toString(),
        );
        await this.couponService.incrementUsage(
          {
            couponId: coupon._id.toString(),
            userId: userId,
            orderId: savedOrder.orderId,
            discountAmount: billingInfo.couponDiscount,
          },
          session,
        );
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
      return savedOrder;
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
        break;
    }

    const updatedOrder = await order.save();
    void this.eventEmitter.emit(OrderEvents.ORDER_STATUS_UPDATED, {
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
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
          filterQuery[key] = value;
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

    const result = await getPaginatedData<OrderDocument>({
      model: this.orderModel,
      paginationQuery: pagination,
      filterQuery,
    });

    // Populate data
    result.data = (await this.orderModel.populate(result.data, [
      { path: 'userId' },
      { path: 'addressId' },
    ])) as any;

    return result;
  }

  async findAllByUser(
    userId: string,
    query: OrderQueryOptions,
  ): Promise<IPaginatedResponse<OrderDocument>> {
    query.userId = userId;
    return this.findAll(query);
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate(['userId', 'addressId']);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getOrderByOrderId(
    userId: string,
    orderId: string,
  ): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({ orderId, userId: new Types.ObjectId(userId) })
      .populate(['userId', 'addressId']);
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
    const cart = await this.cartService.getCart(userId);

    // Validate coupon
    const coupon = await this.couponService.validateCoupon({
      code: dto.code,
      userId,
      orderAmount: cart.totalAmount,
    });

    return this.calculateBilling(cart, coupon);
  }

  async removeCoupon(userId: string): Promise<BillingInfo> {
    const cart = await this.cartService.getCart(userId);
    return this.calculateBilling(cart);
  }

  private calculateBilling(
    cart: CartDocument,
    coupon?: CouponDocument,
  ): BillingInfo {
    const totalAmount = cart.totalAmount;
    const itemLevelDiscount = cart.totalDiscount || 0;
    let couponDiscount = 0;
    const deliveryCharge = 0; // TODO: Implement delivery charge logic if needed

    if (coupon) {
      if (coupon.discountType === DiscountType.PERCENTAGE) {
        couponDiscount = (totalAmount * coupon.discountValue) / 100;
        if (
          coupon.maxDiscountAmount &&
          couponDiscount > coupon.maxDiscountAmount
        ) {
          couponDiscount = coupon.maxDiscountAmount;
        }
      } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
        couponDiscount = Math.min(coupon.discountValue, totalAmount);
      }
    }

    const totalDiscount = itemLevelDiscount + couponDiscount;
    const payableAmount = Math.max(
      0,
      totalAmount - totalDiscount + deliveryCharge,
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
}
