import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UnitDocument = HydratedDocument<Unit>;

export enum UnitCategory {
  COUNT = 'COUNT',
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  LENGTH = 'LENGTH',
  AREA = 'AREA',
  TIME = 'TIME',
  DIGITAL = 'DIGITAL',
  CUSTOM = 'CUSTOM',
}

@Schema({ timestamps: false, versionKey: false })
export class Unit {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  symbol: string;

  @Prop({ required: true, enum: UnitCategory })
  category: UnitCategory;

  @Prop({ required: true })
  allowsDecimal: boolean;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
