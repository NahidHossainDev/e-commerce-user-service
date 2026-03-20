import { Price } from '../schemas';
export interface IProductCheckAvailabilityEvent {
    productId: string;
    quantity?: number;
    variantSku?: string;
}
export declare class ProductCheckAvailabilityEvent {
    readonly productId: string;
    readonly quantity: number;
    readonly variantSku?: string;
    constructor(params: IProductCheckAvailabilityEvent);
}
export interface IProductAvailabilityResult {
    productId: string;
    isAvailable: boolean;
    price: Price;
    title: string;
    thumbnail: string;
    availableStock: number;
    error?: string;
    variantSku?: string;
}
export declare class ProductAvailabilityResult {
    readonly productId: string;
    readonly isAvailable: boolean;
    readonly price: Price;
    readonly title: string;
    readonly thumbnail: string;
    readonly availableStock: number;
    readonly error?: string;
    readonly variantSku?: string;
    constructor(params: IProductAvailabilityResult);
}
export declare const ProductEvents: {
    CHECK_AVAILABILITY: string;
};
