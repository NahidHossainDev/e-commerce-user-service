import { IAuthUser } from 'src/common/interface';
import { AdminWalletQueryDto, BalanceAdjustmentDto, WalletTransactionQueryDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';
export declare class AdminWalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getSummary(): Promise<{
        walletSummary: any;
        transactionSummary: any[];
    }>;
    findAll(query: AdminWalletQueryDto): Promise<import("src/common/interface").IPaginatedResponse<import("./schemas/wallet.schema").WalletDocument>>;
    findAllTransactions(query: WalletTransactionQueryDto): Promise<import("src/common/interface").IPaginatedResponse<import("./schemas/wallet-transaction.schema").WalletTransactionDocument>>;
    findOne(userId: string): Promise<{
        depositAmount: number;
        cashbackEarned: number;
        totalBalance: number;
    }>;
    adjustBalance(userId: string, dto: BalanceAdjustmentDto, admin: IAuthUser): Promise<import("./schemas/wallet-transaction.schema").WalletTransactionDocument>;
}
