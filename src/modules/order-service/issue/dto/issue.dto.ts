import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  Issue,
  IssuePriority,
  IssueStatus,
  IssueType,
  ResolutionAction,
} from '../schemas/issue.schema';

export class IssueItemDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ example: 'Wireless Headphones' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'SKU-123-WH' })
  @IsString()
  @IsOptional()
  variantSku?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ example: 'Broken seal on box' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateIssueDto {
  @ApiProperty({
    example: '64b1f2c3d4e5f6a7b8c9d0e1',
    description: 'The order ID the issue relates to',
  })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    enum: IssueType,
    example: IssueType.DAMAGED_PACKAGE,
    description: 'Type / category of the issue',
  })
  @IsEnum(IssueType)
  @IsNotEmpty()
  type: IssueType;

  @ApiProperty({
    example: 'Package arrived torn open',
    description: 'Brief headline of the issue',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({
    example: 'Courier delivered parcel with ripped seal and 1 item missing.',
    description: 'Detailed description of the issue',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  description: string;

  @ApiPropertyOptional({
    enum: IssuePriority,
    example: IssuePriority.MEDIUM,
  })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiPropertyOptional({ type: [IssueItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IssueItemDto)
  @IsOptional()
  items?: IssueItemDto[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/box1.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}

export class UpdateIssueStatusDto {
  @ApiProperty({ enum: IssueStatus, example: IssueStatus.IN_PROGRESS })
  @IsEnum(IssueStatus)
  @IsNotEmpty()
  status: IssueStatus;

  @ApiPropertyOptional({
    example: 'Assigned to logistics team for courier review',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ResolveIssueDto {
  @ApiProperty({
    example:
      'Customer was refunded for damaged item and replacement coupon sent',
    description: 'Detailed description of how the issue was resolved',
  })
  @IsString()
  @IsNotEmpty()
  resolutionNotes: string;

  @ApiPropertyOptional({
    enum: ResolutionAction,
    example: ResolutionAction.REPLACEMENT_SENT,
  })
  @IsEnum(ResolutionAction)
  @IsOptional()
  resolutionAction?: ResolutionAction;

  @ApiPropertyOptional({
    example: 'Customer acknowledged and agreed via phone',
  })
  @IsString()
  @IsOptional()
  internalNotes?: string;
}

export class AddIssueNoteDto {
  @ApiProperty({
    example: 'Spoke with delivery agent, confirmed accident during transport',
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}

export class IssueQueryOptionsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by issue number, subject, or orderId',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: IssueStatus })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiPropertyOptional({ enum: IssueType })
  @IsOptional()
  @IsEnum(IssueType)
  type?: IssueType;

  @ApiPropertyOptional({ enum: IssuePriority })
  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @ApiPropertyOptional({ description: 'Filter by specific order ID' })
  @IsOptional()
  @IsMongoId()
  orderId?: string;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class PaginatedIssueResponseDto {
  @ApiProperty({ type: [Issue] })
  data: Issue[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
