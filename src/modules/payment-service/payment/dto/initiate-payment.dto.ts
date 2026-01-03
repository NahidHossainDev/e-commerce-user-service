import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentMethod } from 'src/common/interface';

export class InitiatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string; // The user initiating the payment

  @IsMongoId()
  @IsNotEmpty()
  orderId: string; // The order this payment is for

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
