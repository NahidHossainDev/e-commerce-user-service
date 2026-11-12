import { UserDocument } from 'src/modules/user-service/user/user.schema';
import { AdminNotificationQueryDto, AdminSendNotificationDto } from '../dto';
import { NotificationService } from '../notification.service';
export declare class AdminNotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(user: UserDocument, dto: AdminSendNotificationDto): Promise<{
        success: boolean;
        sentCount: number;
    }>;
    findAll(query: AdminNotificationQueryDto): Promise<import("src/common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    getStats(): Promise<{
        total: number;
        totalUnread: number;
        transactional: number;
        marketing: number;
        system: number;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
