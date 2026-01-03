import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../schemas/order.schema';

// --- Order DTOs ---

export class PaymentIntentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsBoolean()
  useWallet?: boolean;

  @IsOptional()
  @IsBoolean()
  useCashback?: boolean;
}

export class ApplyCouponDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class CheckoutDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty()
  @Type(() => PaymentIntentDto)
  @ValidateNested()
  paymentIntent: PaymentIntentDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  couponId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  failureReason?: string;
}

export class CancelOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
