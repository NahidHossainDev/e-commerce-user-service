import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @ApiProperty({ example: 'Wireless Headphones' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'SKU-123-WH' })
  @Prop()
  variantSku: string;

  @ApiProperty({ example: 1 })
  @Prop({ required: true, min: 1 })
  quantity: number; // Quantity to refund

  @ApiProperty({ example: 1500 })
  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @ApiProperty({ example: 1500 })
  @Prop({ required: true, min: 0 })
  totalAmount: number; // quantity * unitPrice

  @ApiProperty({ example: 'Damaged during shipping' })
  @Prop()
  reason: string; // Item-specific reason if different from main reason
}

@Schema({ _id: false })
export class RefundAmount {
  @ApiProperty({ example: 1500 })
  @Prop({ required: true, min: 0 })
  itemsTotal: number; // Total amount for refunded items

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  shippingRefund: number; // Shipping charge refund

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  taxRefund: number; // Tax refund if applicable

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  couponRefund: number; // Coupon discount to be reversed

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  walletRefund: number; // Wallet cash used to be refunded

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  processingFee: number; // Deduction for processing (if any)

  @ApiProperty({ example: 0 })
  @Prop({ default: 0, min: 0 })
  restockingFee: number; // Restocking fee (if applicable)

  @ApiProperty({ example: 1500 })
  @Prop({ required: true, min: 0 })
  totalRefundAmount: number; // Final amount to be refunded

  @ApiProperty({ example: 'BDT' })
  @Prop({ required: true, default: 'BDT' })
  currency: string;
}

@Schema({ _id: false })
export class RefundEvidence {
  @ApiProperty({ type: [String], example: ['http://example.com/image1.jpg'] })
  @Prop({ type: [String], default: [] })
  images: string[]; // URLs to uploaded images

  @ApiProperty({ type: [String], example: [] })
  @Prop({ type: [String], default: [] })
  videos: string[]; // URLs to uploaded videos

  @ApiProperty({ example: 'The box was torn when I received it.' })
  @Prop()
  description: string; // Customer's description of the issue

  @ApiProperty({ type: [String], example: [] })
  @Prop({ type: [String], default: [] })
  documents: string[]; // Any supporting documents
}

@Schema({ _id: false })
export class RefundTimeline {
  @ApiProperty({ example: '2024-01-01T10:00:00Z' })
  @Prop({ required: true })
  requestedAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z', required: false })
  @Prop()
  approvedAt: Date;

  @ApiProperty({ example: '2024-01-01T12:00:00Z', required: false })
  @Prop()
  rejectedAt: Date;

  @ApiProperty({ example: '2024-01-01T14:00:00Z', required: false })
  @Prop()
  processingStartedAt: Date;

  @ApiProperty({ example: '2024-01-01T16:00:00Z', required: false })
  @Prop()
  completedAt: Date;

  @ApiProperty({ example: '2024-01-01T16:00:00Z', required: false })
  @Prop()
  failedAt: Date;

  @ApiProperty({ example: '2024-01-01T11:00:00Z', required: false })
  @Prop()
  cancelledAt: Date;
}

@Schema({ _id: false })
export class AdminAction {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @ApiProperty({ example: 'APPROVED' })
  @Prop({ required: true })
  action: string; // 'APPROVED', 'REJECTED', 'PROCESSED', etc.

  @ApiProperty({ example: 'Looks valid.' })
  @Prop()
  note: string; // Admin's note/comment

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

@Schema({ _id: false })
export class PaymentGatewayResponse {
  @ApiProperty({ example: 'sslcommerz' })
  @Prop({ required: true })
  gateway: string; // 'stripe', 'paypal', 'sslcommerz', etc.

  @ApiProperty({ example: 'txn_123456' })
  @Prop()
  transactionId: string; // Gateway transaction ID

  @ApiProperty({ example: 'ref_123456' })
  @Prop()
  refundId: string; // Gateway refund ID

  @ApiProperty({ example: 'SUCCESS' })
  @Prop()
  status: string; // Gateway-specific status

  @ApiProperty({ type: Object })
  @Prop({ type: Object })
  rawResponse: Record<string, any>; // Full gateway response

  @ApiProperty({ example: '2024-01-01T16:00:00Z' })
  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true, collection: 'refunds' })
export class Refund {
  @ApiProperty({ example: '#REF-12345' })
  @Prop({ required: true, unique: true, index: true })
  refundId: string; // Human readable ID like #REF-12345

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @ApiProperty({ example: 'ORD-12345' })
  @Prop({ required: true, index: true })
  orderNumber: string; // Human readable order ID for reference

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @ApiProperty({ enum: RefundType, example: RefundType.FULL })
  @Prop({
    required: true,
    enum: RefundType,
    default: RefundType.FULL,
  })
  refundType: RefundType;

  @ApiProperty({ enum: RefundStatus, example: RefundStatus.PENDING_APPROVAL })
  @Prop({
    required: true,
    enum: RefundStatus,
    default: RefundStatus.REQUESTED,
    index: true,
  })
  status: RefundStatus;

  @ApiProperty({ enum: RefundReason, example: RefundReason.DAMAGED_PRODUCT })
  @Prop({
    required: true,
    enum: RefundReason,
  })
  reason: RefundReason;

  @ApiProperty({ example: 'The product was broken upon arrival.' })
  @Prop()
  reasonDetails: string; // Additional details about the reason

  @ApiProperty({ type: [RefundItem] })
  @Prop({ type: [RefundItem] })
  items: RefundItem[]; // Items to refund (for PARTIAL refunds)

  @ApiProperty({ type: RefundAmount })
  @Prop({ required: true, type: RefundAmount })
  refundAmount: RefundAmount;

  @ApiProperty({ enum: RefundMethod, example: RefundMethod.ORIGINAL_PAYMENT })
  @Prop({
    required: true,
    enum: RefundMethod,
    default: RefundMethod.ORIGINAL_PAYMENT,
  })
  refundMethod: RefundMethod;

  @ApiProperty({ type: RefundEvidence })
  @Prop({ type: RefundEvidence })
  evidence: RefundEvidence; // Customer-provided evidence

  @ApiProperty({ type: RefundTimeline })
  @Prop({ type: RefundTimeline, required: true })
  timeline: RefundTimeline;

  @ApiProperty({ type: [AdminAction] })
  @Prop({ type: [AdminAction], default: [] })
  adminActions: AdminAction[]; // History of admin actions

  @ApiProperty({ type: PaymentGatewayResponse })
  @Prop({ type: PaymentGatewayResponse })
  paymentGatewayResponse: PaymentGatewayResponse; // Gateway response

  @ApiProperty({ example: 'Insufficient evidence.', required: false })
  @Prop()
  rejectionReason: string; // Reason if refund is rejected

  @ApiProperty({ example: 'Gateway timeout.', required: false })
  @Prop()
  failureReason: string; // Reason if refund processing failed

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isStockRestored: boolean; // Whether inventory was restored

  @ApiProperty({ example: '2024-01-01T12:00:00Z', required: false })
  @Prop()
  stockRestoredAt: Date;

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isCouponRestored: boolean; // Whether coupon was restored (if applicable)

  @ApiProperty({ example: '2024-01-01T12:00:00Z', required: false })
  @Prop()
  couponRestoredAt: Date;

  @ApiProperty({ type: Object, required: false })
  @Prop({ type: Object })
  metadata: Record<string, any>; // Additional metadata

  @ApiProperty({ example: 'Customer called to follow up.', required: false })
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
