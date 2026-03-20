import { DiscountType } from '../schemas/coupon.schema';
export declare class CreateCouponDto {
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
    discountType: DiscountType;
    discountValue: number;
    maxDiscountAmount?: number;
    validFrom: Date;
    validTo: Date;
    usageLimit?: number;
    usageLimitPerUser?: number;
}
export declare class CouponValidationDto {
    code?: string;
    couponId?: string;
    userId?: string;
    orderAmount?: number;
}
