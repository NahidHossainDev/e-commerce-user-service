import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

// ---------- ENUMS ----------
export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OFFICE = 'OFFICE',
  OTHER = 'SUPER_ADMIN',
}

@Schema({ timestamps: true })
export class Address {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, enum: AddressType, required: true })
  type: AddressType;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: Boolean, default: false }) isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
