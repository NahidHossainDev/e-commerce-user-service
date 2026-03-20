import { RefundReason, RefundStatus, RefundType } from '../schemas/refund.schema';
export declare class RefundQueryOptions {
    searchTerm?: string;
    userId?: string;
    orderId?: string;
    status?: RefundStatus;
    refundType?: RefundType;
    reason?: RefundReason;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
