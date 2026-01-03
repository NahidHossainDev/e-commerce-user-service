export enum PaymentEvents {
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_INITIATED = 'payment.refund.initiated',
}

export class PaymentCompletedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly transactionId: string,
    public readonly orderId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly method: string,
    public readonly paidAt: Date,
  ) {}
}

export class PaymentFailedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly transactionId: string,
    public readonly orderId: string,
    public readonly userId: string,
    public readonly reason: string,
  ) {}
}

export class RefundInitiatedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly transactionId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly reason: string,
  ) {}
}
