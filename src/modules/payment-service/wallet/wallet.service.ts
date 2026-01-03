import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { IPaginatedResponse, PaymentStatus } from 'src/common/interface';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { generateTransactionId } from '../payment/utils/payment.utils';
import {
  AdminWalletQueryDto,
  BalanceAdjustmentDto,
  TopUpRequestDto,
  WalletTransactionQueryDto,
} from './dto/wallet.dto';
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

  async getWalletSummary(userId: string) {
    const wallet = await this.getWallet(userId);

    return {
      depositAmount: wallet.depositBalance,
      cashbackEarned: wallet.cashbackBalance,
      totalBalance: wallet.totalBalance,
    };
  }

  async requestTopUp(
    userId: string,
    dto: TopUpRequestDto,
  ): Promise<WalletTransactionDocument> {
    const wallet = await this.getWallet(userId);
    const transactionId = 'WLT-' + generateTransactionId().split('-')[1];

    const transaction = new this.transactionModel({
      walletId: wallet._id,
      userId: new Types.ObjectId(userId),
      transactionId,
      amount: dto.amount,
      type: WalletTransactionType.CREDIT,
      source: WalletTransactionSource.ADD_MONEY,
      balanceType: WalletBalanceType.DEPOSIT,
      status: PaymentStatus.PENDING,
      description: dto.description || `Added From ${dto.method}`,
      metadata: { method: dto.method },
    });

    return await transaction.save();
  }

  async processTopUpSuccess(
    transactionId: string,
    session?: ClientSession,
  ): Promise<WalletTransactionDocument> {
    const transaction = await this.transactionModel
      .findOne({ transactionId })
      .session(session || null);

    if (!transaction) throw new BadRequestException('Transaction not found');
    if (transaction.status !== PaymentStatus.PENDING) {
      return transaction;
    }

    transaction.status = PaymentStatus.PAID;
    const updatedTransaction = await transaction.save({ session });

    await this.walletModel.findOneAndUpdate(
      { _id: transaction.walletId },
      { $inc: { depositBalance: transaction.amount } },
      { session, new: true },
    );

    return updatedTransaction;
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
      description:
        balanceType === WalletBalanceType.CASHBACK
          ? `Paid For Order (Cashback): ${referenceId}`
          : `Paid For Order: ${referenceId}`,
      referenceId,
    });

    return await transaction.save({ session });
  }

  async awardCashback(
    userId: string,
    amount: number,
    orderId: string,
    session?: ClientSession,
  ): Promise<WalletTransactionDocument> {
    const wallet = await this.getWallet(userId);
    const transactionId = 'WLT-' + generateTransactionId().split('-')[1];

    await this.walletModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $inc: { cashbackBalance: amount } },
      { session, new: true },
    );

    const transaction = new this.transactionModel({
      walletId: wallet._id,
      userId: new Types.ObjectId(userId),
      transactionId,
      amount,
      type: WalletTransactionType.CREDIT,
      source: WalletTransactionSource.CASHBACK,
      balanceType: WalletBalanceType.CASHBACK,
      status: PaymentStatus.PAID,
      description: `Cashback For Order Id: ${orderId}`,
      referenceId: orderId,
    });

    return await transaction.save({ session });
  }

  async findAllTransactions(
    query: WalletTransactionQueryDto,
    userId?: string,
  ): Promise<IPaginatedResponse<WalletTransactionDocument>> {
    const paginateQueries = pick(query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);
    const { searchTerm, type, balanceType, isSuccessOnly } = query;

    const filterQuery: FilterQuery<WalletTransactionDocument> = {};
    if (userId) filterQuery.userId = new Types.ObjectId(userId);

    if (type) filterQuery.type = type;
    if (balanceType) filterQuery.balanceType = balanceType;
    if (isSuccessOnly) filterQuery.status = PaymentStatus.PAID;

    if (searchTerm) {
      filterQuery.description = { $regex: searchTerm, $options: 'i' };
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<WalletTransactionDocument>({
      model: this.transactionModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findAllWallets(
    query: AdminWalletQueryDto,
  ): Promise<IPaginatedResponse<WalletDocument>> {
    const { searchTerm, status, ...paginateQueries } = query;
    const filterQuery: FilterQuery<WalletDocument> = {};

    if (status) filterQuery.status = status;
    if (searchTerm) {
      filterQuery.$or = [
        {
          userId: Types.ObjectId.isValid(searchTerm)
            ? new Types.ObjectId(searchTerm)
            : null,
        },
      ].filter((f) => f.userId !== null) as FilterQuery<WalletDocument>[];
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<WalletDocument>({
      model: this.walletModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async adjustBalance(
    userId: string,
    dto: BalanceAdjustmentDto,
    adminId: string,
  ): Promise<WalletTransactionDocument> {
    const wallet = await this.getWallet(userId);
    const { amount, type, balanceType, reason } = dto;

    const incrementAmount =
      type === WalletTransactionType.CREDIT ? amount : -amount;
    const updateField =
      balanceType === WalletBalanceType.DEPOSIT
        ? 'depositBalance'
        : 'cashbackBalance';

    if (type === WalletTransactionType.DEBIT) {
      const currentBalance =
        balanceType === WalletBalanceType.DEPOSIT
          ? wallet.depositBalance
          : wallet.cashbackBalance;
      if (currentBalance < amount) {
        throw new BadRequestException('Insufficient balance for adjustment');
      }
    }

    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $inc: { [updateField]: incrementAmount } },
      { new: true },
    );

    if (!updatedWallet) {
      throw new InternalServerErrorException('Failed to update wallet balance');
    }

    const transaction = new this.transactionModel({
      walletId: updatedWallet._id,
      userId: new Types.ObjectId(userId),
      transactionId: 'ADM-' + generateTransactionId().split('-')[1],
      amount,
      type,
      source: WalletTransactionSource.ADMIN_ADJUSTMENT,
      balanceType,
      status: PaymentStatus.PAID,
      description: `Admin Adjustment: ${reason}`,
      metadata: { adminId },
    });

    return await transaction.save();
  }

  async getAdminWalletStats() {
    const stats = await this.walletModel.aggregate([
      {
        $group: {
          _id: null,
          totalDepositBalance: { $sum: '$depositBalance' },
          totalCashbackBalance: { $sum: '$cashbackBalance' },
          totalWallets: { $sum: 1 },
        },
      },
    ]);

    const transactionStats = await this.transactionModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const summary = {
      walletSummary: stats[0] || {
        totalDepositBalance: 0,
        totalCashbackBalance: 0,
        totalWallets: 0,
      },
      transactionSummary: transactionStats,
    };

    return summary;
  }
}
