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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedReviewsResponseDto = exports.PaginationMetaDto = exports.RatingSummaryResponseDto = exports.RatingDistributionDto = exports.ReviewResponseDto = exports.AdminResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const review_schema_1 = require("../schemas/review.schema");
class AdminResponseDto {
    message;
    respondedBy;
    respondedAt;
}
exports.AdminResponseDto = AdminResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Thank you for your review!' }),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], AdminResponseDto.prototype, "respondedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], AdminResponseDto.prototype, "respondedAt", void 0);
class ReviewResponseDto {
    _id;
    productId;
    user;
    comment;
    rating;
    status;
    isVerifiedPurchase;
    helpfulVotes;
    unhelpfulVotes;
    adminResponse;
    createdAt;
    updatedAt;
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d012' }),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d034' }),
    __metadata("design:type", Object)
], ReviewResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Great product, highly recommend!' }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, minimum: 1, maximum: 5 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: review_schema_1.ReviewStatus, example: review_schema_1.ReviewStatus.APPROVED }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ReviewResponseDto.prototype, "isVerifiedPurchase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "helpfulVotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], ReviewResponseDto.prototype, "unhelpfulVotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminResponseDto, required: false }),
    __metadata("design:type", AdminResponseDto)
], ReviewResponseDto.prototype, "adminResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "updatedAt", void 0);
class RatingDistributionDto {
    five;
    four;
    three;
    two;
    one;
}
exports.RatingDistributionDto = RatingDistributionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], RatingDistributionDto.prototype, "five", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    __metadata("design:type", Number)
], RatingDistributionDto.prototype, "four", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], RatingDistributionDto.prototype, "three", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], RatingDistributionDto.prototype, "two", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], RatingDistributionDto.prototype, "one", void 0);
class RatingSummaryResponseDto {
    productId;
    totalReviews;
    totalRatings;
    averageRating;
    ratingDistribution;
}
exports.RatingSummaryResponseDto = RatingSummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d012' }),
    __metadata("design:type", Object)
], RatingSummaryResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], RatingSummaryResponseDto.prototype, "totalReviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450 }),
    __metadata("design:type", Number)
], RatingSummaryResponseDto.prototype, "totalRatings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4.5 }),
    __metadata("design:type", Number)
], RatingSummaryResponseDto.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: RatingDistributionDto }),
    __metadata("design:type", RatingDistributionDto)
], RatingSummaryResponseDto.prototype, "ratingDistribution", void 0);
class PaginationMetaDto {
    totalCount;
    totalPages;
    limit;
    page;
    nextPage;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, nullable: true }),
    __metadata("design:type", Object)
], PaginationMetaDto.prototype, "nextPage", void 0);
class PaginatedReviewsResponseDto {
    data;
    meta;
}
exports.PaginatedReviewsResponseDto = PaginatedReviewsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReviewResponseDto] }),
    __metadata("design:type", Array)
], PaginatedReviewsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedReviewsResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=review-response.dto.js.map