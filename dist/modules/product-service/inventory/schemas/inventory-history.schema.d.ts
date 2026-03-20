import { Document, Types } from 'mongoose';
export type ProductInventoryHistoryDocument = ProductInventoryHistory & Document;
export declare enum InventoryTransactionType {
    RESTOCK = "RESTOCK",
    SALE = "SALE",
    RETURN = "RETURN",
    ADJUSTMENT = "ADJUSTMENT",
    INITIAL = "INITIAL"
}
export declare class ProductInventoryHistory {
    productId: Types.ObjectId;
    inventoryId: Types.ObjectId;
    sku: string;
    variantSku: string;
    date: Date;
    quantity: number;
    quantityBefore: number;
    quantityAfter: number;
    unitCost: number;
    totalCost: number;
    type: string;
    referenceId: string;
    performedBy: Types.ObjectId;
    note: string;
    reason: string;
}
export declare const ProductInventoryHistorySchema: import("mongoose").Schema<ProductInventoryHistory, import("mongoose").Model<ProductInventoryHistory, any, any, any, Document<unknown, any, ProductInventoryHistory, any, {}> & ProductInventoryHistory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductInventoryHistory, Document<unknown, {}, import("mongoose").FlatRecord<ProductInventoryHistory>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ProductInventoryHistory> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
