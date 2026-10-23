import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { QueryOptions } from 'src/common/dto';
import {
  NotificationCategory,
  NotificationType,
} from '../interfaces/notification.interface';

export class NotificationQueryDto extends QueryOptions {
  @ApiPropertyOptional({ description: 'Filter by read status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({ enum: NotificationType, description: 'Filter by notification type' })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    enum: NotificationCategory,
    description: 'Filter by notification category',
  })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @ApiPropertyOptional({ description: 'Search in title or message' })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}

export class AdminNotificationQueryDto extends NotificationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by recipient user ID' })
  @IsOptional()
  @IsMongoId()
  recipientId?: string;
}
