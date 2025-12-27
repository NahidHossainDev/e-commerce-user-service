import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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

  @ApiProperty()
  @Type(() => Date)
  validFrom: Date;

  @ApiProperty()
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
}

export class CouponValidationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  orderAmount?: number;
}
