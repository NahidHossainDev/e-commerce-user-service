import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AddToCartDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variantSku?: string;
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variantSku?: string;
}

export class CheckoutPreviewDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shippingAddressId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class MergeCartItemDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  variantSku?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  updatedAt?: number;
}

export class MergeCartRequestDto {
  @ApiProperty({ type: [MergeCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MergeCartItemDto)
  items: MergeCartItemDto[];
}
