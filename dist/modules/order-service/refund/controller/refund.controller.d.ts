import { CancelRefundRequestDto, CreateRefundRequestDto } from '../dto/refund.dto';
import { RefundQueryOptions } from '../dto/refund.query-options.dto';
import { RefundService } from '../refund.service';
export declare class RefundController {
    private readonly refundService;
    constructor(refundService: RefundService);
    create(dto: CreateRefundRequestDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
    findAllByUser(query: RefundQueryOptions, req: any): Promise<import("../../../../common/interface").IPaginatedResponse<import("../schemas/refund.schema").RefundDocument>>;
    findById(id: string, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
    cancel(id: string, dto: CancelRefundRequestDto, req: any): Promise<import("../schemas/refund.schema").RefundDocument>;
}
