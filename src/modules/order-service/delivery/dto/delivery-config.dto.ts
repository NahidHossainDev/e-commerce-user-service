import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { FreeDeliveryPolicy } from '../schemas/delivery-config.schema';

export class CreateDeliveryZoneDto {
  @ApiProperty({ example: 'Inside Dhaka' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'INSIDE_DHAKA' })
  @IsString()
  code: string;

  @ApiProperty({ example: 70 })
  @IsNumber()
  @Min(0)
  deliveryFee: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: ['Dhaka', 'Gazipur', 'Savar', 'Narayanganj'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  matchedCities?: string[];

  @ApiProperty({ enum: FreeDeliveryPolicy, default: FreeDeliveryPolicy.NONE })
  @IsEnum(FreeDeliveryPolicy)
  freeDeliveryPolicy: FreeDeliveryPolicy;

  @ApiPropertyOptional({ example: 800 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderForFreeDelivery?: number | null;

  @ApiPropertyOptional({ example: '1-2 Days' })
  @IsString()
  @IsOptional()
  estimatedDays?: string;
}

export class UpdateDeliveryZoneDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  deliveryFee?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  matchedCities?: string[];

  @ApiPropertyOptional({ enum: FreeDeliveryPolicy })
  @IsEnum(FreeDeliveryPolicy)
  @IsOptional()
  freeDeliveryPolicy?: FreeDeliveryPolicy;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderForFreeDelivery?: number | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estimatedDays?: string;
}

export class UpdateGlobalDeliveryConfigDto {
  @ApiPropertyOptional({ example: 60 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  defaultFee?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  enableGlobalFreeDelivery?: boolean;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  globalFreeDeliveryMinOrder?: number | null;
}

export class CalculateDeliveryFeeDto {
  @ApiProperty({ example: 650 })
  @IsNumber()
  @Min(0)
  subTotal: number;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'COUPON_FREE' })
  @IsString()
  @IsOptional()
  couponCode?: string;
}
