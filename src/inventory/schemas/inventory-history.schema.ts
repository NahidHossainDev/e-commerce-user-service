import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductInventoryHistoryDocument = ProductInventoryHistory &
  Document;

export enum InventoryTransactionType {
  RESTOCK = 'RESTOCK',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  INITIAL = 'INITIAL',
}

@Schema({ timestamps: true, collection: 'product_inventory_histories' })
export class ProductInventoryHistory {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ProductInventory',
    required: true,
    index: true,
  })
  inventoryId: Types.ObjectId;

  @Prop({ trim: true })
  sku: string;

  @Prop()
  variantSku: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ required: true })
  quantity: number; // Change in quantity (+ or -)

  @Prop({ required: true, min: 0 })
  quantityBefore: number;

  @Prop({ required: true, min: 0 })
  quantityAfter: number;

  @Prop({ min: 0 })
  unitCost: number;

  @Prop({ min: 0 })
  totalCost: number;

  @Prop({ required: true, enum: InventoryTransactionType })
  type: string;

  @Prop()
  referenceId: string; // e.g., Order ID, Restock ID

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy: Types.ObjectId;

  @Prop()
  note: string;

  @Prop()
  reason: string;
}

export const ProductInventoryHistorySchema = SchemaFactory.createForClass(
  ProductInventoryHistory,
);

ProductInventoryHistorySchema.index({ productId: 1, date: -1 });
ProductInventoryHistorySchema.index({ sku: 1, date: -1 });
