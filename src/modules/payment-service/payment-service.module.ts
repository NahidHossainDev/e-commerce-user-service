import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment/schemas/payment.schema';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './wallet/schemas/wallet-transaction.schema';
import { Wallet, WalletSchema } from './wallet/schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class PaymentServiceModule {}
