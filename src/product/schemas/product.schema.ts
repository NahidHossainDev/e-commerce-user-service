import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppCurrency, DEFAULT_CURRENCY } from 'src/common/constants';

export type ProductDocument = Product & Document;

// ---------- ENUMS ----------
export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  COMING_SOON = 'COMING_SOON',
  DISCONTINUED = 'DISCONTINUED',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED'
}

// --- Embedded Sub-Schemas ---
@Schema({ _id: false })
export class Price {
  @Prop({ required: true, min: 0, index: true })
  basePrice: number;

  @Prop({ min: 0 })
  discountPrice: number;

  @Prop({ min: 0, max: 100 })
  discountRate: number;

  @Prop({ required: true, enum: AppCurrency, default: DEFAULT_CURRENCY })
  currency: string;
}

// MINIMAL denormalization - only what changes very rarely
@Schema({ _id: false })
export class ProductUnit {
  @Prop({ type: Types.ObjectId, ref: 'Unit', required: true })
  unitId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  value: number;

  @Prop({ required: true })
  symbol: string;
}

@Schema({ _id: false })
export class CategoryRef {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

@Schema({ _id: false })
export class BrandRef {
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true, index: true })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

@Schema({ _id: false })
export class ProductAttribute {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Object })
  value: any;

  @Prop()
  label: string;

  @Prop()
  unit: string;

  @Prop({ default: false })
  isFilterable: boolean;

  @Prop({ default: false })
  isVisibleOnList: boolean;
}

// For products with variants
@Schema({ _id: false })
export class ProductVariant {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  attributes: Record<string, any>;

  @Prop({ unique: true, sparse: true })
  sku: string;

  @Prop({ min: 0 })
  additionalPrice: number;

  @Prop()
  barcode: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

// For perishable products
@Schema({ _id: false })
export class PerishableInfo {
  @Prop({ required: true, index: true })
  expiryDate: Date;

  @Prop({ required: true })
  manufactureDate: Date;

  @Prop()
  batchNumber: string;

  @Prop({ default: true })
  requiresRefrigeration: boolean;

}

// --- Main Product Schema ---
@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  // ========== CORE INFO ==========
  @Prop({ required: true, text: true, index: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: ProductStatus.DRAFT, enum: ProductStatus, index: true })
  status: string;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ type: CategoryRef, required: true })
  category: CategoryRef;

  @Prop({ type: [CategoryRef], default: [] })
  subCategories: CategoryRef[];

  @Prop({ type: BrandRef })
  brand: BrandRef;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', index: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Price, required: true })
  price: Price;

  @Prop({ type: ProductUnit })
  unit: ProductUnit;

  @Prop({ unique: true, sparse: true, trim: true, index: true })
  sku: string;

  @Prop({ unique: true, sparse: true, trim: true })
  barcode: string;

  @Prop({ required: true, min: 0, default: 0, index: true })
  stock: number;

  @Prop({ default: false, index: true })
  isInStock: boolean;

  @Prop({ type: [ProductVariant], default: [] })
  variants: ProductVariant[];

  @Prop({ default: false })
  hasVariants: boolean;

  @Prop({ type: [ProductAttribute], default: [] })
  attributes: ProductAttribute[];

  @Prop({ type: PerishableInfo })
  perishableInfo: PerishableInfo;

  @Prop({ default: false })
  isPerishable: boolean;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ default: false, index: true })
  isBestSeller: boolean;

  @Prop({ default: false, index: true })
  isFeatured: boolean;

  @Prop({ default: false, index: true })
  isOnOffer: boolean;

  @Prop({ default: false })
  isNew: boolean;

  @Prop({ default: 0, index: true })
  salesCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  // RATING: Embedded for fast sorting, but minimal
  @Prop({ default: 0, min: 0, max: 5, index: true })
  averageRating: number;

  @Prop({ default: 0, min: 0 })
  reviewCount: number;

  @Prop({ type: Object })
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @Prop({ type: Object })
  weight: {
    value: number;
    unit: string;
  };

  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;

  @Prop()
  lastStockSyncAt: Date; // Track when stock was last synced
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// ========== INDEXES ==========
ProductSchema.index({ 'category.id': 1, status: 1 });
ProductSchema.index({ 'brand.id': 1, status: 1 });
ProductSchema.index({ 'price.basePrice': 1, status: 1 });
ProductSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });
ProductSchema.index({ isOnOffer: 1, status: 1 });
ProductSchema.index({ tags: 1, status: 1 });
ProductSchema.index({ averageRating: -1, reviewCount: -1, status: 1 });
ProductSchema.index({ stock: 1, status: 1 });
ProductSchema.index({ 
  title: 'text', 
  keywords: 'text',
  tags: 'text' 
});
// ProductSchema.index({ createdAt: -1, status: 1 });
// ProductSchema.index({ salesCount: -1, status: 1 });
