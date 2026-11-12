export declare class WishlistItemResponseDto {
    _id: string;
    productId: string;
    variantSku?: string;
    notifyWhenAvailable: boolean;
    priceWhenAdded?: number;
    product: Record<string, any>;
    createdAt: string;
}
export declare class WishlistPaginatedResponseDto {
    items: WishlistItemResponseDto[];
    total: number;
}
