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
exports.BrandGridDataDto = exports.BrandGridSliderSettingsDto = exports.InfoBoxDataDto = exports.CtaBannerDataDto = exports.SectionHeaderDataDto = exports.CustomHtmlDataDto = exports.RichTextDataDto = exports.TestimonialsDataDto = exports.TestimonialItemDto = exports.VideoSectionDataDto = exports.BlogGridDataDto = exports.PromoBannerDataDto = exports.PromoBannerItemDto = exports.ImageGridDataDto = exports.ImageGridItemDto = exports.CategoryGridDataDto = exports.CategoryGridItemDto = exports.ProductSectionDataDto = exports.ProductSectionSliderSettingsDto = exports.FeatureIconsDataDto = exports.FeatureIconItemDto = exports.HeroSliderDataDto = exports.HeroSliderSlideDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class HeroSliderSlideDto {
    image;
    showTitle;
    title;
    subtitle;
    showButton;
    buttonText;
    buttonLink;
}
exports.HeroSliderSlideDto = HeroSliderSlideDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slide background image URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSliderSlideDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show title overlay text flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HeroSliderSlideDto.prototype, "showTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Slide title text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSliderSlideDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Slide subtitle text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSliderSlideDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show action button flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HeroSliderSlideDto.prototype, "showButton", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button label text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSliderSlideDto.prototype, "buttonText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button redirect destination URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HeroSliderSlideDto.prototype, "buttonLink", void 0);
class HeroSliderDataDto {
    slides;
    autoplay;
    interval;
    showArrows;
    showDots;
}
exports.HeroSliderDataDto = HeroSliderDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HeroSliderSlideDto], description: 'List of slides' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HeroSliderSlideDto),
    __metadata("design:type", Array)
], HeroSliderDataDto.prototype, "slides", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable slide transitions automatic rotations flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HeroSliderDataDto.prototype, "autoplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Slider rotation duration interval in ms', default: 4000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], HeroSliderDataDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display next/prev navigator arrow indicators flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HeroSliderDataDto.prototype, "showArrows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display slide dots paginator controls flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HeroSliderDataDto.prototype, "showDots", void 0);
class FeatureIconItemDto {
    icon;
    title;
    subtitle;
}
exports.FeatureIconItemDto = FeatureIconItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Icon name (e.g. Truck, CustomerService)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconItemDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Heading label title text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description sub-detail tag text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconItemDto.prototype, "subtitle", void 0);
class FeatureIconsDataDto {
    showDivider;
    titleColor;
    titleSize;
    subTextSize;
    items;
}
exports.FeatureIconsDataDto = FeatureIconsDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show grid layout borders divide lines flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FeatureIconsDataDto.prototype, "showDivider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Title color CSS override hex code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeatureIconsDataDto.prototype, "titleColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Title size font index override', default: 14 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeatureIconsDataDto.prototype, "titleSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subtitle size font index override', default: 12 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FeatureIconsDataDto.prototype, "subTextSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [FeatureIconItemDto], description: 'Feature highlights list items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FeatureIconItemDto),
    __metadata("design:type", Array)
], FeatureIconsDataDto.prototype, "items", void 0);
class ProductSectionSliderSettingsDto {
    autoplay;
    showArrows;
    showDots;
    interval;
}
exports.ProductSectionSliderSettingsDto = ProductSectionSliderSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autoplay slider flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSectionSliderSettingsDto.prototype, "autoplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show slider navigation arrows flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSectionSliderSettingsDto.prototype, "showArrows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show slider dots pagination flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSectionSliderSettingsDto.prototype, "showDots", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autoplay transition duration speed in ms', default: 3000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductSectionSliderSettingsDto.prototype, "interval", void 0);
class ProductSectionDataDto {
    title;
    productIds;
    cardType;
    enableSlider;
    slidesPerView;
    slidesToScroll;
    sliderSettings;
}
exports.ProductSectionDataDto = ProductSectionDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional Section Title heading text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductSectionDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Selected Product IDs list' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ProductSectionDataDto.prototype, "productIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visual border style pattern for product cards', enum: ['half_border', 'full_border'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['half_border', 'full_border']),
    __metadata("design:type", String)
], ProductSectionDataDto.prototype, "cardType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable slider layout mode view option', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductSectionDataDto.prototype, "enableSlider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Count of visible card items per page row view', default: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductSectionDataDto.prototype, "slidesPerView", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Count of card items to shift per swipe pagination', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductSectionDataDto.prototype, "slidesToScroll", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ProductSectionSliderSettingsDto, description: 'Slider specific configurations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProductSectionSliderSettingsDto),
    __metadata("design:type", ProductSectionSliderSettingsDto)
], ProductSectionDataDto.prototype, "sliderSettings", void 0);
class CategoryGridItemDto {
    image;
    title;
    subtitle;
}
exports.CategoryGridItemDto = CategoryGridItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category image asset cover URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryGridItemDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name header text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryGridItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category secondary info description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryGridItemDto.prototype, "subtitle", void 0);
class CategoryGridDataDto {
    categoryIds;
    showDivider;
    items;
}
exports.CategoryGridDataDto = CategoryGridDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Mapped category database reference IDs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CategoryGridDataDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show card divide borders lines flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CategoryGridDataDto.prototype, "showDivider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryGridItemDto], description: 'Category grid list cards items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryGridItemDto),
    __metadata("design:type", Array)
], CategoryGridDataDto.prototype, "items", void 0);
class ImageGridItemDto {
    image;
    altText;
    name;
    link;
}
exports.ImageGridItemDto = ImageGridItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image asset target URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridItemDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Accessibility tag descriptive text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridItemDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Overlay name tag label text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Image card click redirect URL link' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridItemDto.prototype, "link", void 0);
class ImageGridDataDto {
    layoutMode;
    columns;
    gapWidth;
    gapType;
    showDivider;
    backgroundColor;
    itemBgColor;
    paddingTop;
    paddingBottom;
    images;
}
exports.ImageGridDataDto = ImageGridDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image display layout mode structure style', enum: ['grid', 'carousel'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['grid', 'carousel']),
    __metadata("design:type", String)
], ImageGridDataDto.prototype, "layoutMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Max row columns count display layout', default: 4 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImageGridDataDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom grid cell gutter width size in pixels', default: 16 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImageGridDataDto.prototype, "gapWidth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gutter mapping coverage pattern', default: 'middle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridDataDto.prototype, "gapType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show dividers lines borders between image tiles flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImageGridDataDto.prototype, "showDivider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Outer section background color hex' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridDataDto.prototype, "backgroundColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Inner element background color hex' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImageGridDataDto.prototype, "itemBgColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Top padding in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImageGridDataDto.prototype, "paddingTop", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bottom padding in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ImageGridDataDto.prototype, "paddingBottom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ImageGridItemDto], description: 'Grid image list array' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImageGridItemDto),
    __metadata("design:type", Array)
], ImageGridDataDto.prototype, "images", void 0);
class PromoBannerItemDto {
    image;
    link;
}
exports.PromoBannerItemDto = PromoBannerItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Promo banner asset cover image URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerItemDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Promo banner click destination redirect URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerItemDto.prototype, "link", void 0);
class PromoBannerDataDto {
    gapWidth;
    gapColor;
    gapType;
    banners;
}
exports.PromoBannerDataDto = PromoBannerDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Banner spacing gutter width size in pixels', default: 16 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PromoBannerDataDto.prototype, "gapWidth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Banner gap color hex' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "gapColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gutter coverage layout pattern', enum: ['middle', 'none', 'around'], default: 'middle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['middle', 'none', 'around']),
    __metadata("design:type", String)
], PromoBannerDataDto.prototype, "gapType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PromoBannerItemDto], description: 'Campaign banners list array' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PromoBannerItemDto),
    __metadata("design:type", Array)
], PromoBannerDataDto.prototype, "banners", void 0);
class BlogGridDataDto {
    title;
    limit;
    layout;
    showViewAll;
    viewAllLink;
}
exports.BlogGridDataDto = BlogGridDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Section title header text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogGridDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Max articles fetch limit count', default: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BlogGridDataDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display layout presentation mode', enum: ['grid', 'list'], default: 'grid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['grid', 'list']),
    __metadata("design:type", String)
], BlogGridDataDto.prototype, "layout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show view all CTA button option flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BlogGridDataDto.prototype, "showViewAll", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'View all page route redirect URL link' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BlogGridDataDto.prototype, "viewAllLink", void 0);
class VideoSectionDataDto {
    title;
    subtitle;
    videoUrl;
    thumbnail;
    altText;
    autoplay;
    muted;
}
exports.VideoSectionDataDto = VideoSectionDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Section overlay title heading text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Section description subtitle detail text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Video source target playback URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fallback thumbnail preview cover image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Thumbnail tag descriptive alt text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoSectionDataDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable autoplay playback flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VideoSectionDataDto.prototype, "autoplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Audio output muted default flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VideoSectionDataDto.prototype, "muted", void 0);
class TestimonialItemDto {
    name;
    avatar;
    altText;
    role;
    rating;
    comment;
}
exports.TestimonialItemDto = TestimonialItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer feedback name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer avatar logo image URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avatar descriptive accessibility text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "altText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Author business job title or role tag text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product rating score points count (1-5)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], TestimonialItemDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback review comment text details' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialItemDto.prototype, "comment", void 0);
class TestimonialsDataDto {
    title;
    items;
    autoplay;
}
exports.TestimonialsDataDto = TestimonialsDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Section title header text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestimonialsDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TestimonialItemDto], description: 'Review cards list array' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TestimonialItemDto),
    __metadata("design:type", Array)
], TestimonialsDataDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autoplay slider transition rotate option flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TestimonialsDataDto.prototype, "autoplay", void 0);
class RichTextDataDto {
    content;
}
exports.RichTextDataDto = RichTextDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'WYSIWYG generated HTML content string' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RichTextDataDto.prototype, "content", void 0);
class CustomHtmlDataDto {
    html;
}
exports.CustomHtmlDataDto = CustomHtmlDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unescaped dynamic custom raw HTML output code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomHtmlDataDto.prototype, "html", void 0);
class SectionHeaderDataDto {
    title;
    subtitle;
    textCenter;
    showButton;
    buttonText;
    buttonLink;
    paddingTop;
    paddingBottom;
    paddingLeft;
    paddingRight;
}
exports.SectionHeaderDataDto = SectionHeaderDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Header text title heading' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SectionHeaderDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Secondary header subtitle' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SectionHeaderDataDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Center align text flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SectionHeaderDataDto.prototype, "textCenter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Display header right call-to-action button', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SectionHeaderDataDto.prototype, "showButton", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button label text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SectionHeaderDataDto.prototype, "buttonText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button redirect destination URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SectionHeaderDataDto.prototype, "buttonLink", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Top padding size in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SectionHeaderDataDto.prototype, "paddingTop", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bottom padding size in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SectionHeaderDataDto.prototype, "paddingBottom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Left padding size in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SectionHeaderDataDto.prototype, "paddingLeft", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Right padding size in pixels' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SectionHeaderDataDto.prototype, "paddingRight", void 0);
class CtaBannerDataDto {
    image;
    badge;
    title;
    subtitle;
    buttonText;
    buttonLink;
    position;
    theme;
}
exports.CtaBannerDataDto = CtaBannerDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cover background image URL' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visual overlay mini badge tag text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "badge", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Banner title heading text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Banner subtitle description message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button text label' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "buttonText", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Action button click redirect destination URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "buttonLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content positioning layout alignment style', enum: ['left', 'right', 'center'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['left', 'right', 'center']),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visual style theme mode', enum: ['light', 'dark'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['light', 'dark']),
    __metadata("design:type", String)
], CtaBannerDataDto.prototype, "theme", void 0);
class InfoBoxDataDto {
    title;
    content;
    badgeBgColor;
    badgeTextColor;
    borderColor;
    backgroundColor;
}
exports.InfoBoxDataDto = InfoBoxDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Box title heading' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Box details body paragraph text content' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mini badge tag background color hex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "badgeBgColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mini badge tag text color hex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "badgeTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Box outline border color hex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "borderColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inner box background color hex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InfoBoxDataDto.prototype, "backgroundColor", void 0);
class BrandGridSliderSettingsDto {
    autoplay;
    showArrows;
    showDots;
    interval;
}
exports.BrandGridSliderSettingsDto = BrandGridSliderSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autoplay slider transitions flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandGridSliderSettingsDto.prototype, "autoplay", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show navigation arrows controls flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandGridSliderSettingsDto.prototype, "showArrows", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show slider dots pagination flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandGridSliderSettingsDto.prototype, "showDots", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Autoplay transition duration speed in ms', default: 3000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BrandGridSliderSettingsDto.prototype, "interval", void 0);
class BrandGridDataDto {
    brandIds;
    showDivider;
    enableSlider;
    sliderSettings;
}
exports.BrandGridDataDto = BrandGridDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Selected Brand reference IDs list' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BrandGridDataDto.prototype, "brandIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Show card divide borders lines flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandGridDataDto.prototype, "showDivider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Enable slider layout mode option flag', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BrandGridDataDto.prototype, "enableSlider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BrandGridSliderSettingsDto, description: 'Slider specific configurations' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BrandGridSliderSettingsDto),
    __metadata("design:type", BrandGridSliderSettingsDto)
], BrandGridDataDto.prototype, "sliderSettings", void 0);
//# sourceMappingURL=component-data.dto.js.map