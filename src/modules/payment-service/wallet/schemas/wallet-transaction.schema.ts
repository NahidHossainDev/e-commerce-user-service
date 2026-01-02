import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from 'src/common/interface';
import {
  WalletBalanceType,
  WalletTransactionSource,
  WalletTransactionType,
} from '../interface/wallet.interface';

export type WalletTransactionDocument = WalletTransaction & Document;

@Schema({ timestamps: true, collection: 'wallet_transactions' })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true, index: true })
  walletId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  transactionId: string; // e.g., WLT-1704223456789

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({
    required: true,
    enum: WalletTransactionType,
    index: true,
  })
  type: WalletTransactionType; // CREDIT or DEBIT

  @Prop({
    required: true,
    enum: WalletTransactionSource,
    index: true,
  })
  source: WalletTransactionSource; // ADD_MONEY, ORDER_PAYMENT, etc.

  @Prop({
    required: true,
    enum: WalletBalanceType,
    index: true,
  })
  balanceType: WalletBalanceType; // DEPOSIT or CASHBACK

  @Prop({
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    index: true,
  })
  status: PaymentStatus;

  @Prop({ required: true })
  description: string; // e.g., "Added from UPI", "Paid For Order #HTDH4547"

  @Prop()
  referenceId?: string; // Order ID or Payment Transaction ID

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);

WalletTransactionSchema.index({ createdAt: -1 });
WalletTransactionSchema.index({ userId: 1, type: 1, status: 1 });
