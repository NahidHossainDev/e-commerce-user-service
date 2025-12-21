import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested,
} from 'class-validator';

class SocialMediaDto {
  @ApiPropertyOptional({ example: 'https://facebook.com/brand' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/brand' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/brand' })
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/brand' })
  @IsOptional()
  @IsUrl()
  youtube?: string;
}

class BrandMetaDto {
  @ApiProperty({ example: 'Brand Name - Best Products' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Description for SEO' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['brand', 'products'], type: [String] })
  @IsString({ each: true })
  keywords: string[];
}

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Leading sports brand' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://nike.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: 1964 })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  establishedYear?: number;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ type: SocialMediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;

  @ApiPropertyOptional({ type: BrandMetaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BrandMetaDto)
  meta?: BrandMetaDto;
}
