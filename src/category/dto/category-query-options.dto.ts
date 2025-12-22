import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';

export class CategoryQueryOptionsDto extends QueryOptions {
  @ApiPropertyOptional({ description: 'Search by name or description' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ description: 'Filter by parent category' })
  @IsOptional()
  @IsMongoId()
  parentCategory?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by category level' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  level?: number;
}
