import { IAuthUser } from 'src/common/interface';
import { TopUpRequestDto, WalletTransactionQueryDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getSummary(user: IAuthUser): Promise<{
        depositAmount: number;
        cashbackEarned: number;
        totalBalance: number;
    }>;
    requestTopUp(user: IAuthUser, dto: TopUpRequestDto): Promise<import("./schemas/wallet-transaction.schema").WalletTransactionDocument>;
    getTransactions(user: IAuthUser, query: WalletTransactionQueryDto): Promise<import("src/common/interface").IPaginatedResponse<import("./schemas/wallet-transaction.schema").WalletTransactionDocument>>;
}
