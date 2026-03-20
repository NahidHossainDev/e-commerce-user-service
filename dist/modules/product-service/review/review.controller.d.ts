import { IAuthUser } from 'src/common/interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';
import { VoteType } from './schemas/review.schema';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(user: IAuthUser, createReviewDto: CreateReviewDto): Promise<import("./schemas/review.schema").ReviewDocument>;
    findAll(query: ReviewQueryOptionsDto): Promise<import("src/common/interface").IPaginatedResponse<import("./schemas/review.schema").ReviewDocument>>;
    getSummary(productId: string): Promise<import("./schemas/rating-summary.schema").RatingSummaryDocument>;
    findOne(id: string): Promise<import("./schemas/review.schema").ReviewDocument>;
    update(id: string, updateReviewDto: UpdateReviewDto, admin: IAuthUser): Promise<import("./schemas/review.schema").ReviewDocument>;
    remove(id: string): Promise<import("./schemas/review.schema").ReviewDocument>;
    vote(id: string, user: IAuthUser, voteType: VoteType): Promise<import("./schemas/review.schema").ReviewDocument>;
}
