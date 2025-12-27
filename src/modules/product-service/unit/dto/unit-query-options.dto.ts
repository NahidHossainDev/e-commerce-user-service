import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { UnitCategory } from '../schemas/unit.schema';

export class UnitQueryOptions extends QueryOptions {
  @ApiPropertyOptional({ description: 'Filter by unit name or symbol' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    enum: UnitCategory,
    description: 'Filter by category',
  })
  @IsOptional()
  @IsEnum(UnitCategory)
  category?: UnitCategory;
}
