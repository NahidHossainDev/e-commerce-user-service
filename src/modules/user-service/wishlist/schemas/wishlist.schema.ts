import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true, collection: "wishlists" })
export class Wishlist {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Product", required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: String, default: null })
  variantSku?: string;

  @Prop({ type: Boolean, default: false })
  notifyWhenAvailable: boolean;

  @Prop({ type: Number, default: null })
  priceWhenAdded?: number;

  createdAt: Date;
  updatedAt: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ userId: 1, productId: 1, variantSku: 1 }, { unique: true });
WishlistSchema.index({ userId: 1, createdAt: -1 });
