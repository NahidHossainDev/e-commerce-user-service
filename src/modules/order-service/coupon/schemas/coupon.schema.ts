import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: DiscountType })
  discountType: DiscountType;

  @Prop({ required: true, min: 0 })
  discountValue: number;

  @Prop({ min: 0 })
  maxDiscountAmount: number;

  @Prop({ min: 0 })
  minOrderAmount: number;

  @Prop({ required: true })
  validFrom: Date;

  @Prop({ required: true })
  validTo: Date;

  @Prop({ default: 0 })
  usageLimit: number;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ default: 1 })
  usageLimitPerUser: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false, index: true })
  isPublic: boolean;

  @Prop({ default: false })
  isFirstOrderOnly: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  eligibleUserIds: Types.ObjectId[];

  @Prop({ type: Object })
  rules: Record<string, any>;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.index({ isPublic: 1, isActive: 1, validTo: 1 });
