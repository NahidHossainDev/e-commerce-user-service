"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedProductsResponseDto = exports.PaginationMetaDto = exports.ProductResponseDto = exports.ProductMediaDto = exports.PerishableInfoDto = exports.ProductVariantDto = exports.ProductAttributeDto = exports.ProductPriceDto = exports.BrandRefDto = exports.CategoryRefDto = exports.ProductUnitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const product_schema_1 = require("../schemas/product.schema");
class ProductUnitDto {
    unitId;
    value;
    symbol;
}
exports.ProductUnitDto = ProductUnitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], ProductUnitDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], ProductUnitDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'kg' }),
    __metadata("design:type", String)
], ProductUnitDto.prototype, "symbol", void 0);
class CategoryRefDto {
    id;
    name;
}
exports.CategoryRefDto = CategoryRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d012' }),
    __metadata("design:type", Object)
], CategoryRefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fruits' }),
    __metadata("design:type", String)
], CategoryRefDto.prototype, "name", void 0);
class BrandRefDto {
    id;
    name;
}
exports.BrandRefDto = BrandRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d034' }),
    __metadata("design:type", Object)
], BrandRefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Organic Farm' }),
    __metadata("design:type", String)
], BrandRefDto.prototype, "name", void 0);
class ProductPriceDto {
    basePrice;
    discountPrice;
    discountRate;
    currency;
}
exports.ProductPriceDto = ProductPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], ProductPriceDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 90 }),
    __metadata("design:type", Number)
], ProductPriceDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProductPriceDto.prototype, "discountRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD' }),
    __metadata("design:type", String)
], ProductPriceDto.prototype, "currency", void 0);
class ProductAttributeDto {
    name;
    value;
    label;
    unit;
    isFilterable;
    isVisibleOnList;
}
exports.ProductAttributeDto = ProductAttributeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Color' }),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Red' }),
    __metadata("design:type", Object)
], ProductAttributeDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Primary Color' }),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'piece' }),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductAttributeDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductAttributeDto.prototype, "isVisibleOnList", void 0);
class ProductVariantDto {
    name;
    attributes;
    sku;
    additionalPrice;
    barcode;
    stock;
    isAvailable;
}
exports.ProductVariantDto = ProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Medium-Red' }),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { color: 'Red', size: 'Medium' } }),
    __metadata("design:type", Object)
], ProductVariantDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU-MED-RED' }),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "additionalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789' }),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductVariantDto.prototype, "isAvailable", void 0);
class PerishableInfoDto {
    expiryDate;
    manufactureDate;
    batchNumber;
    requiresRefrigeration;
}
exports.PerishableInfoDto = PerishableInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], PerishableInfoDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], PerishableInfoDto.prototype, "manufactureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BATCH-001' }),
    __metadata("design:type", String)
], PerishableInfoDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PerishableInfoDto.prototype, "requiresRefrigeration", void 0);
class ProductMediaDto {
    url;
    altText;
    format;
    type;
}
exports.ProductMediaDto = ProductMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/image.jpg' }),
    __metadata("design:type", String)
], ProductMediaDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Product Image' }),
    __metadata("design:type", String)
], ProductMediaDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    __metadata("design:type", String)
], ProductMediaDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.ProductMediaType, example: product_schema_1.ProductMediaType.IMAGE }),
    __metadata("design:type", String)
], ProductMediaDto.prototype, "type", void 0);
class ProductResponseDto {
    _id;
    title;
    slug;
    description;
    status;
    thumbnail;
    media;
    category;
    subCategories;
    brand;
    vendorId;
    price;
    unit;
    sku;
    barcode;
    stock;
    isInStock;
    variants;
    hasVariants;
    attributes;
    perishableInfo;
    isPerishable;
    tags;
    keywords;
    isBestSeller;
    isFeatured;
    isOnOffer;
    isNew;
    salesCount;
    viewCount;
    averageRating;
    reviewCount;
    createdAt;
    updatedAt;
}
exports.ProductResponseDto = ProductResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Fresh Apple' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fresh-apple' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Delicious red apples' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.ProductStatus, example: product_schema_1.ProductStatus.ACTIVE }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/thumb.jpg' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductMediaDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CategoryRefDto }),
    __metadata("design:type", CategoryRefDto)
], ProductResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryRefDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "subCategories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BrandRefDto }),
    __metadata("design:type", BrandRefDto)
], ProductResponseDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d099' }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProductPriceDto }),
    __metadata("design:type", Object)
], ProductResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProductUnitDto }),
    __metadata("design:type", ProductUnitDto)
], ProductResponseDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU-001' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789' }),
    __metadata("design:type", String)
], ProductResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isInStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductVariantDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "hasVariants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductAttributeDto] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PerishableInfoDto, required: false }),
    __metadata("design:type", PerishableInfoDto)
], ProductResponseDto.prototype, "perishableInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isPerishable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['fresh', 'fruit'] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['apple', 'red'] }),
    __metadata("design:type", Array)
], ProductResponseDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isBestSeller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isOnOffer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductResponseDto.prototype, "isNew", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "salesCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.5 }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], ProductResponseDto.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ProductResponseDto.prototype, "updatedAt", void 0);
class PaginationMetaDto {
    totalCount;
    totalPages;
    limit;
    page;
    nextPage;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, nullable: true }),
    __metadata("design:type", Object)
], PaginationMetaDto.prototype, "nextPage", void 0);
class PaginatedProductsResponseDto {
    data;
    meta;
}
exports.PaginatedProductsResponseDto = PaginatedProductsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductResponseDto] }),
    __metadata("design:type", Array)
], PaginatedProductsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedProductsResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=product-response.dto.js.map