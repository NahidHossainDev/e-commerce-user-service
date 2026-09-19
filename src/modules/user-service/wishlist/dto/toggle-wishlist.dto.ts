import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ToggleWishlistDto {
  @ApiProperty({ description: "Target Product ObjectId", example: "65b9a12c8e4f0012a8849c01" })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: "Optional variant SKU" })
  @IsString()
  @IsOptional()
  variantSku?: string;
}
