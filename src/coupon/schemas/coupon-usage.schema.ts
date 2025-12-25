import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CouponUsageDocument = HydratedDocument<CouponUsage>;

@Schema({ timestamps: true, collection: 'coupon_usages' })
export class CouponUsage {
  @Prop({ type: Types.ObjectId, ref: 'Coupon', required: true, index: true })
  couponId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  discountAmount: number;
}

export const CouponUsageSchema = SchemaFactory.createForClass(CouponUsage);

// optimize count queries for per-user limit check
CouponUsageSchema.index({ couponId: 1, userId: 1 });
