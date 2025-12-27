import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { CartService } from 'src/modules/order-service/cart/cart.service';
import { CouponService } from 'src/modules/order-service/coupon/coupon.service';
import { CheckoutDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderCreatedEvent, OrderEvents } from './order.events';
import {
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

  // --- Order Placement ---

  async checkout(userId: string, payload: CheckoutDto): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate Coupon if provided
    if (payload.couponCode) {
      await this.couponService.validateCoupon({
        code: payload.couponCode,
        userId,
        orderAmount: cart.totalAmount,
      });
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
          totalAmount: cart.totalAmount,
          discount: cart.totalDiscount,
          couponCode: payload.couponCode || '',
          payableAmount: cart.payableAmount,
          paymentStatus: PaymentStatus.PENDING,
        },
        placedAt: new Date(),
      });

      const savedOrder = await order.save({ session: session as any });

      // Clear Cart
      await this.cartService.clearCart(userId, session);

      // Increment Coupon usage if applicable
      if (payload.couponCode) {
        const coupon = await this.couponService.findByActiveCode(
          payload.couponCode,
        );
        await this.couponService.incrementUsage(
          {
            couponId: coupon._id.toString(),
            userId: userId,
            orderId: savedOrder.orderId,
            discountAmount: coupon.discountValue,
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
}
