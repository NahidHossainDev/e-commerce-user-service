import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReviewStatus } from '../schemas/review.schema';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    enum: ReviewStatus,
    description: 'Updated review status',
  })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({ description: 'Admin response message' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminResponse?: string;
}
