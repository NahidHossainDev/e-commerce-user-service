import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { PaymentMethod } from 'src/common/interface';
import {
  WalletBalanceType,
  WalletStatus,
  WalletTransactionType,
} from '../interface/wallet.interface';

export class TopUpRequestDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsOptional()
  description?: string;
}

export class WalletTransactionQueryDto extends QueryOptions {
  @IsEnum(WalletTransactionType)
  @IsOptional()
  type?: WalletTransactionType;

  @IsEnum(WalletBalanceType)
  @IsOptional()
  balanceType?: WalletBalanceType;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isSuccessOnly?: boolean;

  @IsString()
  @IsOptional()
  searchTerm?: string;
}

export class AdminWalletQueryDto extends QueryOptions {
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsEnum(WalletStatus)
  @IsOptional()
  status?: WalletStatus;
}

export class BalanceAdjustmentDto {
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @IsEnum(WalletTransactionType)
  @IsNotEmpty()
  type: WalletTransactionType;

  @IsEnum(WalletBalanceType)
  @IsNotEmpty()
  balanceType: WalletBalanceType;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
