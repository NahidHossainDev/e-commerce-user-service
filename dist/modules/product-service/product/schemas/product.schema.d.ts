import { Document, Types } from 'mongoose';
import { Price } from '../../../../common/schemas';
export type ProductDocument = Product & Document;
export declare enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    COMING_SOON = "COMING_SOON",
    DISCONTINUED = "DISCONTINUED",
    ARCHIVED = "ARCHIVED",
    BLOCKED = "BLOCKED"
}
export declare enum ProductMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export declare class ProductUnit {
    unitId: Types.ObjectId;
    value: number;
    symbol: string;
}
export declare class CategoryRef {
    id: Types.ObjectId;
    name: string;
}
export declare class BrandRef {
    id: Types.ObjectId;
    name: string;
}
export declare class ProductAttribute {
    name: string;
    value: any;
    label: string;
    unit: string;
    isFilterable: boolean;
    isVisibleOnList: boolean;
}
export declare class ProductVariant {
    name: string;
    attributes: Record<string, any>;
    sku: string;
    additionalPrice: number;
    barcode: string;
    stock: number;
    isAvailable: boolean;
}
export declare class PerishableInfo {
    expiryDate: Date;
    manufactureDate: Date;
    batchNumber: string;
    requiresRefrigeration: boolean;
}
export declare class ProductMedia {
    url: string;
    altText: string;
    format: string;
    type: ProductMediaType;
}
export declare class Product {
    title: string;
    slug: string;
    description: string;
    status: ProductStatus;
    thumbnail: string;
    media: ProductMedia[];
    category: CategoryRef;
    subCategories: CategoryRef[];
    brand: BrandRef;
    vendorId: Types.ObjectId;
    price: Price;
    unit: ProductUnit;
    sku: string;
    barcode: string;
    stock: number;
    isInStock: boolean;
    variants: ProductVariant[];
    hasVariants: boolean;
    attributes: ProductAttribute[];
    perishableInfo: PerishableInfo;
    isPerishable: boolean;
    tags: string[];
    keywords: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
    isOnOffer: boolean;
    isNew: boolean;
    salesCount: number;
    viewCount: number;
    averageRating: number;
    reviewCount: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    weight: {
        value: number;
        unit: string;
    };
    metaTitle: string;
    metaDescription: string;
    isDeleted: boolean;
    deletedAt: Date;
    lastStockSyncAt: Date;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
