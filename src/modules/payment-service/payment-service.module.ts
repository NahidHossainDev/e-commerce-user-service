import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment/schemas/payment.schema';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './wallet/schemas/wallet-transaction.schema';
import { Wallet, WalletSchema } from './wallet/schemas/wallet.schema';

import { PaymentService } from './payment/payment.service';

import {
  AdminPaymentController,
  PaymentController,
} from './payment/controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [PaymentController, AdminPaymentController],
  providers: [PaymentService],
  exports: [MongooseModule, PaymentService],
})
export class PaymentServiceModule {}
