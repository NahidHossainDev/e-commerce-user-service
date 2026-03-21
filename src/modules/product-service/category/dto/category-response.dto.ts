import { ApiProperty } from '@nestjs/swagger';

export class CategoryMetaDto {
  @ApiProperty({ example: 'Electronics Category' })
  title: string;

  @ApiProperty({ example: 'Browse the latest electronics and gadgets.' })
  description: string;
}

export class CategoryResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'electronics' })
  slug: string;

  @ApiProperty({ example: 'Electronic gadgets and devices' })
  description: string;

  @ApiProperty({ example: 'http://example.com/category-image.jpg' })
  image: string;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e2', nullable: true })
  parentCategory: any;

  @ApiProperty({ example: 0, minimum: 0, maximum: 3 })
  level: number;

  @ApiProperty({ example: ',64b1f2c3d4e5f6a7b8c9d0e2,' })
  path: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 150 })
  productCount: number;

  @ApiProperty({ example: 0 })
  sortOrder: number;

  @ApiProperty({ type: CategoryMetaDto, required: false })
  meta?: CategoryMetaDto;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
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

export class PaginatedCategoriesResponseDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  data: CategoryResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class CategoryTreeResponseDto extends CategoryResponseDto {
  @ApiProperty({ type: [CategoryTreeResponseDto], required: false })
  children?: CategoryTreeResponseDto[];
}
