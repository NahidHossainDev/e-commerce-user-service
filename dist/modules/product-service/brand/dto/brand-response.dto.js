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
exports.PaginatedBrandsResponseDto = exports.PaginationMetaDto = exports.BrandResponseDto = exports.BrandMetaDto = exports.SocialMediaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SocialMediaDto {
    facebook;
    instagram;
    twitter;
    youtube;
}
exports.SocialMediaDto = SocialMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://facebook.com/brand', required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://instagram.com/brand', required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://twitter.com/brand', required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "twitter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://youtube.com/brand', required: false }),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "youtube", void 0);
class BrandMetaDto {
    title;
    description;
    keywords;
}
exports.BrandMetaDto = BrandMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand Title' }),
    __metadata("design:type", String)
], BrandMetaDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand Description' }),
    __metadata("design:type", String)
], BrandMetaDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['keyword1', 'keyword2'] }),
    __metadata("design:type", Array)
], BrandMetaDto.prototype, "keywords", void 0);
class BrandResponseDto {
    _id;
    name;
    slug;
    description;
    logo;
    website;
    establishedYear;
    country;
    isActive;
    socialMedia;
    productCount;
    averageRating;
    meta;
    createdAt;
    updatedAt;
}
exports.BrandResponseDto = BrandResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], BrandResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Apple' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'apple' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Think Different' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/logo.png' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://apple.com' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1976 }),
    __metadata("design:type", Number)
], BrandResponseDto.prototype, "establishedYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USA' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], BrandResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SocialMediaDto }),
    __metadata("design:type", SocialMediaDto)
], BrandResponseDto.prototype, "socialMedia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1200 }),
    __metadata("design:type", Number)
], BrandResponseDto.prototype, "productCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.8 }),
    __metadata("design:type", Number)
], BrandResponseDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BrandMetaDto, required: false }),
    __metadata("design:type", BrandMetaDto)
], BrandResponseDto.prototype, "meta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], BrandResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], BrandResponseDto.prototype, "updatedAt", void 0);
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
class PaginatedBrandsResponseDto {
    data;
    meta;
}
exports.PaginatedBrandsResponseDto = PaginatedBrandsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [BrandResponseDto] }),
    __metadata("design:type", Array)
], PaginatedBrandsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedBrandsResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=brand-response.dto.js.map