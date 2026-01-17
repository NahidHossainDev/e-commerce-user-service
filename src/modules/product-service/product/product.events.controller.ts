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
    const product = await this.productService.findOneAdmin(payload.productId);

    if (!product || product.status !== ProductStatus.ACTIVE) {
      return new ProductAvailabilityResult({
        productId: payload.productId,
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

    // Check specific variant if requested
    if (payload.variantSku) {
      const variant = product.variants.find(
        (v) => v.sku === payload.variantSku,
      );
      if (!variant) {
        return new ProductAvailabilityResult({
          productId: payload.productId,
          isAvailable: false,
          price: {
            basePrice: 0,
            discountPrice: 0,
            discountRate: 0,
            currency: DEFAULT_CURRENCY,
          },
          title: product.title,
          thumbnail: product.thumbnail,
          availableStock: 0,
          error: 'Variant not found',
        });
      }

      if (variant.stock < payload.quantity) {
        return new ProductAvailabilityResult({
          productId: payload.productId,
          isAvailable: false,
          price: {
            ...product.price,
            basePrice: variant.additionalPrice
              ? product.price.basePrice + variant.additionalPrice
              : product.price.basePrice,
          },
          title: product.title,
          thumbnail: product.thumbnail,
          availableStock: variant.stock,
          error: 'Not enough stock for variant',
          variantSku: payload.variantSku,
        });
      }

      return new ProductAvailabilityResult({
        productId: payload.productId,
        isAvailable: true,
        price: {
          ...product.price,
          basePrice: variant.additionalPrice
            ? product.price.basePrice + variant.additionalPrice
            : product.price.basePrice,
        },
        title: product.title,
        thumbnail: product.thumbnail,
        availableStock: variant.stock,
        variantSku: payload.variantSku,
      });
    }

    // Check main product stock
    if (product.stock < payload.quantity) {
      return new ProductAvailabilityResult({
        productId: payload.productId,
        isAvailable: false,
        price: product.price,
        title: product.title,
        thumbnail: product.thumbnail,
        availableStock: product.stock,
        error: 'Not enough stock',
      });
    }

    return new ProductAvailabilityResult({
      productId: payload.productId,
      isAvailable: true,
      price: product.price,
      title: product.title,
      thumbnail: product.thumbnail,
      availableStock: product.stock,
    });
  }
}
