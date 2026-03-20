import { QueryOptions } from 'src/common/dto/queryOptions.dto';
export declare class CategoryQueryOptionsDto extends QueryOptions {
    searchTerm?: string;
    parentCategory?: string;
    isActive?: boolean;
    level?: number;
}
