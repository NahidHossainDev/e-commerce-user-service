import { ClientSession, Model } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { AdminWalletQueryDto, BalanceAdjustmentDto, TopUpRequestDto, WalletTransactionQueryDto } from './dto/wallet.dto';
import { WalletBalanceType } from './interface/wallet.interface';
import { WalletTransactionDocument } from './schemas/wallet-transaction.schema';
import { WalletDocument } from './schemas/wallet.schema';
export declare class WalletService {
    private walletModel;
    private transactionModel;
    constructor(walletModel: Model<WalletDocument>, transactionModel: Model<WalletTransactionDocument>);
    getWallet(userId: string): Promise<WalletDocument>;
    getWalletSummary(userId: string): Promise<{
        depositAmount: number;
        cashbackEarned: number;
        totalBalance: number;
    }>;
    requestTopUp(userId: string, dto: TopUpRequestDto): Promise<WalletTransactionDocument>;
    processTopUpSuccess(transactionId: string, session?: ClientSession): Promise<WalletTransactionDocument>;
    deductFunds(userId: string, amount: number, balanceType: WalletBalanceType, referenceId: string, session: ClientSession): Promise<WalletTransactionDocument>;
    awardCashback(userId: string, amount: number, orderId: string, session?: ClientSession): Promise<WalletTransactionDocument>;
    findAllTransactions(query: WalletTransactionQueryDto, userId?: string): Promise<IPaginatedResponse<WalletTransactionDocument>>;
    findAllWallets(query: AdminWalletQueryDto): Promise<IPaginatedResponse<WalletDocument>>;
    adjustBalance(userId: string, dto: BalanceAdjustmentDto, adminId: string): Promise<WalletTransactionDocument>;
    getAdminWalletStats(): Promise<{
        walletSummary: any;
        transactionSummary: any[];
    }>;
}
