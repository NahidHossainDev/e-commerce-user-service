import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProductAvailabilityResult,
  ProductCheckAvailabilityEvent,
  ProductEvents,
} from 'src/common/events/product.events';
import {
  AddToCartDto,
  CheckoutPreviewDto,
  UpdateCartItemDto,
} from './dto/cart.dto';
import { Cart, CartDocument, CartItem } from './schemas/cart.schema';

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

    // Real-time stock validation
    await this.syncCartWithProductStock(cart);

    return cart;
  }

  async addToCart(
    userId: string,
    payload: AddToCartDto,
  ): Promise<CartDocument> {
    // Emit Event to check Product Availability
    const [result] = (await this.eventEmitter.emitAsync(
      ProductEvents.CHECK_AVAILABILITY,
      new ProductCheckAvailabilityEvent({
        productId: payload.productId,
        quantity: payload.quantity,
        variantSku: payload.variantSku,
      }),
    )) as ProductAvailabilityResult[];

    if (!result) {
      throw new NotFoundException('Product service unavailable');
    }

    if (!result.isAvailable) {
      throw new BadRequestException(result.error || 'Product unavailable');
    }

    // Proceed with Cart Logic
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
        (!payload.variantSku || item.variantSku === payload.variantSku),
    );

    if (existingItem) {
      existingItem.quantity += payload.quantity;
      existingItem.availableStock = result.availableStock;
    } else {
      const item: CartItem = {
        productId: new Types.ObjectId(payload.productId),
        productName: result.title,
        productThumbnail: result.thumbnail,
        price: result.price,
        availableStock: result.availableStock,
        variantSku: payload.variantSku,
        quantity: payload.quantity,
        addedAt: new Date(),
        isOutOfStock: false,
        isSelected: true,
      };
      cart.items.push(item);
    }

    this.calculateTotals(cart);
    return cart.save();
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartDocument> {
    const cart = await this.getCart(userId);

    // Check product availability with new quantity
    const [result] = (await this.eventEmitter.emitAsync(
      ProductEvents.CHECK_AVAILABILITY,
      new ProductCheckAvailabilityEvent({
        productId,
        quantity: dto.quantity,
        variantSku: dto.variantSku,
      }),
    )) as ProductAvailabilityResult[];

    if (!result || !result.isAvailable) {
      throw new BadRequestException(
        result?.error || 'Insufficient stock for requested quantity',
      );
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        (!dto.variantSku || item.variantSku === dto.variantSku),
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.quantity = dto.quantity;
    item.isOutOfStock = false;

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
          (!variantSku || item.variantSku === variantSku)
        ),
    );
    this.calculateTotals(cart);
    return cart.save();
  }

  async checkoutPreview(
    userId: string,
    _dto: CheckoutPreviewDto,
  ): Promise<CartDocument> {
    const cart = await this.getCart(userId);

    // Check if any items are out of stock
    const outOfStockItems = cart.items.filter((item) => item.isOutOfStock);
    if (outOfStockItems.length > 0) {
      throw new BadRequestException(
        `Cannot proceed to checkout. The following items are out of stock: ${outOfStockItems.map((item) => item.productName).join(', ')}`,
      );
    }

    // Validate all items have sufficient stock
    for (const item of cart.items) {
      const [result] = (await this.eventEmitter.emitAsync(
        ProductEvents.CHECK_AVAILABILITY,
        new ProductCheckAvailabilityEvent({
          productId: item.productId.toString(),
          quantity: item.quantity,
          variantSku: item.variantSku,
        }),
      )) as ProductAvailabilityResult[];

      if (!result || !result.isAvailable) {
        throw new BadRequestException(
          `Item "${item.productName}" is no longer available with the requested quantity`,
        );
      }
    }

    // Recalculate totals to ensure accuracy
    this.calculateTotals(cart);

    return cart;
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
          },
        },
      )
      .session(session || null);
  }

  private async syncCartWithProductStock(cart: CartDocument): Promise<void> {
    for (const item of cart.items) {
      const [result] = (await this.eventEmitter.emitAsync(
        ProductEvents.CHECK_AVAILABILITY,
        new ProductCheckAvailabilityEvent({
          productId: item.productId.toString(),
          quantity: item.quantity,
          variantSku: item.variantSku,
        }),
      )) as ProductAvailabilityResult[];

      if (!result || !result.isAvailable) {
        item.isOutOfStock = true;
        item.availableStock = result.availableStock;
      } else {
        item.isOutOfStock = false;
        item.availableStock = result.availableStock;
        item.price = result.price;
      }
    }

    this.calculateTotals(cart);
    await cart.save();
  }

  private calculateTotals(cart: CartDocument): void {
    // Calculate subtotal from items
    cart.totalAmount = cart.items.reduce((acc, item) => {
      if (item.isOutOfStock || !item.isSelected) return acc; // Don't include out of stock or unselected items
      return acc + (item.price.basePrice || 0) * item.quantity;
    }, 0);

    let discountedTotal = cart.totalAmount;

    // Apply item-level discounts
    const itemDiscountedTotal = cart.items.reduce((acc, item) => {
      if (item.isOutOfStock || !item.isSelected) return acc;
      const unitPrice =
        item.price.discountPrice && item.price.discountPrice > 0
          ? item.price.discountPrice
          : item.price.basePrice;
      return acc + unitPrice * item.quantity;
    }, 0);

    const itemLevelDiscount = cart.totalAmount - itemDiscountedTotal;
    discountedTotal = itemDiscountedTotal;

    cart.totalDiscount = itemLevelDiscount;
    cart.payableAmount = Math.max(0, discountedTotal);
  }
}
