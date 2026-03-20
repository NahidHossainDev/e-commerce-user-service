import { HydratedDocument, Types } from 'mongoose';
export type CouponDocument = HydratedDocument<Coupon>;
export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    FREE_SHIPPING = "FREE_SHIPPING"
}
export declare class Coupon {
    _id: Types.ObjectId;
    code: string;
    name: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscountAmount: number;
    minOrderAmount: number;
    validFrom: Date;
    validTo: Date;
    usageLimit: number;
    usageCount: number;
    usageLimitPerUser: number;
    isActive: boolean;
    rules: Record<string, any>;
}
export declare const CouponSchema: import("mongoose").Schema<Coupon, import("mongoose").Model<Coupon, any, any, any, import("mongoose").Document<unknown, any, Coupon, any, {}> & Coupon & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Coupon>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Coupon> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
