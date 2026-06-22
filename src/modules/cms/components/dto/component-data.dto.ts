import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// ================= HERO_SLIDER DTOs =================
export class HeroSliderSlideDto {
  @ApiProperty({ description: 'Slide background image URL' })
  @IsString()
  image!: string;

  @ApiPropertyOptional({ description: 'Show title overlay text flag', default: true })
  @IsOptional()
  @IsBoolean()
  showTitle?: boolean;

  @ApiPropertyOptional({ description: 'Slide title text' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Slide subtitle text' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Show action button flag', default: false })
  @IsOptional()
  @IsBoolean()
  showButton?: boolean;

  @ApiPropertyOptional({ description: 'Action button label text' })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiPropertyOptional({ description: 'Action button redirect destination URL' })
  @IsOptional()
  @IsString()
  buttonLink?: string;
}

export class HeroSliderDataDto {
  @ApiProperty({ type: [HeroSliderSlideDto], description: 'List of slides' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSliderSlideDto)
  slides!: HeroSliderSlideDto[];

  @ApiPropertyOptional({ description: 'Enable slide transitions automatic rotations flag', default: true })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @ApiPropertyOptional({ description: 'Slider rotation duration interval in ms', default: 4000 })
  @IsOptional()
  @IsNumber()
  interval?: number;

  @ApiPropertyOptional({ description: 'Display next/prev navigator arrow indicators flag', default: true })
  @IsOptional()
  @IsBoolean()
  showArrows?: boolean;

  @ApiPropertyOptional({ description: 'Display slide dots paginator controls flag', default: true })
  @IsOptional()
  @IsBoolean()
  showDots?: boolean;
}

// ================= FEATURE_ICONS DTOs =================
export class FeatureIconItemDto {
  @ApiProperty({ description: 'Icon name (e.g. Truck, CustomerService)' })
  @IsString()
  icon!: string;

