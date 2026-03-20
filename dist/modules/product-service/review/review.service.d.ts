import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RatingSummaryDocument } from './schemas/rating-summary.schema';
import { ReviewDocument, VoteType } from './schemas/review.schema';
export declare class ReviewService {
    private readonly reviewModel;
    private readonly ratingSummaryModel;
    constructor(reviewModel: Model<ReviewDocument>, ratingSummaryModel: Model<RatingSummaryDocument>);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument>;
    findAll(query: ReviewQueryOptionsDto): Promise<import("../../../common/interface").IPaginatedResponse<ReviewDocument>>;
    findOne(id: string): Promise<ReviewDocument>;
    update(id: string, updateReviewDto: UpdateReviewDto, adminId?: string): Promise<ReviewDocument>;
    remove(id: string): Promise<ReviewDocument>;
    vote(id: string, userId: string, voteType: VoteType): Promise<ReviewDocument>;
    getRatingSummary(productId: string): Promise<RatingSummaryDocument>;
    private updateRatingSummary;
}
