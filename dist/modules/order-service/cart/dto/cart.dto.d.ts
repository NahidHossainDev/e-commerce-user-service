export declare class AddToCartDto {
    productId: string;
    quantity: number;
    variantSku?: string;
}
export declare class UpdateCartItemDto {
    quantity: number;
    variantSku?: string;
}
export declare class CheckoutPreviewDto {
    shippingAddressId?: string;
    paymentMethod?: string;
}
