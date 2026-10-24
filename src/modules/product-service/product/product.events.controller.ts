import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DEFAULT_CURRENCY } from '../../../common/constants';
import {
  ProductAvailabilityResult,
  ProductCheckAvailabilityEvent,
  ProductEvents,
} from '../../../common/events/product.events';
import { Price } from '../../../common/schemas';
import { ProductService } from './product.service';
import { Product, ProductStatus } from './schemas/product.schema';

@Controller()
export class ProductEventsController {
  constructor(private readonly productService: ProductService) {}

  @OnEvent(ProductEvents.CHECK_AVAILABILITY)
  async handleCheckAvailability(
    payload: ProductCheckAvailabilityEvent,
  ): Promise<ProductAvailabilityResult> {
    const { productId, quantity, variantSku } = payload;
    const product = await this.productService.findOneAdmin(productId);

    if (!product || product.status !== ProductStatus.ACTIVE) {
      return this.createUnavailableResult(productId, 'Product not found or inactive');
    }

    let price = { ...product.price };
    let availableStock = product.stock;

    if (variantSku) {
      const variant = product.variants?.find((v) => v.sku === variantSku);
      if (!variant) {
        return this.createUnavailableResult(productId, 'Variant not found', product, variantSku);
      }

      availableStock = variant.stock;
      price = this.resolveVariantPrice(price, variant.additionalPrice);
    }

    const hasStock = availableStock >= quantity;

    return new ProductAvailabilityResult({
      productId,
      isAvailable: hasStock,
      price,
      title: product.title,
      thumbnail: product.thumbnail,
      slug: product.slug,
      availableStock,
      variantSku,
      ...(hasStock
        ? {}
        : { error: variantSku ? 'Not enough stock for variant' : 'Not enough stock' }),
    });
  }

  private createUnavailableResult(
    productId: string,
    error: string,
    product?: Partial<Product>,
    variantSku?: string,
  ): ProductAvailabilityResult {
    return new ProductAvailabilityResult({
      productId,
      isAvailable: false,
      price: {
        basePrice: 0,
        discountPrice: 0,
        discountRate: 0,
        currency: DEFAULT_CURRENCY,
      },
      title: product?.title ?? '',
      thumbnail: product?.thumbnail ?? '',
      slug: product?.slug,
      availableStock: 0,
      error,
      variantSku,
    });
  }

  private resolveVariantPrice(price: Price, additionalPrice?: number): Price {
    if (!additionalPrice || additionalPrice <= 0) {
      return price;
    }

    const newBasePrice = price.basePrice + additionalPrice;
    let newDiscountPrice = price.discountPrice;

    if (price.discountRate && price.discountRate > 0) {
      newDiscountPrice = Math.round(newBasePrice * (1 - price.discountRate / 100) * 100) / 100;
    } else if (price.discountPrice && price.discountPrice > 0) {
      newDiscountPrice = price.discountPrice + additionalPrice;
    }

    return {
      ...price,
      basePrice: newBasePrice,
      discountPrice: newDiscountPrice,
    };
  }
}
