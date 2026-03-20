import { HydratedDocument, Types } from 'mongoose';
export type CouponUsageDocument = HydratedDocument<CouponUsage>;
export declare class CouponUsage {
    couponId: Types.ObjectId;
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    discountAmount: number;
}
export declare const CouponUsageSchema: import("mongoose").Schema<CouponUsage, import("mongoose").Model<CouponUsage, any, any, any, import("mongoose").Document<unknown, any, CouponUsage, any, {}> & CouponUsage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CouponUsage, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<CouponUsage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CouponUsage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
