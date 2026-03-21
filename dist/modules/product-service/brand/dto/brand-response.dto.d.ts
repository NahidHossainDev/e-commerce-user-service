export declare class SocialMediaDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}
export declare class BrandMetaDto {
    title: string;
    description: string;
    keywords: string[];
}
export declare class BrandResponseDto {
    _id: any;
    name: string;
    slug: string;
    description: string;
    logo: string;
    website: string;
    establishedYear: number;
    country: string;
    isActive: boolean;
    socialMedia: SocialMediaDto;
    productCount: number;
    averageRating: number;
    meta?: BrandMetaDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaginationMetaDto {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
}
export declare class PaginatedBrandsResponseDto {
    data: BrandResponseDto[];
    meta: PaginationMetaDto;
}
