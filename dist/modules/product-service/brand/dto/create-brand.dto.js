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
exports.CreateBrandDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SocialMediaDto {
    facebook;
    instagram;
    twitter;
    youtube;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://facebook.com/brand' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://instagram.com/brand' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://twitter.com/brand' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "twitter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://youtube.com/brand' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "youtube", void 0);
class BrandMetaDto {
    title;
    description;
    keywords;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Brand Name - Best Products' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BrandMetaDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Description for SEO' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BrandMetaDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['brand', 'products'], type: [String] }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BrandMetaDto.prototype, "keywords", void 0);
class CreateBrandDto {
    name;
    description;
    logo;
    website;
    establishedYear;
    country;
    isActive;
    sortOrder;
    socialMedia;
    meta;
}
exports.CreateBrandDto = CreateBrandDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nike' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBrandDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Leading sports brand' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBrandDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/logo.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateBrandDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://nike.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateBrandDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1964 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateBrandDto.prototype, "establishedYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBrandDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBrandDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBrandDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SocialMediaDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SocialMediaDto),
    __metadata("design:type", SocialMediaDto)
], CreateBrandDto.prototype, "socialMedia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BrandMetaDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandMetaDto),
    __metadata("design:type", BrandMetaDto)
], CreateBrandDto.prototype, "meta", void 0);
//# sourceMappingURL=create-brand.dto.js.map