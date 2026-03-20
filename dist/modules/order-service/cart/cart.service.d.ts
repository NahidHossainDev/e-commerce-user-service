import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { AddToCartDto, CheckoutPreviewDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartDocument } from './schemas/cart.schema';
export declare class CartService {
    private cartModel;
    private readonly eventEmitter;
    constructor(cartModel: Model<CartDocument>, eventEmitter: EventEmitter2);
    getCart(userId: string): Promise<CartDocument>;
    addToCart(userId: string, payload: AddToCartDto): Promise<CartDocument>;
    updateItemQuantity(userId: string, productId: string, dto: UpdateCartItemDto): Promise<CartDocument>;
    removeItem(userId: string, productId: string, variantSku?: string): Promise<CartDocument>;
    checkoutPreview(userId: string, _dto: CheckoutPreviewDto): Promise<CartDocument>;
    clearCart(userId: string, session?: any): Promise<void>;
    private syncCartWithProductStock;
    private calculateTotals;
}
