import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppCurrency } from 'src/common/constants';
import {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from 'src/common/interface';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  transactionId: string; // Internal unique transaction ID

  @Prop({ index: true })
  gatewayTransactionId?: string; // Transaction ID from payment gateway (SSL, bKash, etc.)

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: AppCurrency.BDT })
  currency: AppCurrency;

  @Prop({
    required: true,
    enum: PaymentMethod,
    index: true,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    required: true,
    enum: PaymentProvider,
    index: true,
  })
  paymentProvider: PaymentProvider;

  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    index: true,
  })
  status: PaymentStatus;

  @Prop({ type: Object })
  gatewayResponse?: Record<string, any>;

  @Prop()
  failureReason?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  paidAt?: Date;

  @Prop()
  refundedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ userId: 1, orderId: 1 });
