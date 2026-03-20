import { Document, Types } from 'mongoose';
import { Price } from '../../../../common/schemas';
export type CartDocument = Cart & Document;
export declare class CartItem {
    productId: Types.ObjectId;
    productName: string;
    productThumbnail: string;
    variantSku?: string;
    quantity: number;
    price: Price;
    addedAt: Date;
    isOutOfStock: boolean;
    availableStock: number;
    isSelected: boolean;
}
export declare class Cart {
    userId: Types.ObjectId;
    items: CartItem[];
    totalAmount: number;
    totalDiscount: number;
    payableAmount: number;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart, any, {}> & Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cart> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
