import { PaymentMethod } from 'src/common/interface';
export declare class InitiatePaymentDto {
    userId: string;
    orderId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    currency?: string;
    metadata?: Record<string, any>;
}
