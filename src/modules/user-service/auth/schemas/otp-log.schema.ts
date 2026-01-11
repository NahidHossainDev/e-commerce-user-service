import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpLogDocument = HydratedDocument<OtpLog>;

@Schema({ timestamps: true })
export class OtpLog {
  @Prop({ required: true, index: true })
  phoneNumber: string;

  @Prop({ required: true })
  attemptedAt: Date;

  @Prop({ default: true })
  success: boolean;

  // TTL Index: Auto-delete logs after 24 hours (86400 seconds)
  @Prop({ type: Date, expires: 86400, default: Date.now })
  expiresAt: Date;
}

export const OtpLogSchema = SchemaFactory.createForClass(OtpLog);
