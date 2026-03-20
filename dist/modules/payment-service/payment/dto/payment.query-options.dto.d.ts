import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { PaymentMethod, PaymentStatus } from 'src/common/interface';
export declare class PaymentQueryOptions extends QueryOptions {
    searchTerm?: string;
    status?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    orderId?: string;
    transactionId?: string;
    startDate?: Date;
    endDate?: Date;
}
