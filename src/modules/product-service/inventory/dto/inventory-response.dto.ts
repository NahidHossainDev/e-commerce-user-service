import { ApiProperty } from '@nestjs/swagger';
import { InventoryTransactionType } from '../schemas/inventory-history.schema';

export class VariantStockDto {
  @ApiProperty({ example: 'SKU-001-RED' })
  variantSku: string;

  @ApiProperty({ example: 100 })
  stockQuantity: number;

  @ApiProperty({ example: 0 })
  reservedQuantity: number;

  @ApiProperty({ example: 5 })
  lowStockThreshold: number;
}

export class ProductInventoryResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  productId: any;

  @ApiProperty({ example: 'sku-001' })
  sku: string;

  @ApiProperty({ example: '123456789' })
  barcode: string;

  @ApiProperty({ example: 500 })
  stockQuantity: number;

  @ApiProperty({ example: 10 })
  reservedQuantity: number;

  @ApiProperty({ example: 5 })
  lowStockThreshold: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'Warehouse A, Shelf 1' })
  warehouseLocation: string;

  @ApiProperty({ example: 1000 })
  totalSold: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  lastRestockedAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  lastSoldAt: Date;

  @ApiProperty({ type: [VariantStockDto] })
  variantStock: VariantStockDto[];
}

export class ProductInventoryHistoryResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  productId: any;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e2' })
  inventoryId: any;

  @ApiProperty({ example: 'sku-001' })
  sku: string;

  @ApiProperty({ example: 'sku-001-red' })
  variantSku: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 100 })
  quantityBefore: number;

  @ApiProperty({ example: 110 })
  quantityAfter: number;

  @ApiProperty({ example: 50 })
  unitCost: number;

  @ApiProperty({ example: 500 })
  totalCost: number;

  @ApiProperty({
    enum: InventoryTransactionType,
    example: InventoryTransactionType.RESTOCK,
  })
  type: string;

  @ApiProperty({ example: 'RESTOCK-123' })
  referenceId: string;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e3' })
  performedBy: any;

  @ApiProperty({ example: 'Monthly restock' })
  note: string;

  @ApiProperty({ example: 'Restock from supplier' })
  reason: string;
}
