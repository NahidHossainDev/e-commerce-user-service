import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [PaymentModule, WalletModule],
  exports: [PaymentModule, WalletModule],
})
export class PaymentServiceModule {}
