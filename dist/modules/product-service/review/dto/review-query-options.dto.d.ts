import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { ReviewStatus } from '../schemas/review.schema';
export declare class ReviewQueryOptionsDto extends QueryOptions {
    searchTerm?: string;
    productId?: string;
    user?: string;
    rating?: number;
    status?: ReviewStatus;
    isVerifiedPurchase?: boolean;
}
