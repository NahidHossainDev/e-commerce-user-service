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
exports.ProductQueryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../../../common/dto");
const product_schema_1 = require("../schemas/product.schema");
class ProductQueryDto extends dto_1.QueryOptions {
    searchTerm;
    categoryId;
    category;
    brandId;
    brand;
    minPrice;
    maxPrice;
    status;
    vendorId;
    isFeatured;
    isOnOffer;
    isBestSeller;
    isNew;
    isPerishable;
    page = 1;
    limit = 12;
    sortBy = 'createdAt';
    sortOrder = 'desc';
}
exports.ProductQueryDto = ProductQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search across title, description, tags, keywords, sku',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID, comma-separated IDs, or array of IDs',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductQueryDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category ID, name, comma-separated values, or array of values',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand ID, comma-separated IDs, or array of IDs',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductQueryDto.prototype, "brandId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand ID, name, comma-separated values, or array of values',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ProductQueryDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "minPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum price' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "maxPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product status',
        enum: product_schema_1.ProductStatus,
        default: product_schema_1.ProductStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vendor ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "vendorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter featured products' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        return value === 'true' || value === true || value === '1' || value === 1;
    }),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter products on offer' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        return value === 'true' || value === true || value === '1' || value === 1;
    }),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "isOnOffer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter best seller products' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        return value === 'true' || value === true || value === '1' || value === 1;
    }),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "isBestSeller", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter new products' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        return value === 'true' || value === true || value === '1' || value === 1;
    }),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "isNew", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter perishable products' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined || value === null || value === '')
            return undefined;
        return value === 'true' || value === true || value === '1' || value === 1;
    }),
    __metadata("design:type", Boolean)
], ProductQueryDto.prototype, "isPerishable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items per page (maximum 30 for public listing)',
        default: 12,
        maximum: 30,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], ProductQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field to sort by',
        default: 'createdAt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        default: 'desc',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=product-query-options.dto.js.map