import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeliveryConfigDocument = HydratedDocument<DeliveryConfig>;

export enum FreeDeliveryPolicy {
  NONE = 'NONE',
  MIN_ORDER_AMOUNT = 'MIN_ORDER_AMOUNT',
  ALWAYS_FREE = 'ALWAYS_FREE',
}

@Schema({ _id: true, timestamps: false })
export class DeliveryZone {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop({ required: true, min: 0 })
  deliveryFee: number;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  matchedCities: string[];

  @Prop({
    required: true,
    enum: FreeDeliveryPolicy,
    default: FreeDeliveryPolicy.NONE,
  })
  freeDeliveryPolicy: FreeDeliveryPolicy;

  @Prop({ type: Number, min: 0, default: null })
  minOrderForFreeDelivery?: number | null;

  @Prop({ type: String, default: '' })
  estimatedDays?: string;
}

export const DeliveryZoneSchema = SchemaFactory.createForClass(DeliveryZone);

@Schema({ timestamps: true, collection: 'delivery_configs' })
export class DeliveryConfig {
  _id: Types.ObjectId;

  @Prop({ required: true, min: 0, default: 60 })
  defaultFee: number;

  @Prop({ default: false })
  enableGlobalFreeDelivery: boolean;

  @Prop({ type: Number, min: 0, default: null })
  globalFreeDeliveryMinOrder?: number | null;

  @Prop({ type: [DeliveryZoneSchema], default: [] })
  zones: DeliveryZone[];
}

export const DeliveryConfigSchema = SchemaFactory.createForClass(DeliveryConfig);
