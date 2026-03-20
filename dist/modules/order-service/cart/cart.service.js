"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_events_1 = require("../../../common/events/product.events");
const cart_schema_1 = require("./schemas/cart.schema");
let CartService = class CartService {
    cartModel;
    eventEmitter;
    constructor(cartModel, eventEmitter) {
        this.cartModel = cartModel;
        this.eventEmitter = eventEmitter;
    }
    async getCart(userId) {
        const cart = await this.cartModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        await this.syncCartWithProductStock(cart);
        return cart;
    }
    async addToCart(userId, payload) {
        const [result] = (await this.eventEmitter.emitAsync(product_events_1.ProductEvents.CHECK_AVAILABILITY, new product_events_1.ProductCheckAvailabilityEvent({
            productId: payload.productId,
            quantity: payload.quantity,
            variantSku: payload.variantSku,
        })));
        if (!result) {
            throw new common_1.NotFoundException('Product service unavailable');
        }
        if (!result.isAvailable) {
            throw new common_1.BadRequestException(result.error || 'Product unavailable');
        }
        const existingCart = await this.cartModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        const cart = existingCart ||
            new this.cartModel({
                userId: new mongoose_2.Types.ObjectId(userId),
                items: [],
            });
        const existingItem = cart.items.find((item) => item.productId.toString() === payload.productId &&
            (!payload.variantSku || item.variantSku === payload.variantSku));
        if (existingItem) {
            existingItem.quantity += payload.quantity;
            existingItem.availableStock = result.availableStock;
        }
        else {
            const item = {
                productId: new mongoose_2.Types.ObjectId(payload.productId),
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
    async updateItemQuantity(userId, productId, dto) {
        const cart = await this.getCart(userId);
        const [result] = (await this.eventEmitter.emitAsync(product_events_1.ProductEvents.CHECK_AVAILABILITY, new product_events_1.ProductCheckAvailabilityEvent({
            productId,
            quantity: dto.quantity,
            variantSku: dto.variantSku,
        })));
        if (!result || !result.isAvailable) {
            throw new common_1.BadRequestException(result?.error || 'Insufficient stock for requested quantity');
        }
        const item = cart.items.find((item) => item.productId.toString() === productId &&
            (!dto.variantSku || item.variantSku === dto.variantSku));
        if (!item) {
            throw new common_1.NotFoundException('Item not found in cart');
        }
        item.quantity = dto.quantity;
        item.isOutOfStock = false;
        this.calculateTotals(cart);
        return cart.save();
    }
    async removeItem(userId, productId, variantSku) {
        const cart = await this.getCart(userId);
        cart.items = cart.items.filter((item) => !(item.productId.toString() === productId &&
            (!variantSku || item.variantSku === variantSku)));
        this.calculateTotals(cart);
        return cart.save();
    }
    async checkoutPreview(userId, _dto) {
        const cart = await this.getCart(userId);
        const outOfStockItems = cart.items.filter((item) => item.isOutOfStock);
        if (outOfStockItems.length > 0) {
            throw new common_1.BadRequestException(`Cannot proceed to checkout. The following items are out of stock: ${outOfStockItems.map((item) => item.productName).join(', ')}`);
        }
        for (const item of cart.items) {
            const [result] = (await this.eventEmitter.emitAsync(product_events_1.ProductEvents.CHECK_AVAILABILITY, new product_events_1.ProductCheckAvailabilityEvent({
                productId: item.productId.toString(),
                quantity: item.quantity,
                variantSku: item.variantSku,
            })));
            if (!result || !result.isAvailable) {
                throw new common_1.BadRequestException(`Item "${item.productName}" is no longer available with the requested quantity`);
            }
        }
        this.calculateTotals(cart);
        return cart;
    }
    async clearCart(userId, session) {
        await this.cartModel
            .updateOne({ userId: new mongoose_2.Types.ObjectId(userId) }, {
            $set: {
                items: [],
                totalAmount: 0,
                totalDiscount: 0,
                payableAmount: 0,
            },
        })
            .session(session || null);
    }
    async syncCartWithProductStock(cart) {
        for (const item of cart.items) {
            const [result] = (await this.eventEmitter.emitAsync(product_events_1.ProductEvents.CHECK_AVAILABILITY, new product_events_1.ProductCheckAvailabilityEvent({
                productId: item.productId.toString(),
                quantity: item.quantity,
                variantSku: item.variantSku,
            })));
            if (!result || !result.isAvailable) {
                item.isOutOfStock = true;
                item.availableStock = result.availableStock;
            }
            else {
                item.isOutOfStock = false;
                item.availableStock = result.availableStock;
                item.price = result.price;
            }
        }
        this.calculateTotals(cart);
        await cart.save();
    }
    calculateTotals(cart) {
        cart.totalAmount = cart.items.reduce((acc, item) => {
            if (item.isOutOfStock || !item.isSelected)
                return acc;
            return acc + (item.price.basePrice || 0) * item.quantity;
        }, 0);
        let discountedTotal = cart.totalAmount;
        const itemDiscountedTotal = cart.items.reduce((acc, item) => {
            if (item.isOutOfStock || !item.isSelected)
                return acc;
            const unitPrice = item.price.discountPrice && item.price.discountPrice > 0
                ? item.price.discountPrice
                : item.price.basePrice;
            return acc + unitPrice * item.quantity;
        }, 0);
        const itemLevelDiscount = cart.totalAmount - itemDiscountedTotal;
        discountedTotal = itemDiscountedTotal;
        cart.totalDiscount = itemLevelDiscount;
        cart.payableAmount = Math.max(0, discountedTotal);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], CartService);
//# sourceMappingURL=cart.service.js.map