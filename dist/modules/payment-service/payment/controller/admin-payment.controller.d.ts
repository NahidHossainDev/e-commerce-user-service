import { PaymentQueryOptions } from '../dto/payment.query-options.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { PaymentService } from '../payment.service';
export declare class AdminPaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getStats(): Promise<any[]>;
    findAll(query: PaymentQueryOptions): Promise<import("src/common/interface").IPaginatedResponse<import("../schemas/payment.schema").PaymentDocument>>;
    findOne(id: string): Promise<import("../schemas/payment.schema").PaymentDocument>;
    updateStatus(id: string, dto: UpdatePaymentStatusDto): Promise<import("../schemas/payment.schema").PaymentDocument>;
    initiateRefund(id: string, body: {
        amount: number;
        reason: string;
    }): Promise<import("../schemas/payment.schema").PaymentDocument>;
}
