export enum WalletTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum WalletTransactionSource {
  ADD_MONEY = 'ADD_MONEY',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  CASHBACK = 'CASHBACK',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
}

export enum WalletBalanceType {
  DEPOSIT = 'DEPOSIT',
  CASHBACK = 'CASHBACK',
}

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}
