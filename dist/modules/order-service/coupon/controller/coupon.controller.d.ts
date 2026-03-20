import { CouponService } from '../coupon.service';
import { CouponValidationDto } from '../dto/coupon.dto';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    validateCoupon(body: CouponValidationDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
