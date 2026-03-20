import { ClientSession } from 'mongoose';
export declare enum InventoryTransactionType {
    INITIAL = "INITIAL",
    RESTOCK = "RESTOCK",
    SALE = "SALE",
    RETURN = "RETURN",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER",
    DAMAGED = "DAMAGED",
    EXPIRED = "EXPIRED"
}
export interface IInventoryAdjustEvent {
    productId: string;
    quantity: number;
    type: InventoryTransactionType;
    variantSku?: string;
    referenceId?: string;
    reason?: string;
    session?: ClientSession;
}
export declare class InventoryAdjustEvent {
    readonly productId: string;
    readonly quantity: number;
    readonly type: InventoryTransactionType;
    readonly variantSku?: string;
    readonly referenceId?: string;
    readonly reason?: string;
    readonly session?: ClientSession;
    constructor(params: IInventoryAdjustEvent);
}
export declare const InventoryEvents: {
    ADJUST_STOCK: string;
};
