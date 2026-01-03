import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  OrderEvents,
  OrderPaymentRequestEvent,
  PaymentRequestResult,
} from 'src/common/events/order.events';
import { PaymentMethod, PaymentStatus } from 'src/common/interface';
import { WalletBalanceType } from '../../wallet/interface/wallet.interface';
import { WalletService } from '../../wallet/wallet.service';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentListener {
  constructor(
    private readonly walletService: WalletService,
    private readonly paymentService: PaymentService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @OnEvent(OrderEvents.REQUEST_PAYMENT, { async: true })
  async handlePaymentRequest(
    event: OrderPaymentRequestEvent,
  ): Promise<PaymentRequestResult> {
    const { orderId, userId, totalAmount, paymentIntent, session } =
      event.payload;

    let remainingAmount = totalAmount;

    try {
      // 1. Deduct Cashback if requested
      if (paymentIntent.useCashback && remainingAmount > 0) {
        const wallet = await this.walletService.getWallet(userId);
        const deductAmount = Math.min(wallet.cashbackBalance, remainingAmount);
        if (deductAmount > 0) {
          await this.walletService.deductFunds(
            userId,
            deductAmount,
            WalletBalanceType.CASHBACK,
            orderId,
            session,
          );
          remainingAmount -= deductAmount;
        }
      }

      // 2. Deduct Wallet Balance if requested
      if (paymentIntent.useWallet && remainingAmount > 0) {
        const wallet = await this.walletService.getWallet(userId);
        const deductAmount = Math.min(wallet.depositBalance, remainingAmount);
        if (deductAmount > 0) {
          await this.walletService.deductFunds(
            userId,
            deductAmount,
            WalletBalanceType.DEPOSIT,
            orderId,
            session,
          );
          remainingAmount -= deductAmount;
        }
      }

      // 3. Handle Remaining Amount
      if (remainingAmount <= 0) {
        return { status: PaymentStatus.PAID };
      }

      // 4. Handle COD for remaining balance
      if (paymentIntent.method === PaymentMethod.COD) {
        const payment = await this.paymentService.initiatePayment(
          {
            userId,
            orderId,
            amount: remainingAmount,
            paymentMethod: paymentIntent.method,
            metadata: { source: 'checkout', type: PaymentMethod.COD },
          },
          session,
        );

        return {
          status: PaymentStatus.PENDING,
          transactionId: payment.transactionId,
          gatewayUrl: undefined, // No redirect for COD
        };
      }

      // 5. Initiate External Payment for remaining balance (Online Payment)
      const payment = await this.paymentService.initiatePayment(
        {
          userId,
          orderId,
          amount: remainingAmount,
          paymentMethod: paymentIntent.method,
          metadata: { source: 'checkout' },
        },
        session,
      );

      return {
        status: PaymentStatus.PENDING,
        transactionId: payment.transactionId,
        gatewayUrl:
          (payment as any).gatewayUrl ||
          `/pay/${payment.paymentMethod.toLowerCase()}/${payment.transactionId}`,
      };
    } catch (error) {
      console.error('Payment delegation failed:', error);
      return { status: PaymentStatus.FAILED };
    }
  }
}
