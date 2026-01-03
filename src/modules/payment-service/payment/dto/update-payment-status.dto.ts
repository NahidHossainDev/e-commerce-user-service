import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatus } from 'src/common/interface';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  reason: string; // Audit reason for manual update
}
