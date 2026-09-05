import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QueryOptions } from '../../../../common/dto';
import { ProductStatus } from '../schemas/product.schema';

export class ProductQueryDto extends QueryOptions {
  @ApiPropertyOptional({
    description: 'Search across title, description, tags, keywords, sku',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Category ID, comma-separated IDs, or array of IDs',
  })
  @IsOptional()
  categoryId?: string | string[];

  @ApiPropertyOptional({
    description: 'Category ID, name, comma-separated values, or array of values',
  })
  @IsOptional()
  category?: string | string[];

  @ApiPropertyOptional({
    description: 'Brand ID, comma-separated IDs, or array of IDs',
  })
  @IsOptional()
  brandId?: string | string[];

  @ApiPropertyOptional({
    description: 'Brand ID, name, comma-separated values, or array of values',
  })
  @IsOptional()
  brand?: string | string[];

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsString()
  status?: ProductStatus | string;

  @ApiPropertyOptional({ description: 'Vendor ID' })
  @IsString()
  @IsOptional()
  vendorId?: string;

  @ApiPropertyOptional({ description: 'Filter featured products' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === '1' || value === 1;
  })
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Filter products on offer' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === '1' || value === 1;
  })
  isOnOffer?: boolean;

  @ApiPropertyOptional({ description: 'Filter best seller products' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === '1' || value === 1;
  })
  isBestSeller?: boolean;

  @ApiPropertyOptional({ description: 'Filter new products' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === '1' || value === 1;
  })
  isNew?: boolean;

  @ApiPropertyOptional({ description: 'Filter perishable products' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true || value === '1' || value === 1;
  })
  isPerishable?: boolean;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (maximum 30 for public listing)',
    default: 12,
    maximum: 30,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(30)
  limit?: number = 12;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
