import { AddRefundNoteDto, AdminRefundActionDto, ProcessRefundDto, UpdateRefundStatusDto } from '../dto/refund.dto';
import { RefundQueryOptions } from '../dto/refund.query-options.dto';
import { RefundService } from '../refund.service';
export declare class AdminRefundController {
    private readonly refundService;
    constructor(refundService: RefundService);
    findAll(query: RefundQueryOptions): Promise<import("../../../../common/interface").IPaginatedResponse<import("../schemas/refund.schema").RefundDocument>>;
    findById(id: string): Promise<import("../schemas/refund.schema").RefundDocument>;
    approveOrReject(id: string, dto: AdminRefundActionDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
    processPayment(id: string, dto: ProcessRefundDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
    updateStatus(id: string, dto: UpdateRefundStatusDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
    addNote(id: string, dto: AddRefundNoteDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
}
