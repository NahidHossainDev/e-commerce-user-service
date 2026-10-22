import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type IssueDocument = Issue & Document;

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum IssueType {
  DAMAGED_PACKAGE = 'DAMAGED_PACKAGE',
  MISSING_ITEMS = 'MISSING_ITEMS',
  WRONG_ITEM_DELIVERED = 'WRONG_ITEM_DELIVERED',
  DELIVERY_DELAY = 'DELIVERY_DELAY',
  BILLING_ISSUE = 'BILLING_ISSUE',
  PRODUCT_QUALITY = 'PRODUCT_QUALITY',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  OTHER = 'OTHER',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ResolutionAction {
  REFUND_OFFERED = 'REFUND_OFFERED',
  REPLACEMENT_SENT = 'REPLACEMENT_SENT',
  COUPON_ISSUED = 'COUPON_ISSUED',
  EXPLAINED_TO_CUSTOMER = 'EXPLAINED_TO_CUSTOMER',
  NO_ACTION_REQUIRED = 'NO_ACTION_REQUIRED',
  OTHER = 'OTHER',
}

@Schema({ _id: false })
export class IssueItem {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @ApiProperty({ example: 'Wireless Headphones' })
  @Prop()
  name: string;

  @ApiProperty({ example: 'SKU-123-WH' })
  @Prop()
  variantSku?: string;

  @ApiProperty({ example: 1 })
  @Prop({ default: 1 })
  quantity: number;

  @ApiProperty({ example: 'Broken seal on box' })
  @Prop()
  notes?: string;
}

@Schema({ _id: false })
export class IssueTimeline {
  @ApiProperty({ example: 'STATUS_CHANGED' })
  @Prop({ required: true })
  action: string;

  @ApiProperty({ enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'], example: 'ADMIN' })
  @Prop({ required: true, enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'] })
  actorType: string;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  actorId?: Types.ObjectId;

  @ApiProperty({ example: 'Investigating delivery logs with courier' })
  @Prop()
  notes?: string;

  @ApiProperty({ example: '2026-10-22T10:00:00.000Z' })
  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Issue {
  @ApiProperty({ example: 'ISS-20261022-1001' })
  @Prop({ required: true, unique: true, index: true })
  issueNumber: string;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e2' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @ApiProperty({ enum: IssueType, example: IssueType.DAMAGED_PACKAGE })
  @Prop({ type: String, enum: IssueType, required: true, index: true })
  type: IssueType;

  @ApiProperty({ example: 'Parcel was arrived crushed with broken seal' })
  @Prop({ required: true })
  subject: string;

  @ApiProperty({ example: 'The delivery box was torn open and 1 item is missing' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ enum: IssuePriority, example: IssuePriority.MEDIUM })
  @Prop({
    type: String,
    enum: IssuePriority,
    default: IssuePriority.MEDIUM,
    index: true,
  })
  priority: IssuePriority;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.OPEN })
  @Prop({
    type: String,
    enum: IssueStatus,
    default: IssueStatus.OPEN,
    index: true,
  })
  status: IssueStatus;

  @ApiProperty({ type: [IssueItem] })
  @Prop({ type: [IssueItem], default: [] })
  items: IssueItem[];

  @ApiProperty({
    type: [String],
    example: ['https://storage.example.com/box1.jpg'],
  })
  @Prop({ type: [String], default: [] })
  attachments: string[];

  @ApiProperty({ example: 'Customer called, verified courier damage receipt' })
  @Prop()
  adminNotes?: string;

  @ApiProperty({ example: 'Replacement sent via express delivery #TRK-992' })
  @Prop()
  resolutionNotes?: string;

  @ApiProperty({ enum: ResolutionAction })
  @Prop({ type: String, enum: ResolutionAction })
  resolutionAction?: ResolutionAction;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  resolvedBy?: Types.ObjectId;

  @ApiProperty()
  @Prop()
  resolvedAt?: Date;

  @ApiProperty({ type: [IssueTimeline] })
  @Prop({ type: [IssueTimeline], default: [] })
  timeline: IssueTimeline[];
}

export const IssueSchema = SchemaFactory.createForClass(Issue);

IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ status: 1, priority: 1 });
