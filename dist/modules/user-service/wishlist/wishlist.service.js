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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wishlist_schema_1 = require("./schemas/wishlist.schema");
let WishlistService = class WishlistService {
    wishlistModel;
    constructor(wishlistModel) {
        this.wishlistModel = wishlistModel;
    }
    async getWishlist(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const [items, total] = await Promise.all([
            this.wishlistModel
                .find({ userId: userObjectId })
                .populate({
                path: "productId",
                select: "title slug thumbnail price stock averageRating totalReviews status isOutOfStock sku",
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.wishlistModel.countDocuments({ userId: userObjectId }),
        ]);
        const formattedItems = items
            .filter((item) => item.productId !== null)
            .map((item) => ({
            _id: item._id.toString(),
            productId: item.productId._id?.toString() || item.productId.toString(),
            variantSku: item.variantSku,
            notifyWhenAvailable: item.notifyWhenAvailable ?? false,
            priceWhenAdded: item.priceWhenAdded,
            product: item.productId,
            createdAt: item.createdAt,
        }));
        return { items: formattedItems, total };
    }
    async getWishlistIds(userId) {
        const items = await this.wishlistModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) }, { productId: 1 })
            .lean();
        return items.map((i) => i.productId.toString());
    }
    async toggleWishlist(userId, dto) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const productObjectId = new mongoose_2.Types.ObjectId(dto.productId);
        const existing = await this.wishlistModel.findOne({
            userId: userObjectId,
            productId: productObjectId,
            variantSku: dto.variantSku || null,
        });
        if (existing) {
            await this.wishlistModel.findByIdAndDelete(existing._id);
            return { added: false, message: "Removed from wishlist" };
        }
        await this.wishlistModel.create({
            userId: userObjectId,
            productId: productObjectId,
            variantSku: dto.variantSku || null,
            notifyWhenAvailable: false,
        });
        return { added: true, message: "Added to wishlist" };
    }
    async updateNotifyPreference(userId, productId, dto) {
        const updated = await this.wishlistModel.findOneAndUpdate({
            userId: new mongoose_2.Types.ObjectId(userId),
            productId: new mongoose_2.Types.ObjectId(productId),
        }, { notifyWhenAvailable: dto.notify }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException("Wishlist item not found");
        }
        return {
            message: dto.notify
                ? "You will be notified when this item is back in stock"
                : "Stock alert removed",
            notifyWhenAvailable: updated.notifyWhenAvailable,
        };
    }
    async removeItem(userId, productId) {
        const result = await this.wishlistModel.findOneAndDelete({
            userId: new mongoose_2.Types.ObjectId(userId),
            productId: new mongoose_2.Types.ObjectId(productId),
        });
        if (!result) {
            throw new common_1.NotFoundException("Item not found in wishlist");
        }
        return { message: "Item removed from wishlist" };
    }
    async clearWishlist(userId) {
        await this.wishlistModel.deleteMany({ userId: new mongoose_2.Types.ObjectId(userId) });
        return { message: "Wishlist cleared successfully" };
    }
    async mergeWishlist(userId, dto) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const operations = dto.productIds.map((pId) => ({
            updateOne: {
                filter: { userId: userObjectId, productId: new mongoose_2.Types.ObjectId(pId), variantSku: null },
                update: {
                    $setOnInsert: {
                        userId: userObjectId,
                        productId: new mongoose_2.Types.ObjectId(pId),
                        variantSku: null,
                        notifyWhenAvailable: false,
                    },
                },
                upsert: true,
            },
        }));
        if (operations.length > 0) {
            await this.wishlistModel.bulkWrite(operations);
        }
        return this.getWishlistIds(userId);
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wishlist_schema_1.Wishlist.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map