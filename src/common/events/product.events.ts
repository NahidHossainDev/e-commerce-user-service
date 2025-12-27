import { Price } from '../schemas';

export class ProductCheckAvailabilityEvent {
  constructor(
    public readonly productId: string,
    public readonly quantity: number = 1,
    public readonly variantSku?: string,
  ) {}
}

export class ProductAvailabilityResult {
  constructor(
    public readonly productId: string,
    public readonly isAvailable: boolean,
    public readonly price: Price,
    public readonly title: string,
    public readonly thumbnail: string,
    public readonly error?: string,
    public readonly variantSku?: string,
  ) {}
}

export const ProductEvents = {
  CHECK_AVAILABILITY: 'product.check-stock',
};
