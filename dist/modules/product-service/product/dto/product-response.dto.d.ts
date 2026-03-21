import { ProductStatus, ProductMediaType } from '../schemas/product.schema';
export declare class ProductUnitDto {
    unitId: any;
    value: number;
    symbol: string;
}
export declare class CategoryRefDto {
    id: any;
    name: string;
}
export declare class BrandRefDto {
    id: any;
    name: string;
}
export declare class ProductPriceDto {
    basePrice: number;
    discountPrice: number;
    discountRate: number;
    currency: string;
}
export declare class ProductAttributeDto {
    name: string;
    value: any;
    label: string;
    unit: string;
    isFilterable: boolean;
    isVisibleOnList: boolean;
}
export declare class ProductVariantDto {
    name: string;
    attributes: Record<string, any>;
    sku: string;
    additionalPrice: number;
    barcode: string;
    stock: number;
    isAvailable: boolean;
}
export declare class PerishableInfoDto {
    expiryDate: Date;
    manufactureDate: Date;
    batchNumber: string;
    requiresRefrigeration: boolean;
}
export declare class ProductMediaDto {
    url: string;
    altText: string;
    format: string;
    type: ProductMediaType;
}
export declare class ProductResponseDto {
    _id: any;
    title: string;
    slug: string;
    description: string;
    status: ProductStatus;
    thumbnail: string;
    media: ProductMediaDto[];
    category: CategoryRefDto;
    subCategories: CategoryRefDto[];
    brand: BrandRefDto;
    vendorId: any;
    price: any;
    unit: ProductUnitDto;
    sku: string;
    barcode: string;
    stock: number;
    isInStock: boolean;
    variants: ProductVariantDto[];
    hasVariants: boolean;
    attributes: ProductAttributeDto[];
    perishableInfo?: PerishableInfoDto;
    isPerishable: boolean;
    tags: string[];
    keywords: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
    isOnOffer: boolean;
    isNew: boolean;
    salesCount: number;
    viewCount: number;
    averageRating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaginationMetaDto {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
}
export declare class PaginatedProductsResponseDto {
    data: ProductResponseDto[];
    meta: PaginationMetaDto;
}
