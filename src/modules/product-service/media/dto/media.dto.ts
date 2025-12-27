import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class ImageAssetDto {
  @ApiProperty({ description: 'URL of the image' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'URL of the mobile-optimized image',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  mobileUrl?: string;

  @ApiProperty({ description: 'Alt text for the image', required: false })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiProperty({ description: 'Ordering of the image', default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateMediaDto {
  @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'URL of the primary image' })
  @IsUrl()
  @IsNotEmpty()
  primaryImage: string;

  @ApiProperty({ type: [ImageAssetDto], description: 'Additional images' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageAssetDto)
  @IsOptional()
  images?: ImageAssetDto[];

  @ApiProperty({ description: 'URL of the product video', required: false })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
