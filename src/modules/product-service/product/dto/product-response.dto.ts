import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus, ProductMediaType } from '../schemas/product.schema';

export class ProductUnitDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  unitId: any;

  @ApiProperty({ example: 1 })
  value: number;

  @ApiProperty({ example: 'kg' })
  symbol: string;
}

export class CategoryRefDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d012' })
  id: any;

  @ApiProperty({ example: 'Fruits' })
  name: string;
}

export class BrandRefDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d034' })
  id: any;

  @ApiProperty({ example: 'Organic Farm' })
  name: string;
}

export class ProductPriceDto {
  @ApiProperty({ example: 100 })
  basePrice: number;

  @ApiProperty({ example: 90 })
  discountPrice: number;

  @ApiProperty({ example: 10 })
  discountRate: number;

  @ApiProperty({ example: 'USD' })
  currency: string;
}

export class ProductAttributeDto {
  @ApiProperty({ example: 'Color' })
  name: string;

  @ApiProperty({ example: 'Red' })
  value: any;

  @ApiProperty({ example: 'Primary Color' })
  label: string;

  @ApiProperty({ example: 'piece' })
  unit: string;

  @ApiProperty({ example: true })
  isFilterable: boolean;

  @ApiProperty({ example: true })
  isVisibleOnList: boolean;
}

export class ProductVariantDto {
  @ApiProperty({ example: 'Medium-Red' })
  name: string;

  @ApiProperty({ example: { color: 'Red', size: 'Medium' } })
  attributes: Record<string, any>;

  @ApiProperty({ example: 'SKU-MED-RED' })
  sku: string;

  @ApiProperty({ example: 10 })
  additionalPrice: number;

  @ApiProperty({ example: '123456789' })
  barcode: string;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: true })
  isAvailable: boolean;
}

export class PerishableInfoDto {
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  expiryDate: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  manufactureDate: Date;

  @ApiProperty({ example: 'BATCH-001' })
  batchNumber: string;

  @ApiProperty({ example: true })
  requiresRefrigeration: boolean;
}

export class ProductMediaDto {
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  url: string;

  @ApiProperty({ example: 'Product Image' })
  altText: string;

  @ApiProperty({ example: 'image/jpeg' })
  format: string;

  @ApiProperty({ enum: ProductMediaType, example: ProductMediaType.IMAGE })
  type: ProductMediaType;
}

export class ProductResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: 'Fresh Apple' })
  title: string;

  @ApiProperty({ example: 'fresh-apple' })
  slug: string;

  @ApiProperty({ example: 'Delicious red apples' })
  description: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ApiProperty({ example: 'http://example.com/thumb.jpg' })
  thumbnail: string;

  @ApiProperty({ type: [ProductMediaDto] })
  media: ProductMediaDto[];

  @ApiProperty({ type: CategoryRefDto })
  category: CategoryRefDto;

  @ApiProperty({ type: [CategoryRefDto] })
  subCategories: CategoryRefDto[];

  @ApiProperty({ type: BrandRefDto })
  brand: BrandRefDto;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d099' })
  vendorId: any;

  @ApiProperty({ type: ProductPriceDto })
  price: any;

  @ApiProperty({ type: ProductUnitDto })
  unit: ProductUnitDto;

  @ApiProperty({ example: 'SKU-001' })
  sku: string;

  @ApiProperty({ example: '123456789' })
  barcode: string;

  @ApiProperty({ example: 100 })
  stock: number;

  @ApiProperty({ example: true })
  isInStock: boolean;

  @ApiProperty({ type: [ProductVariantDto] })
  variants: ProductVariantDto[];

  @ApiProperty({ example: false })
  hasVariants: boolean;

  @ApiProperty({ type: [ProductAttributeDto] })
  attributes: ProductAttributeDto[];

  @ApiProperty({ type: PerishableInfoDto, required: false })
  perishableInfo?: PerishableInfoDto;

  @ApiProperty({ example: false })
  isPerishable: boolean;

  @ApiProperty({ example: ['fresh', 'fruit'] })
  tags: string[];

  @ApiProperty({ example: ['apple', 'red'] })
  keywords: string[];

  @ApiProperty({ example: true })
  isBestSeller: boolean;

  @ApiProperty({ example: true })
  isFeatured: boolean;

  @ApiProperty({ example: false })
  isOnOffer: boolean;

  @ApiProperty({ example: true })
  isNew: boolean;

  @ApiProperty({ example: 500 })
  salesCount: number;

  @ApiProperty({ example: 1000 })
  viewCount: number;

  @ApiProperty({ example: 4.5 })
  averageRating: number;

  @ApiProperty({ example: 100 })
  reviewCount: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage: number | null;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
