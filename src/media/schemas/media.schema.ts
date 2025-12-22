import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductMediaDocument = ProductMedia & Document;

@Schema({ _id: false })
export class ImageAsset {
  @Prop({ required: true })
  url: string;

  @Prop()
  mobileUrl: string;

  @Prop()
  alt: string;

  @Prop({ default: 0 })
  order: number;
}

@Schema({ timestamps: true, collection: 'product_media' })
export class ProductMedia {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true,
    index: true,
  })
  productId: Types.ObjectId;

  @Prop({ required: true })
  primaryImage: string;

  @Prop({ type: [ImageAsset], default: [] })
  images: ImageAsset[];

  @Prop()
  videoUrl: string;
}

export const ProductMediaSchema = SchemaFactory.createForClass(ProductMedia);

ProductMediaSchema.index({ productId: 1 }, { unique: true });
