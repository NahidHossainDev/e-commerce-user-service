import { QueryOptions } from 'src/common/dto';
import { OrderStatus, PaymentStatus } from '../schemas/order.schema';
export declare class OrderQueryOptions extends QueryOptions {
    searchTerm?: string;
    userId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    addressId?: string;
}
