import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  RefundMethod,
  RefundReason,
  RefundStatus,
  RefundType,
} from '../schemas/refund.schema';

// --- Refund Item DTO ---
export class RefundItemDto {
  @ApiProperty({ description: 'Product ID to refund' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'Variant SKU if applicable' })
  @IsString()
  @IsOptional()
  variantSku?: string;

  @ApiProperty({ description: 'Quantity to refund', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Item-specific refund reason' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}

// --- Refund Evidence DTO ---
export class RefundEvidenceDto {
  @ApiPropertyOptional({
    description: 'Image URLs as evidence',
    type: [String],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Video URLs as evidence',
    type: [String],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  videos?: string[];

  @ApiPropertyOptional({ description: 'Detailed description of the issue' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Supporting document URLs',
    type: [String],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  documents?: string[];
}

// --- Create Refund Request DTO ---
export class CreateRefundRequestDto {
  @ApiProperty({ description: 'Order ID to refund' })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Type of refund',
    enum: RefundType,
    example: RefundType.FULL,
  })
  @IsEnum(RefundType)
  refundType: RefundType;

  @ApiProperty({
    description: 'Reason for refund',
    enum: RefundReason,
    example: RefundReason.DAMAGED_PRODUCT,
  })
  @IsEnum(RefundReason)
  reason: RefundReason;

  @ApiPropertyOptional({ description: 'Additional details about the reason' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  reasonDetails?: string;

  @ApiPropertyOptional({
    description: 'Items to refund (required for PARTIAL refunds)',
    type: [RefundItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundItemDto)
  @ArrayMinSize(1)
  @IsOptional()
  items?: RefundItemDto[];

  @ApiPropertyOptional({
    description: 'Preferred refund method',
    enum: RefundMethod,
    example: RefundMethod.ORIGINAL_PAYMENT,
  })
  @IsEnum(RefundMethod)
  @IsOptional()
  refundMethod?: RefundMethod;

  @ApiPropertyOptional({
    description: 'Evidence supporting the refund request',
    type: RefundEvidenceDto,
  })
  @ValidateNested()
  @Type(() => RefundEvidenceDto)
  @IsOptional()
  evidence?: RefundEvidenceDto;
}

// --- Admin Approve/Reject Refund DTO ---
export class AdminRefundActionDto {
  @ApiProperty({
    description: 'Action to take',
    enum: ['APPROVE', 'REJECT'],
    example: 'APPROVE',
  })
  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @ApiPropertyOptional({ description: 'Admin note/comment' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  note?: string;

  @ApiPropertyOptional({
    description: 'Rejection reason (required if action is REJECT)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Whether to restore stock',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  restoreStock?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to restore coupon',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  restoreCoupon?: boolean;
}

// --- Process Refund DTO (Admin initiates payment) ---
export class ProcessRefundDto {
  @ApiPropertyOptional({ description: 'Processing fee to deduct' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  processingFee?: number;

  @ApiPropertyOptional({ description: 'Restocking fee to deduct' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  restockingFee?: number;

  @ApiPropertyOptional({ description: 'Admin note' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  note?: string;
}

// --- Update Refund Status DTO ---
export class UpdateRefundStatusDto {
  @ApiProperty({
    description: 'New refund status',
    enum: RefundStatus,
  })
  @IsEnum(RefundStatus)
  status: RefundStatus;

  @ApiPropertyOptional({ description: 'Note about status change' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;

  @ApiPropertyOptional({ description: 'Failure reason (if status is FAILED)' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  failureReason?: string;
}

// --- Add Admin Note DTO ---
export class AddRefundNoteDto {
  @ApiProperty({ description: 'Internal note to add' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  note: string;
}

// --- Cancel Refund Request DTO ---
export class CancelRefundRequestDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  cancellationReason?: string;
}
