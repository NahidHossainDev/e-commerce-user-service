import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum VerificationTokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export type VerificationTokenDocument = HydratedDocument<VerificationToken>;

@Schema({ timestamps: true })
export class VerificationToken {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  tokenHash: string;

  @Prop({
    type: String,
    enum: VerificationTokenType,
    default: VerificationTokenType.EMAIL_VERIFICATION,
  })
  type: VerificationTokenType;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const VerificationTokenSchema =
  SchemaFactory.createForClass(VerificationToken);

// TTL Index for auto-cleanup
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
VerificationTokenSchema.index({ userId: 1, type: 1 });
