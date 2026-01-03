export enum OrderEvents {
  ORDER_CREATED = 'order.created',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_STATUS_UPDATED = 'order.status_updated',
  REQUEST_PAYMENT = 'order.request_payment',
}

export interface PaymentRequestResult {
  status: 'PENDING' | 'PAID' | 'FAILED';
  transactionId?: string;
  gatewayUrl?: string;
}

export interface OrderItemPayload {
  productId: string;
  name: string;
  variantSku?: string;
  quantity: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItemPayload[];
  totalAmount: number;
  payableAmount: number;
  timestamp: Date;
}

export interface OrderCancelledEvent {
  orderId: string;
  reason: string;
  timestamp: Date;
}

export class OrderPaymentRequestEvent {
  constructor(
    public readonly payload: {
      orderId: string;
      userId: string;
      totalAmount: number;
      paymentIntent: {
        method: string;
        useWallet?: boolean;
        useCashback?: boolean;
      };
      session?: any;
    },
  ) {}
}
