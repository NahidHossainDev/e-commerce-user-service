export declare class HeroSlideDto {
    title?: string;
    subtitle?: string;
    imageUrl: string;
    linkText?: string;
    linkUrl?: string;
}
export declare class HeroSliderDataDto {
    slides: HeroSlideDto[];
}
export declare class FeatureIconDto {
    icon: string;
    title: string;
    description?: string;
}
export declare class FeatureIconsDataDto {
    features: FeatureIconDto[];
}
export declare class ProductGridDataDto {
    title?: string;
    categoryId?: string;
    tag?: string;
    limit: number;
    sortBy: string;
}
export declare class CategoryGridDataDto {
    title?: string;
    categoryIds: string[];
    layout: string;
}
export declare class PromoBannerDataDto {
    imageUrl: string;
    altText?: string;
    linkUrl?: string;
    discountText?: string;
}
export declare class ImageGridItemDto {
    image: string;
    altText: string;
    name?: string;
    link?: string;
}
export declare class ImageGridDataDto {
    images: ImageGridItemDto[];
    layoutMode: string;
    columns: number;
    gapWidth: number;
    gapType: string;
    showDivider: boolean;
    backgroundColor?: string;
    itemBgColor?: string;
    paddingTop?: number;
    paddingBottom?: number;
}
export declare class BlogGridDataDto {
    title?: string;
    limit: number;
    blogIds?: string[];
}
export declare class VideoSectionDataDto {
    videoUrl: string;
    title?: string;
    description?: string;
    autoplay: boolean;
}
export declare class TestimonialItemDto {
    authorName: string;
    rating: number;
    text: string;
    avatarUrl?: string;
}
export declare class TestimonialsDataDto {
    title?: string;
    testimonials: TestimonialItemDto[];
}
export declare class RichTextDataDto {
    content: string;
}
export declare class CustomHtmlDataDto {
    html: string;
}
