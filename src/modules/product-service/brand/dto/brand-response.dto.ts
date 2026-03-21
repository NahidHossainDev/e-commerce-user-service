import { ApiProperty } from '@nestjs/swagger';

export class SocialMediaDto {
  @ApiProperty({ example: 'https://facebook.com/brand', required: false })
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/brand', required: false })
  instagram?: string;

  @ApiProperty({ example: 'https://twitter.com/brand', required: false })
  twitter?: string;

  @ApiProperty({ example: 'https://youtube.com/brand', required: false })
  youtube?: string;
}

export class BrandMetaDto {
  @ApiProperty({ example: 'Brand Title' })
  title: string;

  @ApiProperty({ example: 'Brand Description' })
  description: string;

  @ApiProperty({ example: ['keyword1', 'keyword2'] })
  keywords: string[];
}

export class BrandResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: 'Apple' })
  name: string;

  @ApiProperty({ example: 'apple' })
  slug: string;

  @ApiProperty({ example: 'Think Different' })
  description: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  logo: string;

  @ApiProperty({ example: 'https://apple.com' })
  website: string;

  @ApiProperty({ example: 1976 })
  establishedYear: number;

  @ApiProperty({ example: 'USA' })
  country: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: SocialMediaDto })
  socialMedia: SocialMediaDto;

  @ApiProperty({ example: 1200 })
  productCount: number;

  @ApiProperty({ example: 4.8 })
  averageRating: number;

  @ApiProperty({ type: BrandMetaDto, required: false })
  meta?: BrandMetaDto;

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

export class PaginatedBrandsResponseDto {
  @ApiProperty({ type: [BrandResponseDto] })
  data: BrandResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
