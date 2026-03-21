import { ApiProperty } from '@nestjs/swagger';
import { UnitCategory } from '../schemas/unit.schema';

export class UnitResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: 'Kilogram' })
  name: string;

  @ApiProperty({ example: 'kg' })
  symbol: string;

  @ApiProperty({ enum: UnitCategory, example: UnitCategory.WEIGHT })
  category: UnitCategory;

  @ApiProperty({ example: true })
  allowsDecimal: boolean;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage: number | null;
}

export class PaginatedUnitsResponseDto {
  @ApiProperty({ type: [UnitResponseDto] })
  data: UnitResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
