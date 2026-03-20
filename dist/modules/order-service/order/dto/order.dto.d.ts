import { OrderStatus, PaymentMethod, PaymentStatus } from '../schemas/order.schema';
export declare class PaymentIntentDto {
    method: PaymentMethod;
    useWallet?: boolean;
    useCashback?: boolean;
}
export declare class ApplyCouponDto {
    code: string;
}
export declare class CheckoutDto {
    addressId: string;
    paymentIntent: PaymentIntentDto;
    couponId?: string;
    note?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    reason?: string;
}
export declare class UpdatePaymentStatusDto {
    status: PaymentStatus;
    transactionId?: string;
    failureReason?: string;
}
export declare class CancelOrderDto {
    reason: string;
}
