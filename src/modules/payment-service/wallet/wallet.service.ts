import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { PaymentStatus } from 'src/common/interface';
import { generateTransactionId } from '../payment/utils/payment.utils';
import {
  WalletBalanceType,
  WalletTransactionSource,
  WalletTransactionType,
} from './interface/wallet.interface';
import {
  WalletTransaction,
  WalletTransactionDocument,
} from './schemas/wallet-transaction.schema';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(WalletTransaction.name)
    private transactionModel: Model<WalletTransactionDocument>,
  ) {}

  async getWallet(userId: string): Promise<WalletDocument> {
    let wallet = await this.walletModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!wallet) {
      wallet = await this.walletModel.create({
        userId: new Types.ObjectId(userId),
        depositBalance: 0,
        cashbackBalance: 0,
      });
    }

    return wallet;
  }

  async deductFunds(
    userId: string,
    amount: number,
    balanceType: WalletBalanceType,
    referenceId: string,
    session: ClientSession,
  ): Promise<WalletTransactionDocument> {
    const wallet = await this.getWallet(userId);

    const currentBalance =
      balanceType === WalletBalanceType.DEPOSIT
        ? wallet.depositBalance
        : wallet.cashbackBalance;

    if (currentBalance < amount) {
      throw new BadRequestException(
        `Insufficient ${balanceType.toLowerCase()} balance`,
      );
    }

    const updateField =
      balanceType === WalletBalanceType.DEPOSIT
        ? 'depositBalance'
        : 'cashbackBalance';

    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $inc: { [updateField]: -amount } },
      { session, new: true },
    );

    if (!updatedWallet) {
      throw new InternalServerErrorException('Failed to update wallet balance');
    }

    const transactionId = 'WLT-' + generateTransactionId().split('-')[1];

    const transaction = new this.transactionModel({
      walletId: updatedWallet._id,
      userId: new Types.ObjectId(userId),
      transactionId,
      amount,
      type: WalletTransactionType.DEBIT,
      source: WalletTransactionSource.ORDER_PAYMENT,
      balanceType,
      status: PaymentStatus.PAID,
      description: `Payment for Order: ${referenceId}`,
      referenceId,
    });

    return await transaction.save({ session });
  }
}
