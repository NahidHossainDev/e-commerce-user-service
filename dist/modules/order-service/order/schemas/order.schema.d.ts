import { Document, Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from 'src/common/interface';
import { Price } from '../../../../common/schemas';
export { OrderStatus, PaymentMethod, PaymentStatus };
export type OrderDocument = Order & Document;
export declare class OrderItem {
    productId: Types.ObjectId;
    name: string;
    thumbnail: string;
    variantSku: string;
    quantity: number;
    price: Price;
    total: number;
}
export declare class BillingInfo {
    totalAmount: number;
    discount: number;
    appliedCouponId?: Types.ObjectId;
    couponDiscount: number;
    deliveryCharge: number;
    payableAmount: number;
    walletUsed: number;
    cashbackUsed: number;
    paymentMethod?: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentTransactionId?: string;
    paymentFailureReason?: string;
    paymentAttempt: number;
}
export declare class Order {
    orderId: string;
    userId: Types.ObjectId;
    items: OrderItem[];
    addressId: Types.ObjectId;
    status: OrderStatus;
    billingInfo: BillingInfo;
    placedAt: Date;
    confirmedAt: Date;
    shippedAt: Date;
    deliveredAt: Date;
    cancelledAt: Date;
    cancellationReason: string;
    hasRefund: boolean;
    refundIds: Types.ObjectId[];
    totalRefundedAmount: number;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
