export declare class AdminResponseDto {
    message: string;
    respondedBy: any;
    respondedAt: Date;
}
export declare class ReviewResponseDto {
    _id: any;
    productId: any;
    user: any;
    comment: string;
    rating: number;
    status: string;
    isVerifiedPurchase: boolean;
    helpfulVotes: number;
    unhelpfulVotes: number;
    adminResponse?: AdminResponseDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RatingDistributionDto {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
}
export declare class RatingSummaryResponseDto {
    productId: any;
    totalReviews: number;
    totalRatings: number;
    averageRating: number;
    ratingDistribution: RatingDistributionDto;
}
export declare class PaginationMetaDto {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
}
export declare class PaginatedReviewsResponseDto {
    data: ReviewResponseDto[];
    meta: PaginationMetaDto;
}
