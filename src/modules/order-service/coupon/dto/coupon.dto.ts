import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from '../schemas/coupon.schema';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: [true, false] })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({ default: false, description: 'Whether coupon is publicly visible/applicable to guest users' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Whether coupon is applicable only on user first order' })
  @IsBoolean()
  @IsOptional()
  isFirstOrderOnly?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'List of specific eligible user IDs' })
  @IsArray()
  @IsOptional()
  eligibleUserIds?: string[];

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxDiscountAmount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minOrderAmount?: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  validFrom: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  validTo: Date;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  usageLimit?: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  usageLimitPerUser?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  rules?: Record<string, any>;
}

export class CouponValidationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  couponId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  orderAmount?: number;
}

export class GetAvailableCouponsQueryDto {
  @ApiPropertyOptional({
    description: 'Current cart / order subtotal amount to check coupon eligibility and min order requirements',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderAmount?: number;
}

