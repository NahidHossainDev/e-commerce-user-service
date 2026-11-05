import { DiscountType } from '../schemas/coupon.schema';
export declare class CreateCouponDto {
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    isPublic?: boolean;
    isFirstOrderOnly?: boolean;
    eligibleUserIds?: string[];
    discountType: DiscountType;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    validFrom: Date;
    validTo: Date;
    usageLimit?: number;
    usageLimitPerUser?: number;
    rules?: Record<string, any>;
}
export declare class CouponValidationDto {
    code?: string;
    couponId?: string;
    userId?: string;
    orderAmount?: number;
}
export declare class GetAvailableCouponsQueryDto {
    orderAmount?: number;
}
