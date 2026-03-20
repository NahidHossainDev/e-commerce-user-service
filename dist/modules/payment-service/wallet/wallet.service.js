"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_1 = require("../../../common/interface");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const payment_utils_1 = require("../payment/utils/payment.utils");
const wallet_interface_1 = require("./interface/wallet.interface");
const wallet_transaction_schema_1 = require("./schemas/wallet-transaction.schema");
const wallet_schema_1 = require("./schemas/wallet.schema");
let WalletService = class WalletService {
    walletModel;
    transactionModel;
    constructor(walletModel, transactionModel) {
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
    }
    async getWallet(userId) {
        let wallet = await this.walletModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!wallet) {
            wallet = await this.walletModel.create({
                userId: new mongoose_2.Types.ObjectId(userId),
                depositBalance: 0,
                cashbackBalance: 0,
            });
        }
        return wallet;
    }
    async getWalletSummary(userId) {
        const wallet = await this.getWallet(userId);
        return {
            depositAmount: wallet.depositBalance,
            cashbackEarned: wallet.cashbackBalance,
            totalBalance: wallet.totalBalance,
        };
    }
    async requestTopUp(userId, dto) {
        const wallet = await this.getWallet(userId);
        const transactionId = 'WLT-' + (0, payment_utils_1.generateTransactionId)().split('-')[1];
        const transaction = new this.transactionModel({
            walletId: wallet._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            transactionId,
            amount: dto.amount,
            type: wallet_interface_1.WalletTransactionType.CREDIT,
            source: wallet_interface_1.WalletTransactionSource.ADD_MONEY,
            balanceType: wallet_interface_1.WalletBalanceType.DEPOSIT,
            status: interface_1.PaymentStatus.PENDING,
            description: dto.description || `Added From ${dto.method}`,
            metadata: { method: dto.method },
        });
        return await transaction.save();
    }
    async processTopUpSuccess(transactionId, session) {
        const transaction = await this.transactionModel
            .findOne({ transactionId })
            .session(session || null);
        if (!transaction)
            throw new common_1.BadRequestException('Transaction not found');
        if (transaction.status !== interface_1.PaymentStatus.PENDING) {
            return transaction;
        }
        transaction.status = interface_1.PaymentStatus.PAID;
        const updatedTransaction = await transaction.save({ session });
        await this.walletModel.findOneAndUpdate({ _id: transaction.walletId }, { $inc: { depositBalance: transaction.amount } }, { session, new: true });
        return updatedTransaction;
    }
    async deductFunds(userId, amount, balanceType, referenceId, session) {
        const wallet = await this.getWallet(userId);
        const currentBalance = balanceType === wallet_interface_1.WalletBalanceType.DEPOSIT
            ? wallet.depositBalance
            : wallet.cashbackBalance;
        if (currentBalance < amount) {
            throw new common_1.BadRequestException(`Insufficient ${balanceType.toLowerCase()} balance`);
        }
        const updateField = balanceType === wallet_interface_1.WalletBalanceType.DEPOSIT
            ? 'depositBalance'
            : 'cashbackBalance';
        const updatedWallet = await this.walletModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { $inc: { [updateField]: -amount } }, { session, new: true });
        if (!updatedWallet) {
            throw new common_1.InternalServerErrorException('Failed to update wallet balance');
        }
        const transactionId = 'WLT-' + (0, payment_utils_1.generateTransactionId)().split('-')[1];
        const transaction = new this.transactionModel({
            walletId: updatedWallet._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            transactionId,
            amount,
            type: wallet_interface_1.WalletTransactionType.DEBIT,
            source: wallet_interface_1.WalletTransactionSource.ORDER_PAYMENT,
            balanceType,
            status: interface_1.PaymentStatus.PAID,
            description: balanceType === wallet_interface_1.WalletBalanceType.CASHBACK
                ? `Paid For Order (Cashback): ${referenceId}`
                : `Paid For Order: ${referenceId}`,
            referenceId,
        });
        return await transaction.save({ session });
    }
    async awardCashback(userId, amount, orderId, session) {
        const wallet = await this.getWallet(userId);
        const transactionId = 'WLT-' + (0, payment_utils_1.generateTransactionId)().split('-')[1];
        await this.walletModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { $inc: { cashbackBalance: amount } }, { session, new: true });
        const transaction = new this.transactionModel({
            walletId: wallet._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            transactionId,
            amount,
            type: wallet_interface_1.WalletTransactionType.CREDIT,
            source: wallet_interface_1.WalletTransactionSource.CASHBACK,
            balanceType: wallet_interface_1.WalletBalanceType.CASHBACK,
            status: interface_1.PaymentStatus.PAID,
            description: `Cashback For Order Id: ${orderId}`,
            referenceId: orderId,
        });
        return await transaction.save({ session });
    }
    async findAllTransactions(query, userId) {
        const paginateQueries = (0, helpers_1.pick)(query, [
            'page',
            'limit',
            'sortBy',
            'sortOrder',
        ]);
        const { searchTerm, type, balanceType, isSuccessOnly } = query;
        const filterQuery = {};
        if (userId)
            filterQuery.userId = new mongoose_2.Types.ObjectId(userId);
        if (type)
            filterQuery.type = type;
        if (balanceType)
            filterQuery.balanceType = balanceType;
        if (isSuccessOnly)
            filterQuery.status = interface_1.PaymentStatus.PAID;
        if (searchTerm) {
            filterQuery.description = { $regex: searchTerm, $options: 'i' };
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.transactionModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findAllWallets(query) {
        const { searchTerm, status, ...paginateQueries } = query;
        const filterQuery = {};
        if (status)
            filterQuery.status = status;
        if (searchTerm) {
            filterQuery.$or = [
                {
                    userId: mongoose_2.Types.ObjectId.isValid(searchTerm)
                        ? new mongoose_2.Types.ObjectId(searchTerm)
                        : null,
                },
            ].filter((f) => f.userId !== null);
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.walletModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async adjustBalance(userId, dto, adminId) {
        const wallet = await this.getWallet(userId);
        const { amount, type, balanceType, reason } = dto;
        const incrementAmount = type === wallet_interface_1.WalletTransactionType.CREDIT ? amount : -amount;
        const updateField = balanceType === wallet_interface_1.WalletBalanceType.DEPOSIT
            ? 'depositBalance'
            : 'cashbackBalance';
        if (type === wallet_interface_1.WalletTransactionType.DEBIT) {
            const currentBalance = balanceType === wallet_interface_1.WalletBalanceType.DEPOSIT
                ? wallet.depositBalance
                : wallet.cashbackBalance;
            if (currentBalance < amount) {
                throw new common_1.BadRequestException('Insufficient balance for adjustment');
            }
        }
        const updatedWallet = await this.walletModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { $inc: { [updateField]: incrementAmount } }, { new: true });
        if (!updatedWallet) {
            throw new common_1.InternalServerErrorException('Failed to update wallet balance');
        }
        const transaction = new this.transactionModel({
            walletId: updatedWallet._id,
            userId: new mongoose_2.Types.ObjectId(userId),
            transactionId: 'ADM-' + (0, payment_utils_1.generateTransactionId)().split('-')[1],
            amount,
            type,
            source: wallet_interface_1.WalletTransactionSource.ADMIN_ADJUSTMENT,
            balanceType,
            status: interface_1.PaymentStatus.PAID,
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
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(1, (0, mongoose_1.InjectModel)(wallet_transaction_schema_1.WalletTransaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WalletService);
//# sourceMappingURL=wallet.service.js.map