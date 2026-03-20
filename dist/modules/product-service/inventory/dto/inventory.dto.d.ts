import { InventoryTransactionType } from '../schemas/inventory-history.schema';
export declare class VariantStockDto {
    variantSku: string;
    stockQuantity: number;
    reservedQuantity?: number;
    lowStockThreshold?: number;
}
export declare class CreateInventoryDto {
    productId: string;
    sku: string;
    barcode?: string;
    stockQuantity: number;
    reservedQuantity?: number;
    lowStockThreshold: number;
    warehouseLocation?: string;
    variantStock?: VariantStockDto[];
}
declare const UpdateInventoryDto_base: import("@nestjs/common").Type<Partial<CreateInventoryDto>>;
export declare class UpdateInventoryDto extends UpdateInventoryDto_base {
    isActive?: boolean;
}
export declare class AdjustStockDto {
    quantity: number;
    type: InventoryTransactionType;
    variantSku?: string;
    referenceId?: string;
    reason?: string;
    note?: string;
}
export {};
