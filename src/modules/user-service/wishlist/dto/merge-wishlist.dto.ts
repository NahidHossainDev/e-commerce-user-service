import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsMongoId } from "class-validator";

export class MergeWishlistDto {
  @ApiProperty({ description: "Array of Product IDs from guest local storage", type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  productIds: string[];
}
