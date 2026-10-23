import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  INotificationChannelHandler,
  INotificationPayload,
  NotificationChannel,
} from '../interfaces/notification.interface';
import {
  Notification,
  NotificationDocument,
} from '../schemas/notification.schema';

@Injectable()
export class InAppChannelHandler implements INotificationChannelHandler {
  readonly channel = NotificationChannel.IN_APP;
  private readonly logger = new Logger(InAppChannelHandler.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async send(payload: INotificationPayload): Promise<void> {
    try {
      await this.notificationModel.create({
        recipient: new Types.ObjectId(payload.recipientId),
        type: payload.type,
        category: payload.category,
        title: payload.title,
        message: payload.message,
        data: payload.data || {},
        channels: payload.channels || [NotificationChannel.IN_APP],
        metadata: payload.metadata || {},
      });
    } catch (error) {
      this.logger.error(
        `Failed to store in-app notification for recipient ${payload.recipientId}:`,
        error,
      );
      throw error;
    }
  }
}
