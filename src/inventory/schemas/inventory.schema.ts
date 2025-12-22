import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductInventoryDocument = ProductInventory & Document;

@Schema({ timestamps: true, collection: 'product_inventories' })
export class ProductInventory {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, unique: true, index: true })
  productId: Types.ObjectId;

  @Prop({ unique: true, lowercase: true, trim: true })
  sku: string;

  @Prop({ unique: true, sparse: true, trim: true })
  barcode: string;

  // SOURCE OF TRUTH for stock
  @Prop({ required: true, default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ min: 0, default: 0 })
  reservedQuantity: number;

  @Prop({ required: true, default: 5, min: 0 })
  lowStockThreshold: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  warehouseLocation: string;

  @Prop({ default: 0, min: 0 })
  totalSold: number;

  @Prop()
  lastRestockedAt: Date;

  @Prop()
  lastSoldAt: Date;

  @Prop({ type: [Object], default: [] })
  variantStock: {
    variantSku: string;
    stockQuantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
  }[];
}

export const ProductInventorySchema = SchemaFactory.createForClass(ProductInventory);

ProductInventorySchema.index({ sku: 1 });
ProductInventorySchema.index({ productId: 1 }, { unique: true });
