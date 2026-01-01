import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
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
import { CartService } from 'src/modules/order-service/cart/cart.service';
import { CartDocument } from 'src/modules/order-service/cart/schemas/cart.schema';
import { CouponService } from 'src/modules/order-service/coupon/coupon.service';
import { CouponDocument } from 'src/modules/order-service/coupon/schemas/coupon.schema';
import { DiscountType } from '../coupon/schemas/coupon.schema';
import {
  ApplyCouponDto,
  CheckoutDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import { OrderCreatedEvent, OrderEvents } from './order.events';
import {
  BillingInfo,
  Order,
  OrderDocument,
  OrderStatus,
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
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
          paymentMethod: payload.paymentIntent.method as any,
          paymentProvider: payload.paymentIntent.provider,
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

      this.eventEmitter.emit(OrderEvents.ORDER_CREATED, event);

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
    if (dto.status === OrderStatus.CANCELLED) {
      order.cancelledAt = new Date();
      order.cancellationReason = dto.reason || 'No reason provided';
    }

    const updatedOrder = await order.save();
    this.eventEmitter.emit(OrderEvents.ORDER_STATUS_UPDATED, {
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
    });

    return updatedOrder;
  }

  async findAllByUser(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
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
      if (coupon.discountType === DiscountType.PERCENTAGE.toString()) {
        couponDiscount = (totalAmount * coupon.discountValue) / 100;
        if (
          coupon.maxDiscountAmount &&
          couponDiscount > coupon.maxDiscountAmount
        ) {
          couponDiscount = coupon.maxDiscountAmount;
        }
      } else if (coupon.discountType === DiscountType.FIXED_AMOUNT.toString()) {
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
