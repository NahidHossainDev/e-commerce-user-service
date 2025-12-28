import { Price } from '../schemas';

export interface IProductCheckAvailabilityEvent {
  productId: string;
  quantity?: number;
  variantSku?: string;
}

export class ProductCheckAvailabilityEvent {
  public readonly productId: string;
  public readonly quantity: number;
  public readonly variantSku?: string;

  constructor(params: IProductCheckAvailabilityEvent) {
    this.productId = params.productId;
    this.quantity = params.quantity ?? 1;
    this.variantSku = params.variantSku;
  }
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

export class ProductAvailabilityResult {
  public readonly productId: string;
  public readonly isAvailable: boolean;
  public readonly price: Price;
  public readonly title: string;
  public readonly thumbnail: string;
  public readonly availableStock: number;
  public readonly error?: string;
  public readonly variantSku?: string;

  constructor(params: IProductAvailabilityResult) {
    this.productId = params.productId;
    this.isAvailable = params.isAvailable;
    this.price = params.price;
    this.title = params.title;
    this.thumbnail = params.thumbnail;
    this.availableStock = params.availableStock;
    this.error = params.error;
    this.variantSku = params.variantSku;
  }
}

export const ProductEvents = {
  CHECK_AVAILABILITY: 'product.check-stock',
};
