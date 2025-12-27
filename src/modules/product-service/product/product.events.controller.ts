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
    const product = await this.productService.findOne(payload.productId);

    if (!product || product.status !== ProductStatus.ACTIVE) {
      return new ProductAvailabilityResult(
        payload.productId,
        false,
        {
          basePrice: 0,
          discountPrice: 0,
          discountRate: 0,
          currency: DEFAULT_CURRENCY,
        },
        '',
        '',
        'Product not found or inactive',
      );
    }

    // Check specific variant if requested
    if (payload.variantSku) {
      const variant = product.variants.find(
        (v) => v.sku === payload.variantSku,
      );
      if (!variant) {
        return new ProductAvailabilityResult(
          payload.productId,
          false,
          {
            basePrice: 0,
            discountPrice: 0,
            discountRate: 0,
            currency: DEFAULT_CURRENCY,
          },
          product.title,
          product.thumbnail,
          'Variant not found',
        );
      }

      if (variant.stock < payload.quantity) {
        return new ProductAvailabilityResult(
          payload.productId,
          false,
          {
            ...product.price,
            basePrice: variant.additionalPrice
              ? product.price.basePrice + variant.additionalPrice
              : product.price.basePrice,
          },
          product.title,
          product.thumbnail,
          'Not enough stock for variant',
          payload.variantSku,
        );
      }

      return new ProductAvailabilityResult(
        payload.productId,
        true,
        {
          ...product.price,
          basePrice: variant.additionalPrice
            ? product.price.basePrice + variant.additionalPrice
            : product.price.basePrice,
        },
        product.title,
        product.thumbnail,
        undefined,
        payload.variantSku,
      );
    }

    // Check main product stock
    if (product.stock < payload.quantity) {
      return new ProductAvailabilityResult(
        payload.productId,
        false,
        product.price,
        product.title,
        product.thumbnail,
        'Not enough stock',
      );
    }

    return new ProductAvailabilityResult(
      payload.productId,
      true,
      product.price,
      product.title,
      product.thumbnail,
    );
  }
}
