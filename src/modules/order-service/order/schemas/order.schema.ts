import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  OrderStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from 'src/common/interface';
import { Price } from '../../../../common/schemas';
export { OrderStatus, PaymentMethod, PaymentProvider, PaymentStatus };

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop()
  variantSku: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Price })
  price: Price;

  @Prop({ required: true, min: 0 })
  total: number;
}

@Schema({ _id: false })
export class BillingInfo {
  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ type: Types.ObjectId, ref: 'Coupon', required: false })
  appliedCouponId?: Types.ObjectId;

  @Prop({ default: 0 })
  couponDiscount: number;

  @Prop({ default: 0 })
  deliveryCharge: number;

  @Prop({ required: true, min: 0 })
  payableAmount: number;

  @Prop({ default: 0 })
  walletUsed: number;

  @Prop({ default: 0 })
  cashbackUsed: number;

  @Prop({ enum: PaymentMethod, required: false })
  paymentMethod?: PaymentMethod;

  @Prop({ enum: PaymentProvider, required: false })
  paymentProvider?: PaymentProvider;

  @Prop({ default: PaymentStatus.PENDING, enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @Prop()
  paymentTransactionId?: string;

  @Prop()
  paymentFailureReason?: string;

  @Prop({ default: 0 })
  paymentAttempt: number;
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  orderId: string; // Human readable ID like #ORD-12345

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Address' })
  addressId: Types.ObjectId;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: OrderStatus;

  @Prop({ required: true })
  billingInfo: BillingInfo;

  @Prop()
  placedAt: Date;

  @Prop()
  confirmedAt: Date;

  @Prop()
  shippedAt: Date;

  @Prop()
  deliveredAt: Date;

  @Prop()
  cancelledAt: Date;

  @Prop()
  cancellationReason: string;

  @Prop({ default: false })
  hasRefund: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Refund' }], default: [] })
  refundIds: Types.ObjectId[];

  @Prop({ default: 0, min: 0 })
  totalRefundedAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderId: 1 }, { unique: true });
