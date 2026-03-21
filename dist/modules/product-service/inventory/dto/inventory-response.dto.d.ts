export declare class VariantStockDto {
    variantSku: string;
    stockQuantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
}
export declare class ProductInventoryResponseDto {
    productId: any;
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
    variantStock: VariantStockDto[];
}
export declare class ProductInventoryHistoryResponseDto {
    productId: any;
    inventoryId: any;
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
    performedBy: any;
    note: string;
    reason: string;
}
