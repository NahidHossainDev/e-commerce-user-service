import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment/schemas/payment.schema';

import { PaymentListener } from './payment/listeners/payment.listener';
import { PaymentService } from './payment/payment.service';
import { WalletModule } from './wallet/wallet.module';

import {
  AdminPaymentController,
  PaymentController,
} from './payment/controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    WalletModule,
  ],
  controllers: [PaymentController, AdminPaymentController],
  providers: [PaymentService, PaymentListener],
  exports: [MongooseModule, PaymentService, WalletModule],
})
export class PaymentServiceModule {}
