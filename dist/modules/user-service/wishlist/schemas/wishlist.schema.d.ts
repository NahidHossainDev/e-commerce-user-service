import { HydratedDocument, Types } from "mongoose";
export type WishlistDocument = HydratedDocument<Wishlist>;
export declare class Wishlist {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    variantSku?: string;
    notifyWhenAvailable: boolean;
    priceWhenAdded?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const WishlistSchema: import("mongoose").Schema<Wishlist, import("mongoose").Model<Wishlist, any, any, any, import("mongoose").Document<unknown, any, Wishlist, any, {}> & Wishlist & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wishlist, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Wishlist>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Wishlist> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
