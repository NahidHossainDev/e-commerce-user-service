export enum AppCurrency {
  USD = 'USD',
  BDT = 'BDT',
  EUR = 'EUR',
  GBP = 'GBP',
}

export const DEFAULT_CURRENCY = AppCurrency.BDT;

export const CURRENCY_SYMBOLS: Record<AppCurrency, string> = {
  [AppCurrency.USD]: '$',
  [AppCurrency.BDT]: '৳',
  [AppCurrency.EUR]: '€',
  [AppCurrency.GBP]: '£',
};
