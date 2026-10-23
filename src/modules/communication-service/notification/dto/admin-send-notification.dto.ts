import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserRole } from 'src/common/interface';
import {
  NotificationCategory,
  NotificationChannel,
  NotificationType,
} from '../interfaces/notification.interface';

export enum NotificationTargetType {
  ALL = 'ALL',
  SPECIFIC_USERS = 'SPECIFIC_USERS',
  USER_GROUP = 'USER_GROUP',
}

export class AdminSendNotificationDto {
  @ApiProperty({
    enum: NotificationTargetType,
    description: 'Target audience type',
    example: NotificationTargetType.ALL,
  })
  @IsEnum(NotificationTargetType)
  targetType: NotificationTargetType;

  @ApiPropertyOptional({
    description: 'List of target user IDs (required when targetType is SPECIFIC_USERS)',
    type: [String],
    example: ['65b2a1e0...'],
  })
  @ValidateIf((o) => o.targetType === NotificationTargetType.SPECIFIC_USERS)
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds?: string[];

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Target user role/group (required when targetType is USER_GROUP)',
    example: UserRole.CUSTOMER,
  })
  @ValidateIf((o) => o.targetType === NotificationTargetType.USER_GROUP)
  @IsEnum(UserRole)
  userGroup?: UserRole;

  @ApiProperty({ description: 'Notification title', example: 'Flash Sale Alert! 🎉' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification body message',
    example: 'Get up to 50% off on all electronics this weekend only!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    enum: NotificationType,
    default: NotificationType.MARKETING,
    description: 'Notification type (MARKETING or SYSTEM)',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.MARKETING;

  @ApiPropertyOptional({
    enum: NotificationCategory,
    default: NotificationCategory.MARKETING,
    description: 'Notification category',
  })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory = NotificationCategory.MARKETING;

  @ApiPropertyOptional({
    description: 'Arbitrary key-value metadata payload for deep links/action buttons',
    example: { url: '/sale', promoCode: 'WEEKEND50' },
  })
  @IsOptional()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    enum: NotificationChannel,
    isArray: true,
    default: [NotificationChannel.IN_APP],
    description: 'Target delivery channels',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[] = [NotificationChannel.IN_APP];
}
