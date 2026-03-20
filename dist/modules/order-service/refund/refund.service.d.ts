import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection, Model } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { OrderDocument } from '../order/schemas/order.schema';
import { AddRefundNoteDto, AdminRefundActionDto, CancelRefundRequestDto, CreateRefundRequestDto, ProcessRefundDto, UpdateRefundStatusDto } from './dto/refund.dto';
import { RefundQueryOptions } from './dto/refund.query-options.dto';
import { RefundDocument } from './schemas/refund.schema';
export declare class RefundService {
    private refundModel;
    private orderModel;
    private readonly eventEmitter;
    private readonly connection;
    constructor(refundModel: Model<RefundDocument>, orderModel: Model<OrderDocument>, eventEmitter: EventEmitter2, connection: Connection);
    createRefundRequest(userId: string, dto: CreateRefundRequestDto): Promise<RefundDocument>;
    findAll(query: RefundQueryOptions): Promise<IPaginatedResponse<RefundDocument>>;
    findAllByUser(userId: string, query: RefundQueryOptions): Promise<IPaginatedResponse<RefundDocument>>;
    findById(refundId: string, userId?: string): Promise<RefundDocument>;
    cancelRefund(refundId: string, userId: string, dto: CancelRefundRequestDto): Promise<RefundDocument>;
    approveOrReject(refundId: string, adminId: string, dto: AdminRefundActionDto): Promise<RefundDocument>;
    processRefundPayment(refundId: string, adminId: string, dto: ProcessRefundDto): Promise<RefundDocument>;
    updateRefundStatus(refundId: string, adminId: string, dto: UpdateRefundStatusDto): Promise<RefundDocument>;
    addInternalNote(refundId: string, adminId: string, dto: AddRefundNoteDto): Promise<RefundDocument>;
    private emitStockRestoreEvent;
    private emitCouponRestoreEvent;
    private processPaymentGateway;
    private updateOrderAfterRefund;
}
