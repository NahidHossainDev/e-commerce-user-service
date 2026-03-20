import { ClientSession, Model } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { CouponValidationDto, CreateCouponDto } from './dto/coupon.dto';
import { CouponQueryOptions, CouponUsageQueryOptions } from './dto/coupon.query-options.dto';
import { CouponUsageDocument } from './schemas/coupon-usage.schema';
import { CouponDocument } from './schemas/coupon.schema';
export declare class CouponService {
    private couponModel;
    private couponUsageModel;
    constructor(couponModel: Model<CouponDocument>, couponUsageModel: Model<CouponUsageDocument>);
    create(payload: CreateCouponDto): Promise<CouponDocument>;
    findAll(query: CouponQueryOptions): Promise<IPaginatedResponse<CouponDocument>>;
    findById(id: string): Promise<CouponDocument>;
    findActiveCouponById(id: string, session?: ClientSession): Promise<CouponDocument>;
    findActiveCouponByCode(code: string, session?: ClientSession): Promise<CouponDocument>;
    update(id: string, dto: CreateCouponDto): Promise<CouponDocument>;
    delete(id: string): Promise<CouponDocument>;
    toggle(id: string): Promise<CouponDocument>;
    validateCoupon(payload: CouponValidationDto): Promise<CouponDocument>;
    incrementUsage(payload: ICouponUsagePayload, session?: ClientSession): Promise<void>;
    checkUsageLimit(coupon: CouponDocument, userId: string): Promise<void>;
    logUsage(payload: ICouponUsagePayload, session?: ClientSession): Promise<void>;
    getCouponUsageHistory(query: CouponUsageQueryOptions): Promise<IPaginatedResponse<CouponUsageDocument>>;
}
