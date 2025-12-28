import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefundDocument = Refund & Document;

export enum RefundStatus {
  REQUESTED = 'REQUESTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum RefundType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  SHIPPING = 'SHIPPING',
}

export enum RefundReason {
  DAMAGED_PRODUCT = 'DAMAGED_PRODUCT',
  WRONG_ITEM = 'WRONG_ITEM',
  DEFECTIVE_PRODUCT = 'DEFECTIVE_PRODUCT',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  SIZE_FIT_ISSUE = 'SIZE_FIT_ISSUE',
  LATE_DELIVERY = 'LATE_DELIVERY',
  CUSTOMER_CHANGED_MIND = 'CUSTOMER_CHANGED_MIND',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  FRAUDULENT_ORDER = 'FRAUDULENT_ORDER',
  OTHER = 'OTHER',
}

export enum RefundMethod {
  ORIGINAL_PAYMENT = 'ORIGINAL_PAYMENT', // Refund to original payment method
  WALLET = 'WALLET', // Refund to user wallet
  BANK_TRANSFER = 'BANK_TRANSFER', // Direct bank transfer
  STORE_CREDIT = 'STORE_CREDIT', // Store credit/voucher
}

@Schema({ _id: false })
export class RefundItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  variantSku: string;

  @Prop({ required: true, min: 1 })
  quantity: number; // Quantity to refund

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop({ required: true, min: 0 })
  totalAmount: number; // quantity * unitPrice

  @Prop()
  reason: string; // Item-specific reason if different from main reason
}

@Schema({ _id: false })
export class RefundAmount {
  @Prop({ required: true, min: 0 })
  itemsTotal: number; // Total amount for refunded items

  @Prop({ default: 0, min: 0 })
  shippingRefund: number; // Shipping charge refund

  @Prop({ default: 0, min: 0 })
  taxRefund: number; // Tax refund if applicable

  @Prop({ default: 0, min: 0 })
  couponRefund: number; // Coupon discount to be reversed

  @Prop({ default: 0, min: 0 })
  walletRefund: number; // Wallet cash used to be refunded

  @Prop({ default: 0, min: 0 })
  processingFee: number; // Deduction for processing (if any)

  @Prop({ default: 0, min: 0 })
  restockingFee: number; // Restocking fee (if applicable)

  @Prop({ required: true, min: 0 })
  totalRefundAmount: number; // Final amount to be refunded

  @Prop({ required: true, default: 'BDT' })
  currency: string;
}

@Schema({ _id: false })
export class RefundEvidence {
  @Prop({ type: [String], default: [] })
  images: string[]; // URLs to uploaded images

  @Prop({ type: [String], default: [] })
  videos: string[]; // URLs to uploaded videos

  @Prop()
  description: string; // Customer's description of the issue

  @Prop({ type: [String], default: [] })
  documents: string[]; // Any supporting documents
}

@Schema({ _id: false })
export class RefundTimeline {
  @Prop({ required: true })
  requestedAt: Date;

  @Prop()
  approvedAt: Date;

  @Prop()
  rejectedAt: Date;

  @Prop()
  processingStartedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  failedAt: Date;

  @Prop()
  cancelledAt: Date;
}

@Schema({ _id: false })
export class AdminAction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @Prop({ required: true })
  action: string; // 'APPROVED', 'REJECTED', 'PROCESSED', etc.

  @Prop()
  note: string; // Admin's note/comment

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

@Schema({ _id: false })
export class PaymentGatewayResponse {
  @Prop({ required: true })
  gateway: string; // 'stripe', 'paypal', 'sslcommerz', etc.

  @Prop()
  transactionId: string; // Gateway transaction ID

  @Prop()
  refundId: string; // Gateway refund ID

  @Prop()
  status: string; // Gateway-specific status

  @Prop({ type: Object })
  rawResponse: Record<string, any>; // Full gateway response

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true, collection: 'refunds' })
export class Refund {
  @Prop({ required: true, unique: true, index: true })
  refundId: string; // Human readable ID like #REF-12345

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ required: true, index: true })
  orderNumber: string; // Human readable order ID for reference

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: RefundType,
    default: RefundType.FULL,
  })
  refundType: string;

  @Prop({
    required: true,
    enum: RefundStatus,
    default: RefundStatus.REQUESTED,
    index: true,
  })
  status: string;

  @Prop({
    required: true,
    enum: RefundReason,
  })
  reason: string;

  @Prop()
  reasonDetails: string; // Additional details about the reason

  @Prop({ type: [RefundItem] })
  items: RefundItem[]; // Items to refund (for PARTIAL refunds)

  @Prop({ required: true, type: RefundAmount })
  refundAmount: RefundAmount;

  @Prop({
    required: true,
    enum: RefundMethod,
    default: RefundMethod.ORIGINAL_PAYMENT,
  })
  refundMethod: string;

  @Prop({ type: RefundEvidence })
  evidence: RefundEvidence; // Customer-provided evidence

  @Prop({ type: RefundTimeline, required: true })
  timeline: RefundTimeline;

  @Prop({ type: [AdminAction], default: [] })
  adminActions: AdminAction[]; // History of admin actions

  @Prop({ type: PaymentGatewayResponse })
  paymentGatewayResponse: PaymentGatewayResponse; // Gateway response

  @Prop()
  rejectionReason: string; // Reason if refund is rejected

  @Prop()
  failureReason: string; // Reason if refund processing failed

  @Prop({ default: false })
  isStockRestored: boolean; // Whether inventory was restored

  @Prop()
  stockRestoredAt: Date;

  @Prop({ default: false })
  isCouponRestored: boolean; // Whether coupon was restored (if applicable)

  @Prop()
  couponRestoredAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>; // Additional metadata

  @Prop()
  internalNotes: string; // Internal notes for staff only
}

export const RefundSchema = SchemaFactory.createForClass(Refund);

// Indexes for efficient queries
RefundSchema.index({ createdAt: -1 });
RefundSchema.index({ refundId: 1 }, { unique: true });
RefundSchema.index({ orderId: 1, status: 1 });
RefundSchema.index({ userId: 1, status: 1 });
RefundSchema.index({ status: 1, createdAt: -1 });
RefundSchema.index({ 'timeline.requestedAt': -1 });
