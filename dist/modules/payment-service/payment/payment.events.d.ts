export declare enum PaymentEvents {
    PAYMENT_COMPLETED = "payment.completed",
    PAYMENT_FAILED = "payment.failed",
    REFUND_INITIATED = "payment.refund.initiated"
}
export declare class PaymentCompletedEvent {
    readonly paymentId: string;
    readonly transactionId: string;
    readonly orderId: string;
    readonly userId: string;
    readonly amount: number;
    readonly method: string;
    readonly paidAt: Date;
    constructor(paymentId: string, transactionId: string, orderId: string, userId: string, amount: number, method: string, paidAt: Date);
}
export declare class PaymentFailedEvent {
    readonly paymentId: string;
    readonly transactionId: string;
    readonly orderId: string;
    readonly userId: string;
    readonly reason: string;
    constructor(paymentId: string, transactionId: string, orderId: string, userId: string, reason: string);
}
export declare class RefundInitiatedEvent {
    readonly paymentId: string;
    readonly transactionId: string;
    readonly orderId: string;
    readonly amount: number;
    readonly reason: string;
    constructor(paymentId: string, transactionId: string, orderId: string, amount: number, reason: string);
}
