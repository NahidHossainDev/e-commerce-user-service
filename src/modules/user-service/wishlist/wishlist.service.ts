import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ToggleWishlistDto } from "./dto/toggle-wishlist.dto";
import { UpdateNotifyDto } from "./dto/update-notify.dto";
import { MergeWishlistDto } from "./dto/merge-wishlist.dto";
import { Wishlist, WishlistDocument } from "./schemas/wishlist.schema";

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
  ) {}

  async getWishlist(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const userObjectId = new Types.ObjectId(userId);

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
      .map((item: any) => ({
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

  async getWishlistIds(userId: string): Promise<string[]> {
    const items = await this.wishlistModel
      .find({ userId: new Types.ObjectId(userId) }, { productId: 1 })
      .lean();

    return items.map((i) => i.productId.toString());
  }

  async toggleWishlist(userId: string, dto: ToggleWishlistDto) {
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(dto.productId);

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

  async updateNotifyPreference(userId: string, productId: string, dto: UpdateNotifyDto) {
    const updated = await this.wishlistModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(productId),
      },
      { notifyWhenAvailable: dto.notify },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException("Wishlist item not found");
    }

    return {
      message: dto.notify
        ? "You will be notified when this item is back in stock"
        : "Stock alert removed",
      notifyWhenAvailable: updated.notifyWhenAvailable,
    };
  }

  async removeItem(userId: string, productId: string) {
    const result = await this.wishlistModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (!result) {
      throw new NotFoundException("Item not found in wishlist");
    }

    return { message: "Item removed from wishlist" };
  }

  async clearWishlist(userId: string) {
    await this.wishlistModel.deleteMany({ userId: new Types.ObjectId(userId) });
    return { message: "Wishlist cleared successfully" };
  }

  async mergeWishlist(userId: string, dto: MergeWishlistDto) {
    const userObjectId = new Types.ObjectId(userId);
    const operations = dto.productIds.map((pId) => ({
      updateOne: {
        filter: { userId: userObjectId, productId: new Types.ObjectId(pId), variantSku: null },
        update: {
          $setOnInsert: {
            userId: userObjectId,
            productId: new Types.ObjectId(pId),
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
}
