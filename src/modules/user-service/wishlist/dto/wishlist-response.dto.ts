import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class WishlistItemResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional()
  variantSku?: string;

  @ApiProperty()
  notifyWhenAvailable: boolean;

  @ApiPropertyOptional()
  priceWhenAdded?: number;

  @ApiProperty({ description: "Populated Product Object" })
  product: Record<string, any>;

  @ApiProperty()
  createdAt: string;
}

export class WishlistPaginatedResponseDto {
  @ApiProperty({ type: [WishlistItemResponseDto] })
  items: WishlistItemResponseDto[];

  @ApiProperty()
  total: number;
}
