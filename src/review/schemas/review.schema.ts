import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum VoteType {
  HELPFUL = 'helpful',
  UNHELPFUL = 'unhelpful',
}

@Schema()
class Vote {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ enum: VoteType })
  voteType: string;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true, maxlength: 1000 })
  comment: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ default: ReviewStatus.PENDING, enum: ReviewStatus })
  status: string;

  @Prop({ default: false })
  isVerifiedPurchase: boolean;

  @Prop({ default: 0 })
  helpfulVotes: number;

  @Prop({ default: 0 })
  unhelpfulVotes: number;

  @Prop({ type: [Vote], default: [] })
  votedBy: Vote[];

  @Prop({ type: Object })
  adminResponse: {
    message: string;
    respondedBy: Types.ObjectId;
    respondedAt: Date;
  };
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ productId: 1, status: 1 }); // Efficient fetch of approved reviews
