import { Document, Types } from 'mongoose';
export type ProductInventoryDocument = ProductInventory & Document;
export declare class ProductInventory {
    productId: Types.ObjectId;
    sku: string;
    barcode: string;
    stockQuantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    isActive: boolean;
    warehouseLocation: string;
    totalSold: number;
    lastRestockedAt: Date;
    lastSoldAt: Date;
    variantStock: {
        variantSku: string;
        stockQuantity: number;
        reservedQuantity: number;
        lowStockThreshold: number;
    }[];
}
export declare const ProductInventorySchema: import("mongoose").Schema<ProductInventory, import("mongoose").Model<ProductInventory, any, any, any, Document<unknown, any, ProductInventory, any, {}> & ProductInventory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductInventory, Document<unknown, {}, import("mongoose").FlatRecord<ProductInventory>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ProductInventory> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
