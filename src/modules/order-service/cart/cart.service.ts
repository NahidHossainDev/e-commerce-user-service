import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProductAvailabilityResult,
  ProductCheckAvailabilityEvent,
  ProductEvents,
} from 'src/common/events/product.events';
import { AddToCartDto } from './dto/cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addToCart(
    userId: string,
    payload: AddToCartDto,
  ): Promise<CartDocument> {
    // 1. Emit Event to check Product Availability (Request-Reply pattern)
    const [result] = (await this.eventEmitter.emitAsync(
      ProductEvents.CHECK_AVAILABILITY,
      new ProductCheckAvailabilityEvent(
        payload.productId,
        payload.quantity,
        payload.variantSku,
      ),
    )) as ProductAvailabilityResult[];

    if (!result) {
      throw new NotFoundException('Product service unavailable');
    }

    if (!result.isAvailable) {
      throw new NotFoundException(result.error || 'Product unavailable');
    }

    // 2. Proceed with Cart Logic
    const existingCart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    const cart =
      existingCart ||
      new this.cartModel({
        userId: new Types.ObjectId(userId),
        items: [],
      });

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === payload.productId &&
        payload.variantSku &&
        item.variantSku === payload.variantSku,
    );

    if (existingItem) {
      existingItem.quantity += payload.quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(payload.productId),
        productName: result.title,
        productThumbnail: result.thumbnail,
        variantSku: payload.variantSku,
        quantity: payload.quantity,
        price: {
          // Construct Price object based on result price
          basePrice: result.price,
          currency: 'BDT', // Defaulting to BDT or need to fetch from event result if supported
        },
        addedAt: new Date(),
      } as any);
    }

    this.calculateTotals(cart);
    return cart.save();
  }

  async removeItem(
    userId: string,
    productId: string,
    variantSku?: string,
  ): Promise<CartDocument> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.variantSku === variantSku
        ),
    );
    this.calculateTotals(cart);
    return cart.save();
  }

  async clearCart(userId: string, session?: any): Promise<void> {
    await this.cartModel
      .updateOne(
        { userId: new Types.ObjectId(userId) },
        {
          $set: {
            items: [],
            totalAmount: 0,
            totalDiscount: 0,
            payableAmount: 0,
            appliedCouponId: null,
          },
        },
      )
      .session(session);
  }

  private calculateTotals(cart: CartDocument) {
    cart.totalAmount = cart.items.reduce((acc, item) => {
      // Assuming basePrice is what we have.
      // Note: Full price object structure might be lost in translation without richer event data.
      // For now using basePrice.
      return acc + (item.price.basePrice || 0) * item.quantity;
    }, 0);

    // Simplified discount logic for now as event doesn't return discount info
    const discountedTotal = cart.totalAmount;

    // Recalculate if items have discountPrice
    const realDiscountedTotal = cart.items.reduce((acc, item) => {
      const unitPrice =
        item.price.discountPrice > 0
          ? item.price.discountPrice
          : item.price.basePrice;
      return acc + unitPrice * item.quantity;
    }, 0);

    cart.totalDiscount = cart.totalAmount - realDiscountedTotal;
    cart.payableAmount = realDiscountedTotal;
  }
}
