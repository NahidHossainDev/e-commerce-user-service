import { IAuthUser } from 'src/common/interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
import { PaginatedReviewsResponseDto, RatingSummaryResponseDto, ReviewResponseDto } from './dto/review-response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';
import { VoteType } from './schemas/review.schema';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(user: IAuthUser, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto>;
    findAll(query: ReviewQueryOptionsDto): Promise<PaginatedReviewsResponseDto>;
    getSummary(productId: string): Promise<RatingSummaryResponseDto>;
    findOne(id: string): Promise<ReviewResponseDto>;
    update(id: string, updateReviewDto: UpdateReviewDto, admin: IAuthUser): Promise<ReviewResponseDto>;
    remove(id: string): Promise<ReviewResponseDto>;
    vote(id: string, user: IAuthUser, voteType: VoteType): Promise<ReviewResponseDto>;
}
