import { UserRole } from 'src/common/interface';
import { NotificationCategory, NotificationChannel, NotificationType } from '../interfaces/notification.interface';
export declare enum NotificationTargetType {
    ALL = "ALL",
    SPECIFIC_USERS = "SPECIFIC_USERS",
    USER_GROUP = "USER_GROUP"
}
export declare class AdminSendNotificationDto {
    targetType: NotificationTargetType;
    userIds?: string[];
    userGroup?: UserRole;
    title: string;
    message: string;
    type?: NotificationType;
    category?: NotificationCategory;
    data?: Record<string, any>;
    channels?: NotificationChannel[];
}
