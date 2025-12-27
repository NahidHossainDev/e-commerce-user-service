import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID of the product being reviewed' })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Review title', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Review comment', maxLength: 1000 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  comment: string;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
