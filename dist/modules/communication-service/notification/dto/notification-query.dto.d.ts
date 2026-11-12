import { QueryOptions } from 'src/common/dto';
import { NotificationCategory, NotificationType } from '../interfaces/notification.interface';
export declare class NotificationQueryDto extends QueryOptions {
    isRead?: boolean;
    type?: NotificationType;
    category?: NotificationCategory;
    searchTerm?: string;
}
export declare class AdminNotificationQueryDto extends NotificationQueryDto {
    recipientId?: string;
}
