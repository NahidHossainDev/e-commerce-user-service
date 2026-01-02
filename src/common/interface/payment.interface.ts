export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  MFS = 'MFS',
  SSL = 'SSL',
  ONLINE = 'ONLINE',
  WALLET = 'WALLET',
}

export enum PaymentProvider {
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  ROCKET = 'ROCKET',
  SSL_COMMERZ = 'SSL_COMMERZ',
  COD = 'COD',
}
