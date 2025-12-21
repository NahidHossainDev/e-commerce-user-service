import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { reviewFilterableFields, reviewSearchableFields } from './review.constants';
import { RatingSummary, RatingSummaryDocument } from './schemas/rating-summary.schema';
import { Review, ReviewDocument, ReviewStatus, VoteType } from './schemas/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(RatingSummary.name)
    private readonly ratingSummaryModel: Model<RatingSummaryDocument>,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewDocument> {
    const existingReview = await this.reviewModel.findOne({
      productId: createReviewDto.productId,
      user: userId,
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    // TODO: Verify purchase if needed (isVerifiedPurchase logic)

    const review = await this.reviewModel.create({
      ...createReviewDto,
      user: userId,
      status: ReviewStatus.APPROVED, // Auto-approve for now, or use PENDING
    });

    await this.updateRatingSummary(new Types.ObjectId(createReviewDto.productId));

    return review;
  }

  async findAll(query: ReviewQueryOptionsDto) {
    const paginateQueries = pick(query, paginateOptions as (keyof ReviewQueryOptionsDto)[]);
    const filterQuery: any = pick(query, reviewFilterableFields as (keyof ReviewQueryOptionsDto)[]);

    if (filterQuery.searchTerm) {
      filterQuery.$or = reviewSearchableFields.map((field) => ({
        [field]: { $regex: filterQuery.searchTerm, $options: 'i' },
      }));
      delete filterQuery.searchTerm;
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<ReviewDocument>({
      model: this.reviewModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    adminId?: string,
  ): Promise<ReviewDocument> {
    const updateData: any = { ...updateReviewDto };

    if (updateReviewDto.adminResponse && adminId) {
      updateData.adminResponse = {
        message: updateReviewDto.adminResponse,
        respondedBy: adminId,
        respondedAt: new Date(),
      };
    }

    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // If rating changed or status changed to/from APPROVED, update summary
    // Since CreateReviewDto rating is immutable in this simple implementation, 
    // we only need to worry if status changes affects inclusion.
    await this.updateRatingSummary(updatedReview.productId);

    return updatedReview;
  }

  async remove(id: string): Promise<ReviewDocument> {
    const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();

    if (!deletedReview) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.updateRatingSummary(deletedReview.productId);

    return deletedReview;
  }

  async vote(id: string, userId: string, voteType: VoteType): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    const existingVoteIndex = review.votedBy.findIndex(
      (v) => v.user.toString() === userId,
    );

    if (existingVoteIndex !== -1) {
      const existingVote = review.votedBy[existingVoteIndex];
      if (existingVote.voteType === voteType) {
        // Remove vote if same type (toggle off)
        review.votedBy.splice(existingVoteIndex, 1);
        if (voteType === VoteType.HELPFUL) review.helpfulVotes--;
        else review.unhelpfulVotes--;
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        if (voteType === VoteType.HELPFUL) {
          review.helpfulVotes++;
          review.unhelpfulVotes--;
        } else {
          review.unhelpfulVotes++;
          review.helpfulVotes--;
        }
      }
    } else {
      // Add new vote
      review.votedBy.push({ user: new Types.ObjectId(userId), voteType });
      if (voteType === VoteType.HELPFUL) review.helpfulVotes++;
      else review.unhelpfulVotes++;
    }

    return review.save();
  }

  async getRatingSummary(productId: string): Promise<RatingSummaryDocument> {
    const summary = await this.ratingSummaryModel.findOne({ productId }).exec();
    if (!summary) {
      throw new NotFoundException(`Rating summary for product ${productId} not found`);
    }
    return summary;
  }

  private async updateRatingSummary(productId: Types.ObjectId): Promise<void> {
    const stats = await this.reviewModel.aggregate([
      { $match: { productId, status: ReviewStatus.APPROVED } },
      {
        $group: {
          _id: '$productId',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: '$rating' },
          five: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          four: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          two: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          one: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    if (stats.length === 0) {
      await this.ratingSummaryModel.findOneAndUpdate(
        { productId },
        {
          totalReviews: 0,
          totalRatings: 0,
          averageRating: 0,
          ratingDistribution: { five: 0, four: 0, three: 0, two: 0, one: 0 },
        },
        { upsert: true },
      );
      return;
    }

    const { totalReviews, averageRating, totalRatings, five, four, three, two, one } =
      stats[0];

    await this.ratingSummaryModel.findOneAndUpdate(
      { productId },
      {
        totalReviews,
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingDistribution: { five, four, three, two, one },
      },
      { upsert: true },
    );

    // TODO: Update the product model's averageRating and reviewCount as well if they exist there
  }
}
