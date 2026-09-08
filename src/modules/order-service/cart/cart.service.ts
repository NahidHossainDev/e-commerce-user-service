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
  MergeCartItemDto,
  UpdateCartItemDto,
} from './dto/cart.dto';
import { Cart, CartDocument, CartItem } from './schemas/cart.schema';

export interface FormattedCartItem {
  id: string;
  productId: string;
  title: string;
  thumbnail: string;
  slug: string;
  variantSku?: string;
  price: number;
  discountPrice: number;
  quantity: number;
  stock: number;
  isOutOfStock: boolean;
  isInsufficientStock: boolean;
  selected: boolean;
  updatedAt: number;
}

export interface FormattedCartSummary {
  totalAmount: number;
  totalDiscount: number;
  payableAmount: number;
  totalItems: number;
}

export interface FormattedCartResponse {
  _id: string;
  userId: string;
  items: FormattedCartItem[];
  cartSummary: FormattedCartSummary;
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getCart(userId: string): Promise<FormattedCartResponse> {
    let cart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!cart) {
      cart = new this.cartModel({
        userId: new Types.ObjectId(userId),
        items: [],
      });
      await cart.save();
    } else {
      // Real-time stock validation
      await this.syncCartWithProductStock(cart);
    }

    return this.formatCartResponse(cart);
  }

  async addToCart(
    userId: string,
    payload: AddToCartDto,
  ): Promise<FormattedCartResponse> {
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
      existingItem.updatedAt = new Date();
    } else {
      const item: CartItem = {
        productId: new Types.ObjectId(payload.productId),
        productName: result.title,
        productThumbnail: result.thumbnail,
        slug: result.slug || '',
        price: result.price,
        availableStock: result.availableStock,
        variantSku: payload.variantSku,
        quantity: payload.quantity,
        addedAt: new Date(),
        updatedAt: new Date(),
        isOutOfStock: false,
        isSelected: true,
      };
      cart.items.push(item);
    }

    this.calculateTotals(cart);
    await cart.save();
    return this.formatCartResponse(cart);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<FormattedCartResponse> {
    const cart = await this.getCartDocument(userId);

    let targetProductId = itemId;
    let targetVariantSku = dto.variantSku;
    if (itemId && itemId.includes('::')) {
      const parts = itemId.split('::');
      targetProductId = parts[0];
      targetVariantSku = targetVariantSku || parts[1];
    }

    // Check product availability with new quantity
    const [result] = (await this.eventEmitter.emitAsync(
      ProductEvents.CHECK_AVAILABILITY,
      new ProductCheckAvailabilityEvent({
        productId: targetProductId,
        quantity: dto.quantity,
        variantSku: targetVariantSku,
      }),
    )) as ProductAvailabilityResult[];

    if (!result || !result.isAvailable) {
      throw new BadRequestException(
        result?.error || 'Insufficient stock for requested quantity',
      );
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === targetProductId &&
        (!targetVariantSku || item.variantSku === targetVariantSku),
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.quantity = dto.quantity;
    item.availableStock = result.availableStock;
    item.isOutOfStock = false;
    item.updatedAt = new Date();

    this.calculateTotals(cart);
    await cart.save();
    return this.formatCartResponse(cart);
  }

  async removeItem(
    userId: string,
    itemId: string,
    variantSku?: string,
  ): Promise<FormattedCartResponse> {
    const cart = await this.getCartDocument(userId);

    let targetProductId = itemId;
    let targetVariantSku = variantSku;
    if (itemId && itemId.includes('::')) {
      const parts = itemId.split('::');
      targetProductId = parts[0];
      targetVariantSku = targetVariantSku || parts[1];
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === targetProductId &&
          (!targetVariantSku || item.variantSku === targetVariantSku)
        ),
    );
    this.calculateTotals(cart);
    await cart.save();
    return this.formatCartResponse(cart);
  }

  async checkoutPreview(
    userId: string,
    _dto: CheckoutPreviewDto,
  ): Promise<FormattedCartResponse> {
    const cart = await this.getCartDocument(userId);

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
    await cart.save();

    return this.formatCartResponse(cart);
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

  async mergeCart(
    userId: string,
    guestItems: MergeCartItemDto[],
  ): Promise<FormattedCartResponse> {
    const userObjectId = new Types.ObjectId(userId);
    let cart = await this.cartModel.findOne({ userId: userObjectId });

    if (!cart) {
      cart = new this.cartModel({ userId: userObjectId, items: [] });
    }

    if (guestItems && guestItems.length > 0) {
      // Map existing server items by composite key `${productId}::${variantSku || ''}`
      const itemMap = new Map<string, CartItem>();
      for (const sItem of cart.items) {
        const key = `${sItem.productId.toString()}::${sItem.variantSku || ''}`;
        itemMap.set(key, sItem);
      }

      for (const gItem of guestItems) {
        const key = `${gItem.productId}::${gItem.variantSku || ''}`;
        const existing = itemMap.get(key);

        if (existing) {
          const guestTime = gItem.updatedAt
            ? new Date(gItem.updatedAt).getTime()
            : Date.now();
          const serverTime = existing.updatedAt
            ? new Date(existing.updatedAt).getTime()
            : 0;

          if (guestTime >= serverTime) {
            existing.quantity = gItem.quantity;
            existing.updatedAt = new Date(guestTime);
          }
        } else {
          // Fetch product snapshot & availability
          const [result] = (await this.eventEmitter.emitAsync(
            ProductEvents.CHECK_AVAILABILITY,
            new ProductCheckAvailabilityEvent({
              productId: gItem.productId,
              quantity: gItem.quantity,
              variantSku: gItem.variantSku,
            }),
          )) as ProductAvailabilityResult[];

          if (result) {
            const stock = result.availableStock ?? 0;
            const newItem: CartItem = {
              productId: new Types.ObjectId(gItem.productId),
              productName: result.title || 'Product',
              productThumbnail: result.thumbnail || '',
              slug: result.slug || '',
              price: result.price,
              availableStock: stock,
              variantSku: gItem.variantSku,
              quantity: gItem.quantity,
              addedAt: gItem.updatedAt ? new Date(gItem.updatedAt) : new Date(),
              updatedAt: gItem.updatedAt
                ? new Date(gItem.updatedAt)
                : new Date(),
              isOutOfStock: stock <= 0,
              isSelected: true,
            };
            cart.items.push(newItem);
            itemMap.set(key, newItem);
          }
        }
      }
    }

    // Real-time stock validation, pricing sync, totals calculation, and save
    await this.syncCartWithProductStock(cart);

    return this.formatCartResponse(cart);
  }

  async getCartDocument(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({
      userId: new Types.ObjectId(userId),
    });
    if (!cart) throw new NotFoundException('Cart not found');
    await this.syncCartWithProductStock(cart);
    return cart;
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

      const stock = result?.availableStock ?? 0;
      item.isOutOfStock = stock <= 0;
      item.availableStock = stock;

      if (result) {
        item.price = result.price || item.price;
        item.slug = result.slug || item.slug;
        item.productName = result.title || item.productName;
        item.productThumbnail = result.thumbnail || item.productThumbnail;
      }
    }

    this.calculateTotals(cart);
    await cart.save();
  }

  private calculateTotals(cart: CartDocument): void {
    // Calculate subtotal from items
    cart.totalAmount = cart.items.reduce((acc, item) => {
      if (item.isOutOfStock || !item.isSelected) return acc;
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

  private formatCartResponse(cart: CartDocument): FormattedCartResponse {
    const items: FormattedCartItem[] = (cart.items || []).map((item) => {
      const pId = item.productId ? item.productId.toString() : '';
      const compositeId = item.variantSku ? `${pId}::${item.variantSku}` : pId;
      const basePrice = item.price?.basePrice ?? 0;
      const discountPrice =
        item.price?.discountPrice && item.price.discountPrice > 0
          ? item.price.discountPrice
          : 0;

      const updatedAtTime = item.updatedAt
        ? new Date(item.updatedAt).getTime()
        : item.addedAt
          ? new Date(item.addedAt).getTime()
          : Date.now();

      const stock = item.availableStock ?? 0;
      const isOutOfStock = Boolean(item.isOutOfStock) || stock <= 0;
      const isInsufficientStock = !isOutOfStock && item.quantity > stock;

      return {
        id: compositeId,
        productId: pId,
        title: item.productName || '',
        thumbnail: item.productThumbnail || '',
        slug: item.slug || '',
        variantSku: item.variantSku || undefined,
        price: basePrice,
        discountPrice: discountPrice,
        quantity: item.quantity,
        stock,
        isOutOfStock,
        isInsufficientStock,
        selected: item.isSelected !== undefined ? item.isSelected : true,
        updatedAt: updatedAtTime,
      };
    });

    const totalItems = (cart.items || []).reduce(
      (sum, item) => sum + (item.quantity || 0),
      0,
    );

    return {
      _id: String(cart._id),
      userId: cart.userId ? cart.userId.toString() : '',
      items,
      cartSummary: {
        totalAmount: cart.totalAmount ?? 0,
        totalDiscount: cart.totalDiscount ?? 0,
        payableAmount: cart.payableAmount ?? 0,
        totalItems,
      },
    };
  }
}
