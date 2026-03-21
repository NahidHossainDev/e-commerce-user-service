import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '../schemas/review.schema';

export class AdminResponseDto {
  @ApiProperty({ example: 'Thank you for your review!' })
  message: string;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  respondedBy: any;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  respondedAt: Date;
}

export class ReviewResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d012' })
  productId: any;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d034' })
  user: any;

  @ApiProperty({ example: 'Great product, highly recommend!' })
  comment: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({ enum: ReviewStatus, example: ReviewStatus.APPROVED })
  status: string;

  @ApiProperty({ example: true })
  isVerifiedPurchase: boolean;

  @ApiProperty({ example: 10 })
  helpfulVotes: number;

  @ApiProperty({ example: 2 })
  unhelpfulVotes: number;

  @ApiProperty({ type: AdminResponseDto, required: false })
  adminResponse?: AdminResponseDto;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class RatingDistributionDto {
  @ApiProperty({ example: 50 })
  five: number;

  @ApiProperty({ example: 30 })
  four: number;

  @ApiProperty({ example: 10 })
  three: number;

  @ApiProperty({ example: 5 })
  two: number;

  @ApiProperty({ example: 5 })
  one: number;
}

export class RatingSummaryResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d012' })
  productId: any;

  @ApiProperty({ example: 100 })
  totalReviews: number;

  @ApiProperty({ example: 450 })
  totalRatings: number;

  @ApiProperty({ example: 4.5 })
  averageRating: number;

  @ApiProperty({ type: RatingDistributionDto })
  ratingDistribution: RatingDistributionDto;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage: number | null;
}

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  data: ReviewResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
