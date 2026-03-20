declare class SocialMediaDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}
declare class BrandMetaDto {
    title: string;
    description: string;
    keywords: string[];
}
export declare class CreateBrandDto {
    name: string;
    description: string;
    logo?: string;
    website?: string;
    establishedYear?: number;
    country?: string;
    isActive?: boolean;
    sortOrder?: number;
    socialMedia?: SocialMediaDto;
    meta?: BrandMetaDto;
}
export {};
