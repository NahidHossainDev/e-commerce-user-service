import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MediaType } from '../../domain/media.types';

@Schema({ timestamps: true, collection: 'media' })
export class Media extends Document {
  @Prop({ required: true, unique: true })
  declare id: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: MediaType })
  type: MediaType;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  size: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
