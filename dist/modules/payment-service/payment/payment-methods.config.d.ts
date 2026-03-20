import { PaymentMethod } from 'src/common/interface';
export type PaymentMethodCode = PaymentMethod;
export type PaymentCategoryCode = 'mobile_wallet' | 'card' | 'cod' | 'wallet';
export interface PaymentMethodConfig {
    code: PaymentMethodCode;
    label: string;
    icon: string;
    redirectUrl: string | null;
    minAmount?: number;
    maxAmount?: number;
    fee?: number;
    enabled: boolean;
}
export interface PaymentCategoryConfig {
    category: PaymentCategoryCode;
    label: string;
    methods: PaymentMethodConfig[];
}
export declare const AVAILABLE_PAYMENT_METHODS: PaymentCategoryConfig[];
