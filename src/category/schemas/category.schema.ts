import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parentCategory: Types.ObjectId;

  @Prop({ default: 0, min: 0, max: 3 })
  level: number;

  @Prop({ index: true }) // Materialized path for fast sub-tree fetching: ",rootID,subID,"
  path: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  productCount: number;

  @Prop({ type: Object })
  meta: {
    title: string;
    description: string;
  };
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ slug: 1 });
