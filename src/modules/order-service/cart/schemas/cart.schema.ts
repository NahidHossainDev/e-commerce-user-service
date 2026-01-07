import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Price } from '../../../../common/schemas';

export type CartDocument = Cart & Document;

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productThumbnail: string;

  @Prop({ type: String })
  variantSku?: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Price })
  price: Price;

  @Prop({ default: Date.now })
  addedAt: Date;

  @Prop({ default: false })
  isOutOfStock: boolean;

  @Prop({ default: 0 })
  availableStock: number;

  @Prop({ default: true })
  isSelected: boolean;
}

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  totalDiscount: number;

  @Prop({ default: 0 })
  payableAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
