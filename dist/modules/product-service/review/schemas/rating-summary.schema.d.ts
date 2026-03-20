import { Document, Types } from 'mongoose';
export type RatingSummaryDocument = RatingSummary & Document;
declare class RatingDistribution {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
}
export declare class RatingSummary {
    productId: Types.ObjectId;
    totalReviews: number;
    totalRatings: number;
    averageRating: number;
    ratingDistribution: RatingDistribution;
}
export declare const RatingSummarySchema: import("mongoose").Schema<RatingSummary, import("mongoose").Model<RatingSummary, any, any, any, Document<unknown, any, RatingSummary, any, {}> & RatingSummary & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RatingSummary, Document<unknown, {}, import("mongoose").FlatRecord<RatingSummary>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<RatingSummary> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
