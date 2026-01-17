import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { ProductStatus } from '../schemas/product.schema';

export class UpdateProductStatusDto {
  @ApiProperty({
    description: 'New status for the product',
    enum: ProductStatus,
  })
  @IsEnum(ProductStatus)
  @IsNotEmpty()
  status: ProductStatus;
}

export class BulkUpdateStatusDto extends UpdateProductStatusDto {
  @ApiProperty({ description: 'List of product IDs to update' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  ids: string[];
}
