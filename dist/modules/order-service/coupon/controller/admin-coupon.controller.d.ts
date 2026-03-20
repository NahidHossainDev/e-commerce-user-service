import { CouponService } from '../coupon.service';
import { CreateCouponDto } from '../dto/coupon.dto';
import { CouponQueryOptions, CouponUsageQueryOptions } from '../dto/coupon.query-options.dto';
export declare class AdminCouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    create(dto: CreateCouponDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(query: CouponQueryOptions): Promise<import("../../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: CreateCouponDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggle(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/coupon.schema").Coupon, {}, {}> & import("../schemas/coupon.schema").Coupon & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getCouponUsageHistory(query: CouponUsageQueryOptions): Promise<import("../../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("../schemas/coupon-usage.schema").CouponUsage, {}, {}> & import("../schemas/coupon-usage.schema").CouponUsage & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>>;
}
