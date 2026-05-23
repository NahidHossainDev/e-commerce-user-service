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
exports.CustomHtmlDataDto = exports.RichTextDataDto = exports.TestimonialsDataDto = exports.TestimonialItemDto = exports.VideoSectionDataDto = exports.BlogGridDataDto = exports.BrandSliderDataDto = exports.PromoBannerDataDto = exports.CategoryGridDataDto = exports.ProductGridDataDto = exports.FeatureIconsDataDto = exports.FeatureIconDto = exports.HeroSliderDataDto = exports.HeroSlideDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class HeroSlideDto {
    title;
    subtitle;
    imageUrl;
    linkText;
    linkUrl;
}
exports.HeroSlideDto = HeroSlideDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional Title of the slide' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSlideDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional Subtitle of the slide' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSlideDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full image URL for slide background' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSlideDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Call-to-Action button text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSlideDto.prototype, "linkText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Call-to-Action redirect URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSlideDto.prototype, "linkUrl", void 0);
class HeroSliderDataDto {
    slides;
}
exports.HeroSliderDataDto = HeroSliderDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HeroSlideDto], description: 'List of hero slides' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HeroSlideDto),
    __metadata("design:type", Array)
], HeroSliderDataDto.prototype, "slides", void 0);
class FeatureIconDto {
    icon;
    title;
    description;
}
exports.FeatureIconDto = FeatureIconDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature icon name (e.g. shipping, support)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feature highlight text title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional descriptive tagline' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconDto.prototype, "description", void 0);
class FeatureIconsDataDto {
    features;
}
exports.FeatureIconsDataDto = FeatureIconsDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FeatureIconDto], description: 'Highlighted features list' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FeatureIconDto),
    __metadata("design:type", Array)
], FeatureIconsDataDto.prototype, "features", void 0);
class ProductGridDataDto {
    title;
    categoryId;
    tag;
    limit = 8;
    sortBy = 'createdAt';
}
exports.ProductGridDataDto = ProductGridDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section Title', default: 'Trending Products' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductGridDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter products by category ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductGridDataDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter products by specific tag' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductGridDataDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Max products to fetch', default: 8 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductGridDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Field to sort products by', default: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductGridDataDto.prototype, "sortBy", void 0);
class CategoryGridDataDto {
    title;
    categoryIds;
    layout = 'circle';
}
exports.CategoryGridDataDto = CategoryGridDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section Title', default: 'Shop by Category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryGridDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Curated list of category reference IDs' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CategoryGridDataDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Grid display layout style', default: 'circle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['circle', 'square']),
    __metadata("design:type", String)
], CategoryGridDataDto.prototype, "layout", void 0);
class PromoBannerDataDto {
    imageUrl;
    altText;
    linkUrl;
    discountText;
}
exports.PromoBannerDataDto = PromoBannerDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Campaign banner image URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image accessibility text description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Redirect URL on banner click' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "linkUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visual overlay discount text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "discountText", void 0);
class BrandSliderDataDto {
    brandIds;
    autoplay = true;
}
exports.BrandSliderDataDto = BrandSliderDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array of brand reference IDs' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BrandSliderDataDto.prototype, "brandIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable automatic sliding', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandSliderDataDto.prototype, "autoplay", void 0);
class BlogGridDataDto {
    title;
    limit = 3;
    blogIds;
}
exports.BlogGridDataDto = BlogGridDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section Title', default: 'Latest from our Blog' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogGridDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Max blog entries to show', default: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], BlogGridDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Optional explicit blog article references' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BlogGridDataDto.prototype, "blogIds", void 0);
class VideoSectionDataDto {
    videoUrl;
    title;
    description;
    autoplay = false;
}
exports.VideoSectionDataDto = VideoSectionDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Direct or embedded video link' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Overlay section Title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Video section body narrative description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable background playback', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VideoSectionDataDto.prototype, "autoplay", void 0);
class TestimonialItemDto {
    authorName;
    rating;
    text;
    avatarUrl;
}
exports.TestimonialItemDto = TestimonialItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reviewing customer full name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "authorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Buyer satisfaction rating out of 5' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], TestimonialItemDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visual feedback quote text content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reviewer profile photo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "avatarUrl", void 0);
class TestimonialsDataDto {
    title;
    testimonials;
}
exports.TestimonialsDataDto = TestimonialsDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section Title', default: 'What our customers say' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialsDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestimonialItemDto], description: 'Verified buyer testimonials' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TestimonialItemDto),
    __metadata("design:type", Array)
], TestimonialsDataDto.prototype, "testimonials", void 0);
class RichTextDataDto {
    content;
}
exports.RichTextDataDto = RichTextDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Formatted raw or WYSIWYG rich text block content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RichTextDataDto.prototype, "content", void 0);
class CustomHtmlDataDto {
    html;
}
exports.CustomHtmlDataDto = CustomHtmlDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dynamic unescaped custom raw HTML/CSS block' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomHtmlDataDto.prototype, "html", void 0);
//# sourceMappingURL=component-data.dto.js.map