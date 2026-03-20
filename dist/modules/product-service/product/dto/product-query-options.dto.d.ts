import { QueryOptions } from '../../../../common/dto';
import { ProductStatus } from '../schemas/product.schema';
export declare class ProductQueryDto extends QueryOptions {
    searchTerm?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: ProductStatus;
    vendorId?: string;
    isFeatured?: boolean;
    isOnOffer?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    isPerishable?: boolean;
}
