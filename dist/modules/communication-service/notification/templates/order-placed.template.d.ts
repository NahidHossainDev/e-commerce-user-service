import { TemplateResult } from './verify-email.template';
export declare const orderPlacedTemplate: (data: {
    customerName: string;
    orderId: string;
    totalAmount: number;
}) => TemplateResult;
