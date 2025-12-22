import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RatingSummaryDocument = RatingSummary & Document;

@Schema()
class RatingDistribution {
  @Prop({ default: 0 })
  five: number;

  @Prop({ default: 0 })
  four: number;

  @Prop({ default: 0 })
  three: number;

  @Prop({ default: 0 })
  two: number;

  @Prop({ default: 0 })
  one: number;
}

@Schema({ timestamps: true })
export class RatingSummary {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true,
    index: true,
  })
  productId: Types.ObjectId;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  totalRatings: number;

  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @Prop({ type: RatingDistribution, default: {} })
  ratingDistribution: RatingDistribution;
}

export const RatingSummarySchema = SchemaFactory.createForClass(RatingSummary);
