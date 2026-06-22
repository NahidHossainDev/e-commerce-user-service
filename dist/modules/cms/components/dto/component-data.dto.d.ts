export declare class HeroSliderSlideDto {
    image: string;
    showTitle?: boolean;
    title?: string;
    subtitle?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
}
export declare class HeroSliderDataDto {
    slides: HeroSliderSlideDto[];
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
}
export declare class FeatureIconItemDto {
    icon: string;
    title: string;
    subtitle: string;
}
export declare class FeatureIconsDataDto {
    showDivider?: boolean;
    titleColor?: string;
    titleSize?: number;
    subTextSize?: number;
    items: FeatureIconItemDto[];
}
export declare class ProductSectionSliderSettingsDto {
    autoplay?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    interval?: number;
}
export declare class ProductSectionDataDto {
    title?: string;
    productIds: string[];
    cardType: 'half_border' | 'full_border';
    enableSlider?: boolean;
    slidesPerView?: number;
    slidesToScroll?: number;
    sliderSettings?: ProductSectionSliderSettingsDto;
}
export declare class CategoryGridItemDto {
    image: string;
    title: string;
    subtitle: string;
}
export declare class CategoryGridDataDto {
    categoryIds?: string[];
    showDivider?: boolean;
    items: CategoryGridItemDto[];
}
export declare class ImageGridItemDto {
    image: string;
    altText?: string;
    name?: string;
    link?: string;
}
export declare class ImageGridDataDto {
    layoutMode: 'grid' | 'carousel';
    columns?: number;
    gapWidth?: number;
    gapType?: string;
    showDivider?: boolean;
    backgroundColor?: string;
    itemBgColor?: string;
    paddingTop?: number;
    paddingBottom?: number;
    images: ImageGridItemDto[];
}
export declare class PromoBannerItemDto {
    image: string;
    link?: string;
}
export declare class PromoBannerDataDto {
    gapWidth?: number;
    gapColor?: string;
    gapType?: 'middle' | 'none' | 'around';
    banners: PromoBannerItemDto[];
}
export declare class BlogGridDataDto {
    title: string;
    limit?: number;
    layout?: 'grid' | 'list';
    showViewAll?: boolean;
    viewAllLink?: string;
}
export declare class VideoSectionDataDto {
    title: string;
    subtitle?: string;
    videoUrl: string;
    thumbnail?: string;
    altText?: string;
    autoplay?: boolean;
    muted?: boolean;
}
export declare class TestimonialItemDto {
    name: string;
    avatar?: string;
    altText?: string;
    role?: string;
    rating: number;
    comment: string;
}
export declare class TestimonialsDataDto {
    title: string;
    items: TestimonialItemDto[];
    autoplay?: boolean;
}
export declare class RichTextDataDto {
    content: string;
}
export declare class CustomHtmlDataDto {
    html: string;
}
export declare class SectionHeaderDataDto {
    title: string;
    subtitle?: string;
    textCenter?: boolean;
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
}
export declare class CtaBannerDataDto {
    image: string;
    badge?: string;
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    position: 'left' | 'right' | 'center';
    theme: 'light' | 'dark';
}
export declare class InfoBoxDataDto {
    title: string;
    content: string;
    badgeBgColor: string;
    badgeTextColor: string;
    borderColor: string;
    backgroundColor: string;
}
export declare class BrandGridSliderSettingsDto {
    autoplay?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    interval?: number;
}
export declare class BrandGridDataDto {
    brandIds: string[];
    showDivider?: boolean;
    enableSlider?: boolean;
    sliderSettings?: BrandGridSliderSettingsDto;
}
