import { HydratedDocument, Types } from 'mongoose';
import { NotificationCategory, NotificationChannel, NotificationType } from '../interfaces/notification.interface';
export type NotificationDocument = HydratedDocument<Notification>;
export declare class Notification {
    _id: Types.ObjectId;
    recipient: Types.ObjectId;
    type: NotificationType;
    category: NotificationCategory;
    title: string;
    message: string;
    data: Record<string, any>;
    isRead: boolean;
    readAt?: Date;
    channels: NotificationChannel[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, import("mongoose").Document<unknown, any, Notification, any, {}> & Notification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
