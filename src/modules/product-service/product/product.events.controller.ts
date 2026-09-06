import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DEFAULT_CURRENCY } from '../../../common/constants';
import {
  ProductAvailabilityResult,
  ProductCheckAvailabilityEvent,
  ProductEvents,
} from '../../../common/events/product.events';
import { ProductService } from './product.service';
import { ProductStatus } from './schemas/product.schema';

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
      return new ProductAvailabilityResult({
        productId,
        isAvailable: false,
        price: {
          basePrice: 0,
          discountPrice: 0,
          discountRate: 0,
          currency: DEFAULT_CURRENCY,
        },
        title: '',
        thumbnail: '',
        availableStock: 0,
        error: 'Product not found or inactive',
      });
    }

    let price = { ...product.price };
    let availableStock = product.stock;

    if (variantSku) {
      const variant = product.variants?.find((v) => v.sku === variantSku);
      if (!variant) {
        return new ProductAvailabilityResult({
          productId,
          isAvailable: false,
          price: {
            basePrice: 0,
            discountPrice: 0,
            discountRate: 0,
            currency: DEFAULT_CURRENCY,
          },
          title: product.title,
          thumbnail: product.thumbnail,
          slug: product.slug,
          availableStock: 0,
          error: 'Variant not found',
          variantSku,
        });
      }

      availableStock = variant.stock;
      if (variant.additionalPrice) {
        price = {
          ...price,
          basePrice: price.basePrice + variant.additionalPrice,
        };
      }
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
}
