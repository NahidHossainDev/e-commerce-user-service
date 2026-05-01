declare class CategoryMetaDto {
    title?: string;
    description?: string;
}
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    image?: string;
    parentCategoryId?: string;
    isActive?: boolean;
    sortOrder?: number;
    meta?: CategoryMetaDto;
}
export {};
