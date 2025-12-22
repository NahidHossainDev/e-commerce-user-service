import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { InventoryTransactionType } from '../schemas/inventory-history.schema';

export class VariantStockDto {
  @ApiProperty({ description: 'SKU of the variant' })
  @IsString()
  @IsNotEmpty()
  variantSku: string;

  @ApiProperty({ description: 'Stock quantity of the variant', default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ description: 'Reserved quantity of the variant', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @ApiProperty({ description: 'Low stock threshold for the variant', default: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  lowStockThreshold?: number;
}

export class CreateInventoryDto {
  @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Base SKU of the product' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: 'Barcode of the product', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ description: 'Stock quantity of the product', default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ description: 'Reserved quantity of the product', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @ApiProperty({ description: 'Low stock threshold for the product', default: 5 })
  @IsNumber()
  @Min(0)
  lowStockThreshold: number;

  @ApiProperty({ description: 'Warehouse location', required: false })
  @IsString()
  @IsOptional()
  warehouseLocation?: string;

  @ApiProperty({ type: [VariantStockDto], description: 'Stock information for variants', default: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantStockDto)
  @IsOptional()
  variantStock?: VariantStockDto[];
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @ApiProperty({ description: 'Is the inventory active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class AdjustStockDto {
  @ApiProperty({ description: 'Quantity to add or subtract (e.g. 5 or -5)' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Type of transaction', enum: InventoryTransactionType })
  @IsEnum(InventoryTransactionType)
  @IsNotEmpty()
  type: InventoryTransactionType;

  @ApiProperty({ description: 'Variant SKU if adjusting variant stock', required: false })
  @IsString()
  @IsOptional()
  variantSku?: string;

  @ApiProperty({ description: 'Reference ID (e.g. Order ID)', required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;

  @ApiProperty({ description: 'Reason for adjustment', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ description: 'Notes', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