  @ApiProperty({ description: 'Heading label title text' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Description sub-detail tag text' })
  @IsString()
  subtitle!: string;
}

export class FeatureIconsDataDto {
  @ApiPropertyOptional({ description: 'Show grid layout borders divide lines flag', default: true })
  @IsOptional()
  @IsBoolean()
  showDivider?: boolean;

  @ApiPropertyOptional({ description: 'Title color CSS override hex code' })
  @IsOptional()
  @IsString()
  titleColor?: string;

  @ApiPropertyOptional({ description: 'Title size font index override', default: 14 })
  @IsOptional()
  @IsNumber()
  titleSize?: number;

  @ApiPropertyOptional({ description: 'Subtitle size font index override', default: 12 })
  @IsOptional()
  @IsNumber()
  subTextSize?: number;

  @ApiProperty({ type: [FeatureIconItemDto], description: 'Feature highlights list items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureIconItemDto)
  items!: FeatureIconItemDto[];
}

// ================= PRODUCT_SECTION DTO =================
export class ProductSectionSliderSettingsDto {
  @ApiPropertyOptional({ description: 'Autoplay slider flag', default: false })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @ApiPropertyOptional({ description: 'Show slider navigation arrows flag', default: true })
  @IsOptional()
  @IsBoolean()
  showArrows?: boolean;

  @ApiPropertyOptional({ description: 'Show slider dots pagination flag', default: false })
  @IsOptional()
  @IsBoolean()
  showDots?: boolean;

  @ApiPropertyOptional({ description: 'Autoplay transition duration speed in ms', default: 3000 })
  @IsOptional()
  @IsNumber()
  interval?: number;
}

export class ProductSectionDataDto {
  @ApiPropertyOptional({ description: 'Optional Section Title heading text' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: [String], description: 'Selected Product IDs list' })
  @IsArray()
  @IsString({ each: true })
  productIds!: string[];

  @ApiProperty({ description: 'Visual border style pattern for product cards', enum: ['half_border', 'full_border'] })
  @IsString()
  @IsIn(['half_border', 'full_border'])
  cardType!: 'half_border' | 'full_border';

  @ApiPropertyOptional({ description: 'Enable slider layout mode view option', default: false })
  @IsOptional()
  @IsBoolean()
  enableSlider?: boolean;

  @ApiPropertyOptional({ description: 'Count of visible card items per page row view', default: 4 })
  @IsOptional()
  @IsNumber()
  slidesPerView?: number;

  @ApiPropertyOptional({ description: 'Count of card items to shift per swipe pagination', default: 1 })
  @IsOptional()
  @IsNumber()
  slidesToScroll?: number;

  @ApiPropertyOptional({ type: ProductSectionSliderSettingsDto, description: 'Slider specific configurations' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductSectionSliderSettingsDto)
  sliderSettings?: ProductSectionSliderSettingsDto;
}

// ================= CATEGORY_GRID DTO =================
export class CategoryGridItemDto {
  @ApiProperty({ description: 'Category image asset cover URL' })
  @IsString()
  image!: string;

  @ApiProperty({ description: 'Category name header text' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Category secondary info description' })
  @IsString()
  subtitle!: string;
}

export class CategoryGridDataDto {
  @ApiPropertyOptional({ type: [String], description: 'Mapped category database reference IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Show card divide borders lines flag', default: false })
  @IsOptional()
  @IsBoolean()
  showDivider?: boolean;

  @ApiProperty({ type: [CategoryGridItemDto], description: 'Category grid list cards items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryGridItemDto)
  items!: CategoryGridItemDto[];
}

// ================= IMAGE_GRID DTO =================
export class ImageGridItemDto {
  @ApiProperty({ description: 'Image asset target URL' })
  @IsString()
  image!: string;

  @ApiPropertyOptional({ description: 'Accessibility tag descriptive text' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Overlay name tag label text' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Image card click redirect URL link' })
  @IsOptional()
  @IsString()
  link?: string;
}

export class ImageGridDataDto {
  @ApiProperty({ description: 'Image display layout mode structure style', enum: ['grid', 'carousel'] })
  @IsString()
  @IsIn(['grid', 'carousel'])
  layoutMode!: 'grid' | 'carousel';

  @ApiPropertyOptional({ description: 'Max row columns count display layout', default: 4 })
  @IsOptional()
  @IsNumber()
  columns?: number;

  @ApiPropertyOptional({ description: 'Custom grid cell gutter width size in pixels', default: 16 })
  @IsOptional()
  @IsNumber()
  gapWidth?: number;

  @ApiPropertyOptional({ description: 'Gutter mapping coverage pattern', default: 'middle' })
  @IsOptional()
  @IsString()
  gapType?: string;

  @ApiPropertyOptional({ description: 'Show dividers lines borders between image tiles flag', default: false })
  @IsOptional()
  @IsBoolean()
  showDivider?: boolean;

  @ApiPropertyOptional({ description: 'Outer section background color hex' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'Inner element background color hex' })
  @IsOptional()
  @IsString()
  itemBgColor?: string;

  @ApiPropertyOptional({ description: 'Top padding in pixels' })
  @IsOptional()
  @IsNumber()
  paddingTop?: number;

  @ApiPropertyOptional({ description: 'Bottom padding in pixels' })
  @IsOptional()
  @IsNumber()
  paddingBottom?: number;

  @ApiProperty({ type: [ImageGridItemDto], description: 'Grid image list array' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageGridItemDto)
  images!: ImageGridItemDto[];
}

// ================= PROMO_BANNER DTO =================
export class PromoBannerItemDto {
  @ApiProperty({ description: 'Promo banner asset cover image URL' })
  @IsString()
  image!: string;

  @ApiPropertyOptional({ description: 'Promo banner click destination redirect URL' })
  @IsOptional()
  @IsString()
  link?: string;
}

export class PromoBannerDataDto {
  @ApiPropertyOptional({ description: 'Banner spacing gutter width size in pixels', default: 16 })
  @IsOptional()
  @IsNumber()
  gapWidth?: number;

  @ApiPropertyOptional({ description: 'Banner gap color hex' })
  @IsOptional()
  @IsString()
  gapColor?: string;

  @ApiPropertyOptional({ description: 'Gutter coverage layout pattern', enum: ['middle', 'none', 'around'], default: 'middle' })
  @IsOptional()
  @IsString()
  @IsIn(['middle', 'none', 'around'])
  gapType?: 'middle' | 'none' | 'around';

  @ApiProperty({ type: [PromoBannerItemDto], description: 'Campaign banners list array' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromoBannerItemDto)
  banners!: PromoBannerItemDto[];
}

// ================= BLOG_GRID DTO =================
export class BlogGridDataDto {
  @ApiProperty({ description: 'Section title header text' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Max articles fetch limit count', default: 3 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Display layout presentation mode', enum: ['grid', 'list'], default: 'grid' })
  @IsOptional()
  @IsString()
  @IsIn(['grid', 'list'])
  layout?: 'grid' | 'list';

  @ApiPropertyOptional({ description: 'Show view all CTA button option flag', default: true })
  @IsOptional()
  @IsBoolean()
  showViewAll?: boolean;

  @ApiPropertyOptional({ description: 'View all page route redirect URL link' })
  @IsOptional()
  @IsString()
  viewAllLink?: string;
}

// ================= VIDEO_SECTION DTO =================
export class VideoSectionDataDto {
  @ApiProperty({ description: 'Section overlay title heading text' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Section description subtitle detail text' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: 'Video source target playback URL' })
  @IsString()
  videoUrl!: string;

  @ApiPropertyOptional({ description: 'Fallback thumbnail preview cover image URL' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ description: 'Thumbnail tag descriptive alt text' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Enable autoplay playback flag', default: false })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @ApiPropertyOptional({ description: 'Audio output muted default flag', default: false })
  @IsOptional()
  @IsBoolean()
  muted?: boolean;
}

// ================= TESTIMONIALS DTOs =================
export class TestimonialItemDto {
  @ApiProperty({ description: 'Customer feedback name' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Customer avatar logo image URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Avatar descriptive accessibility text' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Author business job title or role tag text' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Product rating score points count (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ description: 'Feedback review comment text details' })
  @IsString()
  comment!: string;
}

export class TestimonialsDataDto {
  @ApiProperty({ description: 'Section title header text' })
  @IsString()
  title!: string;

  @ApiProperty({ type: [TestimonialItemDto], description: 'Review cards list array' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDto)
  items!: TestimonialItemDto[];

  @ApiPropertyOptional({ description: 'Autoplay slider transition rotate option flag', default: true })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;
}

// ================= RICH_TEXT DTO =================
export class RichTextDataDto {
  @ApiProperty({ description: 'WYSIWYG generated HTML content string' })
  @IsString()
  content!: string;
}

// ================= CUSTOM_HTML DTO =================
export class CustomHtmlDataDto {
  @ApiProperty({ description: 'Unescaped dynamic custom raw HTML output code' })
  @IsString()
  html!: string;
}

// ================= SECTION_HEADER DTO =================
export class SectionHeaderButtonDto {
  @ApiProperty({ description: 'Call-to-action button label text' })
  @IsString()
  label!: string;

  @ApiProperty({ description: 'Call-to-action redirect link destination URL' })
  @IsString()
  link!: string;
}

export class SectionHeaderPaddingDto {
  @ApiPropertyOptional({ description: 'Top padding in pixels' })
  @IsOptional()
  @IsNumber()
  top?: number;

  @ApiPropertyOptional({ description: 'Bottom padding in pixels' })
  @IsOptional()
  @IsNumber()
  bottom?: number;

  @ApiPropertyOptional({ description: 'Left padding in pixels' })
  @IsOptional()
  @IsNumber()
  left?: number;

  @ApiPropertyOptional({ description: 'Right padding in pixels' })
  @IsOptional()
  @IsNumber()
  right?: number;
}

export class SectionHeaderDataDto {
  @ApiProperty({ description: 'Header text title heading' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Title text alignment positioning', enum: ['left', 'center', 'right'] })
  @IsEnum(['left', 'center', 'right'])
  titleAlign!: 'left' | 'center' | 'right';

  @ApiPropertyOptional({ description: 'Secondary header subtitle' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: 'Display header right call-to-action button' })
  @IsBoolean()
  showButton!: boolean;

  @ApiPropertyOptional({ type: SectionHeaderButtonDto, description: 'Button parameters configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SectionHeaderButtonDto)
  button?: SectionHeaderButtonDto;

  @ApiPropertyOptional({ type: SectionHeaderPaddingDto, description: 'Custom padding dimensions configuration' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SectionHeaderPaddingDto)
  padding?: SectionHeaderPaddingDto;
}

// ================= CTA_BANNER DTO =================
export class CtaBannerDataDto {
  @ApiProperty({ description: 'Cover background image URL' })
  @IsString()
  image!: string;

  @ApiPropertyOptional({ description: 'Visual overlay mini badge tag text' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiProperty({ description: 'Banner title heading text' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Banner subtitle description message' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Action button text label' })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiPropertyOptional({ description: 'Action button click redirect destination URL' })
  @IsOptional()
  @IsString()
  buttonLink?: string;

  @ApiProperty({ description: 'Content positioning layout alignment style', enum: ['left', 'right', 'center'] })
  @IsString()
  @IsIn(['left', 'right', 'center'])
  position!: 'left' | 'right' | 'center';

  @ApiProperty({ description: 'Visual style theme mode', enum: ['light', 'dark'] })
  @IsString()
  @IsIn(['light', 'dark'])
  theme!: 'light' | 'dark';
}

// ================= INFO_BOX DTO =================
export class InfoBoxDataDto {
  @ApiProperty({ description: 'Box title heading' })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'Box details body paragraph text content' })
  @IsString()
  content!: string;

  @ApiProperty({ description: 'Mini badge tag background color hex' })
  @IsString()
  badgeBgColor!: string;

  @ApiProperty({ description: 'Mini badge tag text color hex' })
  @IsString()
  badgeTextColor!: string;

  @ApiProperty({ description: 'Box outline border color hex' })
  @IsString()
  borderColor!: string;

  @ApiProperty({ description: 'Inner box background color hex' })
  @IsString()
  backgroundColor!: string;
}

// ================= BRAND_GRID DTO =================
export class BrandGridSliderSettingsDto {
  @ApiPropertyOptional({ description: 'Autoplay slider transitions flag', default: false })
  @IsOptional()
  @IsBoolean()
  autoplay?: boolean;

  @ApiPropertyOptional({ description: 'Show navigation arrows controls flag', default: true })
  @IsOptional()
  @IsBoolean()
  showArrows?: boolean;

  @ApiPropertyOptional({ description: 'Show slider dots pagination flag', default: false })
  @IsOptional()
  @IsBoolean()
  showDots?: boolean;

  @ApiPropertyOptional({ description: 'Autoplay transition duration speed in ms', default: 3000 })
  @IsOptional()
  @IsNumber()
  interval?: number;
}

export class BrandGridDataDto {
  @ApiProperty({ type: [String], description: 'Selected Brand reference IDs list' })
  @IsArray()
  @IsString({ each: true })
  brandIds!: string[];

  @ApiPropertyOptional({ description: 'Show card divide borders lines flag', default: true })
  @IsOptional()
  @IsBoolean()
  showDivider?: boolean;

  @ApiPropertyOptional({ description: 'Enable slider layout mode option flag', default: false })
  @IsOptional()
  @IsBoolean()
  enableSlider?: boolean;

  @ApiPropertyOptional({ type: BrandGridSliderSettingsDto, description: 'Slider specific configurations' })
  @IsOptional()
  @ValidateNested()
  @Type(() => BrandGridSliderSettingsDto)
  sliderSettings?: BrandGridSliderSettingsDto;
}
