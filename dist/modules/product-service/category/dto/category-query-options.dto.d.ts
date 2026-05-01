import { QueryOptions } from 'src/common/dto/queryOptions.dto';
export declare class CategoryQueryOptionsDto extends QueryOptions {
    searchTerm?: string;
    parentCategoryId?: string;
    isActive?: boolean;
    level?: number;
}
