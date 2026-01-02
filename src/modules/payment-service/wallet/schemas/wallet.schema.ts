import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { WalletStatus } from '../interface/wallet.interface';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true, collection: 'wallets' })
export class Wallet {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ default: 0, min: 0 })
  depositBalance: number;

  @Prop({ default: 0, min: 0 })
  cashbackBalance: number;

  @Prop({
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;

  // Virtual for total balance
  totalBalance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.virtual('totalBalance').get(function () {
  return (this.depositBalance || 0) + (this.cashbackBalance || 0);
});

WalletSchema.set('toJSON', { virtuals: true });
WalletSchema.set('toObject', { virtuals: true });
