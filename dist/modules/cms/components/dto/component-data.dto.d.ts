export declare class CmsImageDto {
    imageUrl: string;
    altText: string;
    actionLink?: string;
}
export declare class CmsActionDto {
    label: string;
    actionLink: string;
}
export declare class HeroSliderSlideDto {
    image: CmsImageDto;
    showTitle?: boolean;
    title?: string;
    subtitle?: string;
    showButton?: boolean;
    button?: CmsActionDto;
}
export declare class CmsSliderSettingsDto {
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
}
export declare class HeroSliderDataDto {
    slides: HeroSliderSlideDto[];
    sliderSettings: CmsSliderSettingsDto;
}
export declare class FeatureIconItemDto {
    image: CmsImageDto;
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
export declare class ProductSectionDataDto {
    productIds: string[];
    cardType: 'half_border' | 'full_border';
    enableSlider?: boolean;
    slidesPerView?: number;
    slidesToScroll?: number;
    sliderSettings?: CmsSliderSettingsDto;
}
export declare class CategoryGridDataDto {
    categoryIds: string[];
    showDivider: boolean;
}
export declare class ImageGridItemDto {
    image: CmsImageDto;
    title: string;
    actionLink?: string;
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
export declare class PromoBannerDataDto {
    gapWidth?: number;
    gapColor?: string;
    gapType?: 'middle' | 'none' | 'around';
    banners: CmsImageDto[];
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
export declare class SectionHeaderButtonDto {
    label: string;
    link: string;
}
export declare class SectionHeaderPaddingDto {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}
export declare class SectionHeaderDataDto {
    title: string;
    titleAlign: 'left' | 'center' | 'right';
    subtitle?: string;
    showButton: boolean;
    button?: SectionHeaderButtonDto;
    padding?: SectionHeaderPaddingDto;
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
export declare class BrandGridDataDto {
    brandIds: string[];
    showDivider?: boolean;
    enableSlider?: boolean;
    sliderSettings?: CmsSliderSettingsDto;
}
