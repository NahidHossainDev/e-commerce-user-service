import { Document, Types } from 'mongoose';
import { AppCurrency } from 'src/common/constants';
import { PaymentMethod, PaymentStatus } from 'src/common/interface';
export type PaymentDocument = Payment & Document;
export declare class Payment {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;
    transactionId: string;
    gatewayTransactionId?: string;
    amount: number;
    currency: AppCurrency;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    gatewayResponse?: Record<string, any>;
    failureReason?: string;
    metadata?: Record<string, any>;
    paidAt?: Date;
    refundedAt?: Date;
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, Document<unknown, any, Payment, any, {}> & Payment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, import("mongoose").FlatRecord<Payment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
