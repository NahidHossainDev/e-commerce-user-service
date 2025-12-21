import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { ReviewStatus } from '../schemas/review.schema';

export class ReviewQueryOptionsDto extends QueryOptions {
  @ApiPropertyOptional({ description: 'Search by title or comment' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Filter by product ID' })
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsMongoId()
  user?: string;

  @ApiPropertyOptional({ description: 'Filter by rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ enum: ReviewStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({ description: 'Filter by verified purchase' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isVerifiedPurchase?: boolean;
}
