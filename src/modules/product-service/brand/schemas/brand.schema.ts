import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema()
class SocialMedia {
  @Prop({ type: String })
  facebook?: string;

  @Prop({ type: String })
  instagram?: string;

  @Prop({ type: String })
  twitter?: string;

  @Prop({ type: String })
  youtube?: string;
}

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  logo: string;

  @Prop()
  website: string;

  @Prop()
  establishedYear: number;

  @Prop()
  country: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: SocialMedia, default: {} })
  socialMedia: SocialMedia;

  @Prop({ default: 0 })
  productCount: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ type: Object })
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Indexes
BrandSchema.index({ name: 'text', description: 'text' });
