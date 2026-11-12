import { UserDocument } from 'src/modules/user-service/user/user.schema';
import { NotificationQueryDto } from '../dto';
import { NotificationService } from '../notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(user: UserDocument, query: NotificationQueryDto): Promise<import("../../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    getUnreadCount(user: UserDocument): Promise<{
        unreadCount: number;
    }>;
    markAsRead(user: UserDocument, id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markAllAsRead(user: UserDocument): Promise<{
        modifiedCount: number;
    }>;
    deleteForUser(user: UserDocument, id: string): Promise<{
        success: boolean;
    }>;
}
