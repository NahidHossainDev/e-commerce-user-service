import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

// --- Order DTOs ---
export class CheckoutDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  couponCode?: string;

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
