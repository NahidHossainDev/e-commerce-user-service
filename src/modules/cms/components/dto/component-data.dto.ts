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
export class HeroSlideDto {
  @ApiPropertyOptional({ description: 'Optional Title of the slide' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Optional Subtitle of the slide' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: 'Full image URL for slide background' })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Call-to-Action button text' })
  @IsOptional()
  @IsString()
  linkText?: string;

  @ApiPropertyOptional({ description: 'Call-to-Action redirect URL' })
  @IsOptional()
  @IsString()
  linkUrl?: string;
}

export class HeroSliderDataDto {
  @ApiProperty({ type: [HeroSlideDto], description: 'List of hero slides' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  slides!: HeroSlideDto[];
}

// ================= FEATURE_ICONS DTOs =================
export class FeatureIconDto {
  @ApiProperty({ description: 'Feature icon name (e.g. shipping, support)' })
  @IsString()
  icon!: string;

  @ApiProperty({ description: 'Feature highlight text title' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ description: 'Optional descriptive tagline' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class FeatureIconsDataDto {
  @ApiProperty({ type: [FeatureIconDto], description: 'Highlighted features list' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureIconDto)
  features!: FeatureIconDto[];
}

// ================= PRODUCT_GRID DTO =================
export class ProductGridDataDto {
  @ApiPropertyOptional({ description: 'Section Title', default: 'Trending Products' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Filter products by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter products by specific tag' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Max products to fetch', default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 8;

  @ApiPropertyOptional({ description: 'Field to sort products by', default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';
}

// ================= CATEGORY_GRID DTO =================
export class CategoryGridDataDto {
  @ApiPropertyOptional({ description: 'Section Title', default: 'Shop by Category' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: [String], description: 'Curated list of category reference IDs' })
  @IsArray()
  @IsString({ each: true })
  categoryIds!: string[];

  @ApiPropertyOptional({ description: 'Grid display layout style', default: 'circle' })
  @IsOptional()
  @IsString()
  @IsIn(['circle', 'square'])
  layout: string = 'circle';
}

// ================= PROMO_BANNER DTO =================
export class PromoBannerDataDto {
  @ApiProperty({ description: 'Campaign banner image URL' })
  @IsString()
  imageUrl!: string;

  @ApiPropertyOptional({ description: 'Image accessibility text description' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Redirect URL on banner click' })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional({ description: 'Visual overlay discount text' })
  @IsOptional()
  @IsString()
  discountText?: string;
}

// ================= BRAND_SLIDER DTO =================
export class BrandSliderDataDto {
  @ApiProperty({ type: [String], description: 'Array of brand reference IDs' })
  @IsArray()
  @IsString({ each: true })
  brandIds!: string[];

  @ApiPropertyOptional({ description: 'Enable automatic sliding', default: true })
  @IsOptional()
  @IsBoolean()
  autoplay: boolean = true;
}

// ================= BLOG_GRID DTO =================
export class BlogGridDataDto {
  @ApiPropertyOptional({ description: 'Section Title', default: 'Latest from our Blog' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Max blog entries to show', default: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 3;

  @ApiPropertyOptional({ type: [String], description: 'Optional explicit blog article references' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blogIds?: string[];
}

// ================= VIDEO_SECTION DTO =================
export class VideoSectionDataDto {
  @ApiProperty({ description: 'Direct or embedded video link' })
  @IsString()
  videoUrl!: string;

  @ApiPropertyOptional({ description: 'Overlay section Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Video section body narrative description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Enable background playback', default: false })
  @IsOptional()
  @IsBoolean()
  autoplay: boolean = false;
}

// ================= TESTIMONIALS DTOs =================
export class TestimonialItemDto {
  @ApiProperty({ description: 'Reviewing customer full name' })
  @IsString()
  authorName!: string;

  @ApiProperty({ description: 'Buyer satisfaction rating out of 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ description: 'Visual feedback quote text content' })
  @IsString()
  text!: string;

  @ApiPropertyOptional({ description: 'Reviewer profile photo URL' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class TestimonialsDataDto {
  @ApiPropertyOptional({ description: 'Section Title', default: 'What our customers say' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: [TestimonialItemDto], description: 'Verified buyer testimonials' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialItemDto)
  testimonials!: TestimonialItemDto[];
}

// ================= RICH_TEXT DTO =================
export class RichTextDataDto {
  @ApiProperty({ description: 'Formatted raw or WYSIWYG rich text block content' })
  @IsString()
  content!: string;
}

// ================= CUSTOM_HTML DTO =================
export class CustomHtmlDataDto {
  @ApiProperty({ description: 'Dynamic unescaped custom raw HTML/CSS block' })
  @IsString()
  html!: string;
}
