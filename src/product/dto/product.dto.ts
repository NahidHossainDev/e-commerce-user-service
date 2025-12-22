import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { AppCurrency } from '../../common/constants/currency.constants';
import { QueryOptions } from '../../common/dto/queryOptions.dto';
import { ProductStatus } from '../schemas/product.schema';

export class PriceDto {
  @ApiProperty({ description: 'Base price of the product' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ description: 'Discount price', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ description: 'Discount rate (0-100)', required: false })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountRate?: number;

  @ApiProperty({ description: 'Currency code', enum: AppCurrency })
  @IsEnum(AppCurrency)
  currency: AppCurrency;
}

export class ProductUnitDto {
  @ApiProperty({ description: 'Unit ID' })
  @IsMongoId()
  unitId: string;

  @ApiProperty({ description: 'Value of the unit' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ description: 'Symbol of the unit' })
  @IsString()
  symbol: string;
}

export class CategoryRefDto {
  @ApiProperty({ description: 'Category ID' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Category name' })
  @IsString()
  name: string;
}

export class BrandRefDto {
  @ApiProperty({ description: 'Brand ID' })
  @IsMongoId()
  id: string;

  @ApiProperty({ description: 'Brand name' })
  @IsString()
  name: string;
}

export class ProductAttributeDto {
  @ApiProperty({ description: 'Attribute name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Attribute value' })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ description: 'Label', required: false })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty({ description: 'Unit', required: false })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: 'Is filterable', default: false })
  @IsBoolean()
  @IsOptional()
  isFilterable?: boolean;

  @ApiProperty({ description: 'Is visible on list', default: false })
  @IsBoolean()
  @IsOptional()
  isVisibleOnList?: boolean;
}

export class ProductVariantDto {
  @ApiProperty({ description: 'Variant name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Variant attributes', type: Object })
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Variant SKU', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Additional price', required: false })
  @IsNumber()
  @IsOptional()
  additionalPrice?: number;

  @ApiProperty({ description: 'Barcode', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ description: 'Is available', default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}

export class PerishableInfoDto {
  @ApiProperty({ description: 'Expiry date' })
  @Type(() => Date)
  expiryDate: Date;

  @ApiProperty({ description: 'Manufacture date' })
  @Type(() => Date)
  manufactureDate: Date;

  @ApiProperty({ description: 'Batch number', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: 'Requires refrigeration', default: false })
  @IsBoolean()
  @IsOptional()
  requiresRefrigeration?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Title of the product' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Status',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ description: 'Thumbnail image URL' })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({ type: CategoryRefDto })
  @ValidateNested()
  @Type(() => CategoryRefDto)
  category: CategoryRefDto;

  @ApiProperty({ type: [CategoryRefDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryRefDto)
  @IsOptional()
  subCategories?: CategoryRefDto[];

  @ApiProperty({ type: BrandRefDto, required: false })
  @ValidateNested()
  @Type(() => BrandRefDto)
  @IsOptional()
  brand?: BrandRefDto;

  @ApiProperty({ description: 'Vendor ID', required: false })
  @IsMongoId()
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @ApiProperty({ type: ProductUnitDto, required: false })
  @ValidateNested()
  @Type(() => ProductUnitDto)
  @IsOptional()
  unit?: ProductUnitDto;

  @ApiProperty({ description: 'SKU', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Barcode', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ type: [ProductVariantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variants?: ProductVariantDto[];

  @ApiProperty({ type: [ProductAttributeDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];

  @ApiProperty({ type: PerishableInfoDto, required: false })
  @ValidateNested()
  @Type(() => PerishableInfoDto)
  @IsOptional()
  perishableInfo?: PerishableInfoDto;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isOnOffer?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  weight?: {
    value: number;
    unit: string;
  };

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  // Stock is usually managed by Inventory service, but we might want to set initial stock
  @ApiProperty({ description: 'Initial stock', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  initialStock?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto extends QueryOptions {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ required: false, enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isOnOffer?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isBestSeller?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isNew?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPerishable?: boolean;
}
