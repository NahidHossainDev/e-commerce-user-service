import { AppCurrency } from '../../../../common/constants/currency.constants';
import { ProductStatus } from '../schemas/product.schema';
export declare class PriceDto {
    basePrice: number;
    discountPrice?: number;
    discountRate?: number;
    currency: AppCurrency;
}
export declare class ProductUnitDto {
    unitId: string;
    value: number;
    symbol: string;
}
export declare class CategoryRefDto {
    id: string;
    name: string;
}
export declare class BrandRefDto {
    id: string;
    name: string;
}
export declare class ProductAttributeDto {
    name: string;
    value: any;
    label?: string;
    unit?: string;
    isFilterable?: boolean;
    isVisibleOnList?: boolean;
}
export declare class ProductVariantDto {
    name: string;
    attributes?: Record<string, any>;
    sku?: string;
    additionalPrice?: number;
    barcode?: string;
    isAvailable?: boolean;
}
export declare class PerishableInfoDto {
    expiryDate: Date;
    manufactureDate: Date;
    batchNumber?: string;
    requiresRefrigeration?: boolean;
}
export declare class CreateProductDto {
    title: string;
    description: string;
    status?: ProductStatus;
    thumbnail: string;
    category: CategoryRefDto;
    subCategories?: CategoryRefDto[];
    brand?: BrandRefDto;
    vendorId?: string;
    price: PriceDto;
    unit?: ProductUnitDto;
    sku?: string;
    barcode?: string;
    variants?: ProductVariantDto[];
    attributes?: ProductAttributeDto[];
    perishableInfo?: PerishableInfoDto;
    tags?: string[];
    keywords?: string[];
    isBestSeller?: boolean;
    isFeatured?: boolean;
    isOnOffer?: boolean;
    isNew?: boolean;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    weight?: {
        value: number;
        unit: string;
    };
    metaTitle?: string;
    metaDescription?: string;
    initialStock?: number;
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
}
export {};
