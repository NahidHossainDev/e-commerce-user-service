import { Model } from 'mongoose';
import { INotificationChannelHandler, INotificationPayload, NotificationChannel } from '../interfaces/notification.interface';
import { NotificationDocument } from '../schemas/notification.schema';
export declare class InAppChannelHandler implements INotificationChannelHandler {
    private readonly notificationModel;
    readonly channel = NotificationChannel.IN_APP;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>);
    send(payload: INotificationPayload): Promise<void>;
}
