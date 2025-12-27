import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Price } from '../../../../common/schemas';

export type OrderDocument = Order & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

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

  @Prop()
  couponCode: string;

  @Prop({ default: 0 })
  couponDiscount: number;

  @Prop({ default: 0 })
  deliveryCharge: number;

  @Prop({ required: true, min: 0 })
  payableAmount: number;

  @Prop({ default: PaymentStatus.PENDING, enum: PaymentStatus })
  paymentStatus: string;
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
  status: string;

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
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderId: 1 }, { unique: true });
