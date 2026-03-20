declare class CategoryMetaDto {
    title?: string;
    description?: string;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    image?: string;
    parentCategory?: string;
    isActive?: boolean;
    sortOrder?: number;
    meta?: CategoryMetaDto;
}
export {};
