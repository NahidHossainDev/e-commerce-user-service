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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../../common/decorators");
const optional_jwt_auth_guard_1 = require("../../../../common/guards/optional-jwt-auth.guard");
const cart_service_1 = require("../cart.service");
const cart_dto_1 = require("../dto/cart.dto");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(user) {
        return this.cartService.getCart(user.id);
    }
    addToCart(user, dto) {
        return this.cartService.addToCart(user.id, dto);
    }
    updateItem(user, itemId, dto) {
        return this.cartService.updateItemQuantity(user.id, itemId, dto);
    }
    removeItem(user, itemId, variantSku) {
        return this.cartService.removeItem(user.id, itemId, variantSku);
    }
    checkoutPreview(user, dto) {
        return this.cartService.checkoutPreview(user.id, dto);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user cart' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Patch)('update/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, cart_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('remove/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('variantSku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)('checkout-preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview checkout with final calculations' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, cart_dto_1.CheckoutPreviewDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "checkoutPreview", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map