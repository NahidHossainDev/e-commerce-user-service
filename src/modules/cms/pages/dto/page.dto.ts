import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { CmsPageStatus, CmsPageType } from '../enums/page.enum';

export class CmsPageSeoDto {
  @ApiPropertyOptional({ description: 'HTML head meta title override' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'HTML head description content' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'Keywords for search engine tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class CreateCmsPageDto {
  @ApiProperty({ description: 'Visual title of the page' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Unique url pathname slug. If empty, is automatically generated from title.',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ enum: CmsPageType, description: 'Page lock status type', default: CmsPageType.CUSTOM })
  @IsOptional()
  @IsEnum(CmsPageType)
  type?: CmsPageType = CmsPageType.CUSTOM;

  @ApiPropertyOptional({ enum: CmsPageStatus, description: 'Page publishing status', default: CmsPageStatus.DRAFT })
  @IsOptional()
  @IsEnum(CmsPageStatus)
  status?: CmsPageStatus = CmsPageStatus.DRAFT;

  @ApiPropertyOptional({ description: 'Set as the main home landing page', default: false })
  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean = false;

  @ApiPropertyOptional({ type: CmsPageSeoDto, description: 'SEO properties mapping' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CmsPageSeoDto)
  seo?: CmsPageSeoDto;
}

export class UpdateCmsPageDto extends PartialType(CreateCmsPageDto) {}

export class QueryCmsPageDto extends QueryOptions {
  @ApiPropertyOptional({ enum: CmsPageStatus, description: 'Filter pages by status' })
  @IsOptional()
  @IsEnum(CmsPageStatus)
  status?: CmsPageStatus;

  @ApiPropertyOptional({ enum: CmsPageType, description: 'Filter pages by lock type' })
  @IsOptional()
  @IsEnum(CmsPageType)
  type?: CmsPageType;

  @ApiPropertyOptional({ description: 'Fuzzy search by page title or slug' })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
