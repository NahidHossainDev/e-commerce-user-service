import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { DiscountType } from '../schemas/coupon.schema';
export declare class CouponQueryOptions extends QueryOptions {
    searchTerm?: string;
    discountType?: DiscountType;
    isActive?: boolean;
    usageCount?: 'asc' | 'desc';
    validTo?: Date;
}
export declare class CouponUsageQueryOptions extends QueryOptions {
    searchTerm?: string;
    userId?: string;
    couponId?: string;
    usageCount?: 'asc' | 'desc';
    discountAmount?: 'asc' | 'desc';
}
