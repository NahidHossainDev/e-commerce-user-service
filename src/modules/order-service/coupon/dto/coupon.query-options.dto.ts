import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { DiscountType } from '../schemas/coupon.schema';

export class CouponQueryOptions extends QueryOptions {
  @ApiPropertyOptional({ description: 'Filter by coupon code' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    enum: DiscountType,
    description: 'Filter by discount type',
  })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({ description: 'Filter by active/inactive' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort by usage count' })
  @IsOptional()
  @IsNumber()
  usageCount?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Filter by valid to date' })
  @IsOptional()
  @Type(() => Date)
  validTo?: Date;
}

export class CouponUsageQueryOptions extends QueryOptions {
  @ApiPropertyOptional({ description: 'Filter by coupon code' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Filter by coupon ID' })
  @IsOptional()
  @IsString()
  couponId?: string;

  @ApiPropertyOptional({ description: 'Sort by usage count' })
  @IsOptional()
  @IsNumber()
  usageCount?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Sort by discount amount' })
  @IsOptional()
  @IsNumber()
  discountAmount?: 'asc' | 'desc';
}
