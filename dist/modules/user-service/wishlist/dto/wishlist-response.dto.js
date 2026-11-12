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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistPaginatedResponseDto = exports.WishlistItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class WishlistItemResponseDto {
    _id;
    productId;
    variantSku;
    notifyWhenAvailable;
    priceWhenAdded;
    product;
    createdAt;
}
exports.WishlistItemResponseDto = WishlistItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], WishlistItemResponseDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], WishlistItemResponseDto.prototype, "notifyWhenAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], WishlistItemResponseDto.prototype, "priceWhenAdded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Populated Product Object" }),
    __metadata("design:type", Object)
], WishlistItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WishlistItemResponseDto.prototype, "createdAt", void 0);
class WishlistPaginatedResponseDto {
    items;
    total;
}
exports.WishlistPaginatedResponseDto = WishlistPaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [WishlistItemResponseDto] }),
    __metadata("design:type", Array)
], WishlistPaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], WishlistPaginatedResponseDto.prototype, "total", void 0);
//# sourceMappingURL=wishlist-response.dto.js.map