import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { PaymentMethod } from 'src/common/interface';
import { WalletBalanceType, WalletStatus, WalletTransactionType } from '../interface/wallet.interface';
export declare class TopUpRequestDto {
    amount: number;
    method: PaymentMethod;
    description?: string;
}
export declare class WalletTransactionQueryDto extends QueryOptions {
    type?: WalletTransactionType;
    balanceType?: WalletBalanceType;
    isSuccessOnly?: boolean;
    searchTerm?: string;
}
export declare class AdminWalletQueryDto extends QueryOptions {
    searchTerm?: string;
    status?: WalletStatus;
}
export declare class BalanceAdjustmentDto {
    amount: number;
    type: WalletTransactionType;
    balanceType: WalletBalanceType;
    reason: string;
}
