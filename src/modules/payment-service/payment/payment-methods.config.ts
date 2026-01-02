export type PaymentMethodCode = 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSL' | 'COD';

export type PaymentCategoryCode = 'wallet' | 'mobile_wallet' | 'card' | 'cod';

export interface PaymentMethodConfig {
  code: PaymentMethodCode;
  label: string;
  icon: string;
  redirectUrl: string | null;
  minAmount?: number;
  maxAmount?: number;
  fee?: number; // optional processing fee
  enabled: boolean;
}

export interface PaymentCategoryConfig {
  category: PaymentCategoryCode;
  label: string;
  methods: PaymentMethodConfig[];
}

export const PAYMENT_METHODS: PaymentCategoryConfig[] = [
  {
    category: 'mobile_wallet',
    label: 'Mobile Wallet',
    methods: [
      {
        code: 'BKASH',
        label: 'bKash',
        icon: 'https://cdn.yoursite.com/payments/bkash.svg',
        redirectUrl: '/pay/bkash',
        minAmount: 10,
        maxAmount: 25000,
        fee: 0,
        enabled: true,
      },
      {
        code: 'NAGAD',
        label: 'Nagad',
        icon: 'https://cdn.yoursite.com/payments/nagad.svg',
        redirectUrl: '/pay/nagad',
        minAmount: 10,
        maxAmount: 20000,
        fee: 0,
        enabled: true,
      },
      {
        code: 'ROCKET',
        label: 'Rocket',
        icon: 'https://cdn.yoursite.com/payments/rocket.svg',
        redirectUrl: '/pay/rocket',
        minAmount: 10,
        maxAmount: 20000,
        fee: 0,
        enabled: true,
      },
    ],
  },
  {
    category: 'card',
    label: 'Card / Net Banking',
    methods: [
      {
        code: 'SSL',
        label: 'Visa / MasterCard / DBBL / AMEX (SSLCommerz)',
        icon: 'https://cdn.yoursite.com/payments/card.svg',
        redirectUrl: '/pay/ssl',
        minAmount: 50,
        fee: 2.5,
        enabled: true,
      },
    ],
  },
  {
    category: 'cod',
    label: 'Cash on Delivery',
    methods: [
      {
        code: 'COD',
        label: 'Cash on Delivery',
        icon: 'https://cdn.yoursite.com/payments/cod.svg',
        redirectUrl: null,
        maxAmount: 5000,
        enabled: true,
      },
    ],
  },
];
