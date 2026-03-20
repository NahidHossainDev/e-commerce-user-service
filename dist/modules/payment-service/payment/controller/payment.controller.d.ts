import { IAuthUser } from 'src/common/interface';
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { PaymentQueryOptions } from '../dto/payment.query-options.dto';
import { PaymentService } from '../payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initiate(user: IAuthUser, dto: InitiatePaymentDto): Promise<import("../schemas/payment.schema").PaymentDocument>;
    handleSSLCommerzCallback(payload: any): Promise<void>;
    getMyPayments(user: IAuthUser, query: PaymentQueryOptions): Promise<import("src/common/interface").IPaginatedResponse<import("../schemas/payment.schema").PaymentDocument>>;
    verifyPayment(transactionId: string): Promise<import("../schemas/payment.schema").PaymentDocument>;
    getPayment(user: IAuthUser, transactionId: string): Promise<import("../schemas/payment.schema").PaymentDocument>;
    getAvailablePaymentMethods(): import("../payment-methods.config").PaymentCategoryConfig[];
}
