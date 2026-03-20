import { Document, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare enum ReviewStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum VoteType {
    HELPFUL = "helpful",
    UNHELPFUL = "unhelpful"
}
declare class Vote {
    user: Types.ObjectId;
    voteType: string;
}
export declare class Review {
    productId: Types.ObjectId;
    user: Types.ObjectId;
    comment: string;
    rating: number;
    status: string;
    isVerifiedPurchase: boolean;
    helpfulVotes: number;
    unhelpfulVotes: number;
    votedBy: Vote[];
    adminResponse: {
        message: string;
        respondedBy: Types.ObjectId;
        respondedAt: Date;
    };
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
