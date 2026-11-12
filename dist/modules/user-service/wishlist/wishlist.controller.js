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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../common/decorators");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const toggle_wishlist_dto_1 = require("./dto/toggle-wishlist.dto");
const update_notify_dto_1 = require("./dto/update-notify.dto");
const merge_wishlist_dto_1 = require("./dto/merge-wishlist.dto");
const wishlist_response_dto_1 = require("./dto/wishlist-response.dto");
const wishlist_service_1 = require("./wishlist.service");
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    async getWishlist(user, page, limit) {
        return this.wishlistService.getWishlist(user.id, Number(page) || 1, Number(limit) || 20);
    }
    async getWishlistIds(user) {
        return this.wishlistService.getWishlistIds(user.id);
    }
    async toggleWishlist(user, dto) {
        return this.wishlistService.toggleWishlist(user.id, dto);
    }
    async updateNotify(user, productId, dto) {
        return this.wishlistService.updateNotifyPreference(user.id, productId, dto);
    }
    async mergeWishlist(user, dto) {
        return this.wishlistService.mergeWishlist(user.id, dto);
    }
    async removeItem(user, productId) {
        return this.wishlistService.removeItem(user.id, productId);
    }
    async clearWishlist(user) {
        return this.wishlistService.clearWishlist(user.id);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current user wishlist with product details" }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: "Wishlist retrieved successfully",
        type: wishlist_response_dto_1.WishlistPaginatedResponseDto,
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Get)("ids"),
    (0, swagger_1.ApiOperation)({ summary: "Get all product IDs in user wishlist" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Product ID array" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlistIds", null);
__decorate([
    (0, common_1.Post)("toggle"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Toggle product in/out of wishlist" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Toggle status result" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, toggle_wishlist_dto_1.ToggleWishlistDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "toggleWishlist", null);
__decorate([
    (0, common_1.Patch)(":productId/notify"),
    (0, swagger_1.ApiOperation)({ summary: "Update out-of-stock notification alert (Notify Me)" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Notification preference updated" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("productId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_notify_dto_1.UpdateNotifyDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "updateNotify", null);
__decorate([
    (0, common_1.Post)("merge"),
    (0, swagger_1.ApiOperation)({ summary: "Merge guest wishlist items into user account" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Merged product IDs" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, merge_wishlist_dto_1.MergeWishlistDto]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "mergeWishlist", null);
__decorate([
    (0, common_1.Delete)(":productId"),
    (0, swagger_1.ApiOperation)({ summary: "Remove a specific product from wishlist" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Item removed" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: "Clear all items from wishlist" }),
    (0, swagger_helper_1.ApiWrappedResponse)({ status: 200, description: "Wishlist cleared" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "clearWishlist", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)("Wishlist"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)("wishlist"),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map