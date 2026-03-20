import { RefundMethod, RefundReason, RefundStatus, RefundType } from '../schemas/refund.schema';
export declare class RefundItemDto {
    productId: string;
    variantSku?: string;
    quantity: number;
    reason?: string;
}
export declare class RefundEvidenceDto {
    images?: string[];
    videos?: string[];
    description?: string;
    documents?: string[];
}
export declare class CreateRefundRequestDto {
    orderId: string;
    refundType: RefundType;
    reason: RefundReason;
    reasonDetails?: string;
    items?: RefundItemDto[];
    refundMethod?: RefundMethod;
    evidence?: RefundEvidenceDto;
}
export declare class AdminRefundActionDto {
    action: 'APPROVE' | 'REJECT';
    note?: string;
    rejectionReason?: string;
    restoreStock?: boolean;
    restoreCoupon?: boolean;
}
export declare class ProcessRefundDto {
    processingFee?: number;
    restockingFee?: number;
    note?: string;
}
export declare class UpdateRefundStatusDto {
    status: RefundStatus;
    note?: string;
    failureReason?: string;
}
export declare class AddRefundNoteDto {
    note: string;
}
export declare class CancelRefundRequestDto {
    cancellationReason?: string;
}
