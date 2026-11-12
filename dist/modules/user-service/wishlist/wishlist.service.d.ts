import { Model } from "mongoose";
import { ToggleWishlistDto } from "./dto/toggle-wishlist.dto";
import { UpdateNotifyDto } from "./dto/update-notify.dto";
import { MergeWishlistDto } from "./dto/merge-wishlist.dto";
import { WishlistDocument } from "./schemas/wishlist.schema";
export declare class WishlistService {
    private readonly wishlistModel;
    constructor(wishlistModel: Model<WishlistDocument>);
    getWishlist(userId: string, page?: number, limit?: number): Promise<{
        items: {
            _id: any;
            productId: any;
            variantSku: any;
            notifyWhenAvailable: any;
            priceWhenAdded: any;
            product: any;
            createdAt: any;
        }[];
        total: number;
    }>;
    getWishlistIds(userId: string): Promise<string[]>;
    toggleWishlist(userId: string, dto: ToggleWishlistDto): Promise<{
        added: boolean;
        message: string;
    }>;
    updateNotifyPreference(userId: string, productId: string, dto: UpdateNotifyDto): Promise<{
        message: string;
        notifyWhenAvailable: boolean;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        message: string;
    }>;
    clearWishlist(userId: string): Promise<{
        message: string;
    }>;
    mergeWishlist(userId: string, dto: MergeWishlistDto): Promise<string[]>;
}
