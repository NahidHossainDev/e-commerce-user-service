import { IAuthUser } from "src/common/interface";
import { ToggleWishlistDto } from "./dto/toggle-wishlist.dto";
import { UpdateNotifyDto } from "./dto/update-notify.dto";
import { MergeWishlistDto } from "./dto/merge-wishlist.dto";
import { WishlistService } from "./wishlist.service";
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(user: IAuthUser, page?: number, limit?: number): Promise<{
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
    getWishlistIds(user: IAuthUser): Promise<string[]>;
    toggleWishlist(user: IAuthUser, dto: ToggleWishlistDto): Promise<{
        added: boolean;
        message: string;
    }>;
    updateNotify(user: IAuthUser, productId: string, dto: UpdateNotifyDto): Promise<{
        message: string;
        notifyWhenAvailable: boolean;
    }>;
    mergeWishlist(user: IAuthUser, dto: MergeWishlistDto): Promise<string[]>;
    removeItem(user: IAuthUser, productId: string): Promise<{
        message: string;
    }>;
    clearWishlist(user: IAuthUser): Promise<{
        message: string;
    }>;
}
