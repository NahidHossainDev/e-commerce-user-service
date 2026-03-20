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
exports.UpdateProductDto = exports.CreateProductDto = exports.PerishableInfoDto = exports.ProductVariantDto = exports.ProductAttributeDto = exports.BrandRefDto = exports.CategoryRefDto = exports.ProductUnitDto = exports.PriceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const currency_constants_1 = require("../../../../common/constants/currency.constants");
const product_schema_1 = require("../schemas/product.schema");
class PriceDto {
    basePrice;
    discountPrice;
    discountRate;
    currency;
}
exports.PriceDto = PriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base price of the product' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount price', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PriceDto.prototype, "discountPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount rate (0-100)', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PriceDto.prototype, "discountRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code', enum: currency_constants_1.AppCurrency }),
    (0, class_validator_1.IsEnum)(currency_constants_1.AppCurrency),
    __metadata("design:type", String)
], PriceDto.prototype, "currency", void 0);
class ProductUnitDto {
    unitId;
    value;
    symbol;
}
exports.ProductUnitDto = ProductUnitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ProductUnitDto.prototype, "unitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Value of the unit' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductUnitDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Symbol of the unit' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductUnitDto.prototype, "symbol", void 0);
class CategoryRefDto {
    id;
    name;
}
exports.CategoryRefDto = CategoryRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CategoryRefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryRefDto.prototype, "name", void 0);
class BrandRefDto {
    id;
    name;
}
exports.BrandRefDto = BrandRefDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Brand ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], BrandRefDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Brand name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BrandRefDto.prototype, "name", void 0);
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
    (0, swagger_1.ApiProperty)({ description: 'Attribute name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Attribute value' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ProductAttributeDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductAttributeDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is filterable', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductAttributeDto.prototype, "isFilterable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is visible on list', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductAttributeDto.prototype, "isVisibleOnList", void 0);
class ProductVariantDto {
    name;
    attributes;
    sku;
    additionalPrice;
    barcode;
    isAvailable;
}
exports.ProductVariantDto = ProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variant name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variant attributes', type: Object }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductVariantDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variant SKU', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional price', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProductVariantDto.prototype, "additionalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductVariantDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is available', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
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
    (0, swagger_1.ApiProperty)({ description: 'Expiry date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PerishableInfoDto.prototype, "expiryDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Manufacture date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PerishableInfoDto.prototype, "manufactureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Batch number', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PerishableInfoDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Requires refrigeration', default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PerishableInfoDto.prototype, "requiresRefrigeration", void 0);
class CreateProductDto {
    title;
    description;
    status;
    thumbnail;
    category;
    subCategories;
    brand;
    vendorId;
    price;
    unit;
    sku;
    barcode;
    variants;
    attributes;
    perishableInfo;
    tags;
    keywords;
    isBestSeller;
    isFeatured;
    isOnOffer;
    isNew;
    dimensions;
    weight;
    metaTitle;
    metaDescription;
    initialStock;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the product' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status',
        enum: product_schema_1.ProductStatus,
        default: product_schema_1.ProductStatus.DRAFT,
    }),
    (0, class_validator_1.IsEnum)(product_schema_1.ProductStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thumbnail image URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CategoryRefDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryRefDto),
    __metadata("design:type", CategoryRefDto)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryRefDto], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryRefDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "subCategories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BrandRefDto, required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandRefDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", BrandRefDto)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vendor ID', required: false }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PriceDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProductUnitDto, required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProductUnitDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ProductUnitDto)
], CreateProductDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductVariantDto], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductVariantDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProductAttributeDto], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductAttributeDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PerishableInfoDto, required: false }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PerishableInfoDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PerishableInfoDto)
], CreateProductDto.prototype, "perishableInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isBestSeller", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isOnOffer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isNew", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Initial stock', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "initialStock", void 0);
class UpdateProductDto extends (0, swagger_1.PartialType)(CreateProductDto) {
}
exports.UpdateProductDto = UpdateProductDto;
//# sourceMappingURL=product.dto.js.map