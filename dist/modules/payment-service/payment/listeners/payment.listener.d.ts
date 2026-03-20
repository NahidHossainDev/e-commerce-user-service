import { OrderPaymentRequestEvent } from 'src/common/events/order.events';
import { PaymentService } from '../payment.service';
export declare class PaymentListener {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handlePaymentRequest(event: OrderPaymentRequestEvent): Promise<void>;
}
