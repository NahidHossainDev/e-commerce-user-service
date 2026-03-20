import { Document, Types } from 'mongoose';
export type RefundDocument = Refund & Document;
export declare enum RefundStatus {
    REQUESTED = "REQUESTED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum RefundType {
    FULL = "FULL",
    PARTIAL = "PARTIAL",
    SHIPPING = "SHIPPING"
}
export declare enum RefundReason {
    DAMAGED_PRODUCT = "DAMAGED_PRODUCT",
    WRONG_ITEM = "WRONG_ITEM",
    DEFECTIVE_PRODUCT = "DEFECTIVE_PRODUCT",
    NOT_AS_DESCRIBED = "NOT_AS_DESCRIBED",
    QUALITY_ISSUE = "QUALITY_ISSUE",
    SIZE_FIT_ISSUE = "SIZE_FIT_ISSUE",
    LATE_DELIVERY = "LATE_DELIVERY",
    CUSTOMER_CHANGED_MIND = "CUSTOMER_CHANGED_MIND",
    DUPLICATE_ORDER = "DUPLICATE_ORDER",
    FRAUDULENT_ORDER = "FRAUDULENT_ORDER",
    OTHER = "OTHER"
}
export declare enum RefundMethod {
    ORIGINAL_PAYMENT = "ORIGINAL_PAYMENT",
    WALLET = "WALLET",
    BANK_TRANSFER = "BANK_TRANSFER",
    STORE_CREDIT = "STORE_CREDIT"
}
export declare class RefundItem {
    productId: Types.ObjectId;
    name: string;
    variantSku: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    reason: string;
}
export declare class RefundAmount {
    itemsTotal: number;
    shippingRefund: number;
    taxRefund: number;
    couponRefund: number;
    walletRefund: number;
    processingFee: number;
    restockingFee: number;
    totalRefundAmount: number;
    currency: string;
}
export declare class RefundEvidence {
    images: string[];
    videos: string[];
    description: string;
    documents: string[];
}
export declare class RefundTimeline {
    requestedAt: Date;
    approvedAt: Date;
    rejectedAt: Date;
    processingStartedAt: Date;
    completedAt: Date;
    failedAt: Date;
    cancelledAt: Date;
}
export declare class AdminAction {
    adminId: Types.ObjectId;
    action: string;
    note: string;
    timestamp: Date;
}
export declare class PaymentGatewayResponse {
    gateway: string;
    transactionId: string;
    refundId: string;
    status: string;
    rawResponse: Record<string, any>;
    timestamp: Date;
}
export declare class Refund {
    refundId: string;
    orderId: Types.ObjectId;
    orderNumber: string;
    userId: Types.ObjectId;
    refundType: RefundType;
    status: RefundStatus;
    reason: RefundReason;
    reasonDetails: string;
    items: RefundItem[];
    refundAmount: RefundAmount;
    refundMethod: RefundMethod;
    evidence: RefundEvidence;
    timeline: RefundTimeline;
    adminActions: AdminAction[];
    paymentGatewayResponse: PaymentGatewayResponse;
    rejectionReason: string;
    failureReason: string;
    isStockRestored: boolean;
    stockRestoredAt: Date;
    isCouponRestored: boolean;
    couponRestoredAt: Date;
    metadata: Record<string, any>;
    internalNotes: string;
}
export declare const RefundSchema: import("mongoose").Schema<Refund, import("mongoose").Model<Refund, any, any, any, Document<unknown, any, Refund, any, {}> & Refund & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Refund, Document<unknown, {}, import("mongoose").FlatRecord<Refund>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Refund> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
