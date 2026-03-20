import { Document, Types } from 'mongoose';
import { PaymentStatus } from 'src/common/interface';
import { WalletBalanceType, WalletTransactionSource, WalletTransactionType } from '../interface/wallet.interface';
export type WalletTransactionDocument = WalletTransaction & Document;
export declare class WalletTransaction {
    walletId: Types.ObjectId;
    userId: Types.ObjectId;
    transactionId: string;
    amount: number;
    type: WalletTransactionType;
    source: WalletTransactionSource;
    balanceType: WalletBalanceType;
    status: PaymentStatus;
    description: string;
    referenceId?: string;
    metadata?: Record<string, any>;
}
export declare const WalletTransactionSchema: import("mongoose").Schema<WalletTransaction, import("mongoose").Model<WalletTransaction, any, any, any, Document<unknown, any, WalletTransaction, any, {}> & WalletTransaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WalletTransaction, Document<unknown, {}, import("mongoose").FlatRecord<WalletTransaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<WalletTransaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
