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
exports.CategoryTreeResponseDto = exports.PaginatedCategoriesResponseDto = exports.PaginationMetaDto = exports.CategoryResponseDto = exports.CategoryMetaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CategoryMetaDto {
    title;
    description;
}
exports.CategoryMetaDto = CategoryMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics Category' }),
    __metadata("design:type", String)
], CategoryMetaDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Browse the latest electronics and gadgets.' }),
    __metadata("design:type", String)
], CategoryMetaDto.prototype, "description", void 0);
class CategoryResponseDto {
    _id;
    name;
    slug;
    description;
    image;
    parentCategory;
    level;
    path;
    isActive;
    productCount;
    sortOrder;
    meta;
    createdAt;
    updatedAt;
}
exports.CategoryResponseDto = CategoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronics' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'electronics' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Electronic gadgets and devices' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://example.com/category-image.jpg' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e2', nullable: true }),
    __metadata("design:type", Object)
], CategoryResponseDto.prototype, "parentCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, minimum: 0, maximum: 3 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ',64b1f2c3d4e5f6a7b8c9d0e2,' }),
    __metadata("design:type", String)
], CategoryResponseDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], CategoryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "productCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], CategoryResponseDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: CategoryMetaDto, required: false }),
    __metadata("design:type", CategoryMetaDto)
], CategoryResponseDto.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], CategoryResponseDto.prototype, "updatedAt", void 0);
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
class PaginatedCategoriesResponseDto {
    data;
    meta;
}
exports.PaginatedCategoriesResponseDto = PaginatedCategoriesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryResponseDto] }),
    __metadata("design:type", Array)
], PaginatedCategoriesResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedCategoriesResponseDto.prototype, "meta", void 0);
class CategoryTreeResponseDto extends CategoryResponseDto {
    children;
}
exports.CategoryTreeResponseDto = CategoryTreeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryTreeResponseDto], required: false }),
    __metadata("design:type", Array)
], CategoryTreeResponseDto.prototype, "children", void 0);
//# sourceMappingURL=category-response.dto.js.map