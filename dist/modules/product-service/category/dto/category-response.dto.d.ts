export declare class CategoryMetaDto {
    title: string;
    description: string;
}
export declare class CategoryResponseDto {
    _id: any;
    name: string;
    slug: string;
    description: string;
    image: string;
    parentCategoryId: any;
    level: number;
    path: string;
    isActive: boolean;
    productCount: number;
    sortOrder: number;
    meta?: CategoryMetaDto;
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
export declare class PaginatedCategoriesResponseDto {
    data: CategoryResponseDto[];
    meta: PaginationMetaDto;
}
export declare class CategoryTreeResponseDto extends CategoryResponseDto {
    children?: CategoryTreeResponseDto[];
}
export declare class MinimalCategoryTreeDto {
    _id: any;
    name: string;
    slug: string;
    sortOrder: number;
    level: number;
    productCount: number;
    children?: MinimalCategoryTreeDto[];
}
