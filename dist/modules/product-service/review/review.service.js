"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const review_constants_1 = require("./review.constants");
const rating_summary_schema_1 = require("./schemas/rating-summary.schema");
const review_schema_1 = require("./schemas/review.schema");
let ReviewService = class ReviewService {
    reviewModel;
    ratingSummaryModel;
    constructor(reviewModel, ratingSummaryModel) {
        this.reviewModel = reviewModel;
        this.ratingSummaryModel = ratingSummaryModel;
    }
    async create(userId, createReviewDto) {
        const existingReview = await this.reviewModel.findOne({
            productId: createReviewDto.productId,
            user: userId,
        });
        if (existingReview) {
            throw new common_1.ConflictException('You have already reviewed this product');
        }
        const review = await this.reviewModel.create({
            ...createReviewDto,
            user: userId,
            status: review_schema_1.ReviewStatus.APPROVED,
        });
        await this.updateRatingSummary(new mongoose_2.Types.ObjectId(createReviewDto.productId));
        return review;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filterQuery = (0, helpers_1.pick)(query, review_constants_1.reviewFilterableFields);
        if (filterQuery.searchTerm) {
            filterQuery.$or = review_constants_1.reviewSearchableFields.map((field) => ({
                [field]: { $regex: filterQuery.searchTerm, $options: 'i' },
            }));
            delete filterQuery.searchTerm;
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.reviewModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findOne(id) {
        const review = await this.reviewModel.findById(id).exec();
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }
    async update(id, updateReviewDto, adminId) {
        const updateData = { ...updateReviewDto };
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
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        await this.updateRatingSummary(updatedReview.productId);
        return updatedReview;
    }
    async remove(id) {
        const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!deletedReview) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        await this.updateRatingSummary(deletedReview.productId);
        return deletedReview;
    }
    async vote(id, userId, voteType) {
        const review = await this.reviewModel.findById(id);
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        const existingVoteIndex = review.votedBy.findIndex((v) => v.user.toString() === userId);
        if (existingVoteIndex !== -1) {
            const existingVote = review.votedBy[existingVoteIndex];
            if (existingVote.voteType === voteType) {
                review.votedBy.splice(existingVoteIndex, 1);
                if (voteType === review_schema_1.VoteType.HELPFUL)
                    review.helpfulVotes--;
                else
                    review.unhelpfulVotes--;
            }
            else {
                existingVote.voteType = voteType;
                if (voteType === review_schema_1.VoteType.HELPFUL) {
                    review.helpfulVotes++;
                    review.unhelpfulVotes--;
                }
                else {
                    review.unhelpfulVotes++;
                    review.helpfulVotes--;
                }
            }
        }
        else {
            review.votedBy.push({ user: new mongoose_2.Types.ObjectId(userId), voteType });
            if (voteType === review_schema_1.VoteType.HELPFUL)
                review.helpfulVotes++;
            else
                review.unhelpfulVotes++;
        }
        return review.save();
    }
    async getRatingSummary(productId) {
        const summary = await this.ratingSummaryModel.findOne({ productId }).exec();
        if (!summary) {
            throw new common_1.NotFoundException(`Rating summary for product ${productId} not found`);
        }
        return summary;
    }
    async updateRatingSummary(productId) {
        const stats = await this.reviewModel.aggregate([
            { $match: { productId, status: review_schema_1.ReviewStatus.APPROVED } },
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
            await this.ratingSummaryModel.findOneAndUpdate({ productId }, {
                totalReviews: 0,
                totalRatings: 0,
                averageRating: 0,
                ratingDistribution: { five: 0, four: 0, three: 0, two: 0, one: 0 },
            }, { upsert: true });
            return;
        }
        const { totalReviews, averageRating, totalRatings, five, four, three, two, one, } = stats[0];
        await this.ratingSummaryModel.findOneAndUpdate({ productId }, {
            totalReviews,
            totalRatings,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution: { five, four, three, two, one },
        }, { upsert: true });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(rating_summary_schema_1.RatingSummary.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ReviewService);
//# sourceMappingURL=review.service.js.map