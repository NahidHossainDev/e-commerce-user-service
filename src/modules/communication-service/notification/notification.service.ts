import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import {
  AccountStatus,
  User,
  UserDocument,
} from 'src/modules/user-service/user/user.schema';
import { paginationHelpers } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import {
  AdminNotificationQueryDto,
  AdminSendNotificationDto,
  NotificationQueryDto,
  NotificationTargetType,
} from './dto';
import {
  EMAIL_PROVIDER,
  EmailProvider,
} from './interfaces/email-provider.interface';
import {
  INotificationPayload,
  NotificationChannel,
  NotificationType,
} from './interfaces/notification.interface';
import { InAppChannelHandler } from './providers/in-app-channel.handler';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { verifyEmailTemplate } from './templates/verify-email.template';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProvider,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly inAppChannelHandler: InAppChannelHandler,
  ) {}

  /**
   * Dispatches a notification across specified channels.
   * Phase 1 delivers via In-App. Designed so Email, Push, and SMS handlers can be added seamlessly.
   */
  async send(payload: INotificationPayload): Promise<void> {
    const channels = payload.channels?.length
      ? payload.channels
      : [NotificationChannel.IN_APP];

    for (const channel of channels) {
      switch (channel) {
        case NotificationChannel.IN_APP:
          await this.inAppChannelHandler.send(payload);
          break;
        case NotificationChannel.EMAIL:
          // Phase 2 placeholder: extensible for email notifications
          this.logger.debug(
            `[Email Channel Placeholder] Recipient: ${payload.recipientId} | Subject: ${payload.title}`,
          );
          break;
        case NotificationChannel.PUSH:
          // Phase 2 placeholder: extensible for push notifications
          this.logger.debug(
            `[Push Channel Placeholder] Recipient: ${payload.recipientId} | Title: ${payload.title}`,
          );
          break;
        case NotificationChannel.SMS:
          // Phase 2 placeholder: extensible for SMS notifications
          this.logger.debug(
            `[SMS Channel Placeholder] Recipient: ${payload.recipientId} | Message: ${payload.message}`,
          );
          break;
      }
    }
  }

  // ============================================================================
  // User / Public Notification Methods
  // ============================================================================

  async findAllForUser(
    userId: string,
    query: NotificationQueryDto,
  ): Promise<IPaginatedResponse<NotificationDocument>> {
    const paginationQuery = paginationHelpers.calculatePagination(query);

    const filterQuery: FilterQuery<NotificationDocument> = {
      recipient: new Types.ObjectId(userId),
    };

    if (query.isRead !== undefined) {
      filterQuery.isRead = query.isRead;
    }

    if (query.type) {
      filterQuery.type = query.type;
    }

    if (query.category) {
      filterQuery.category = query.category;
    }

    if (query.searchTerm) {
      filterQuery.$or = [
        { title: { $regex: query.searchTerm, $options: 'i' } },
        { message: { $regex: query.searchTerm, $options: 'i' } },
      ];
    }

    return getPaginatedData<NotificationDocument>({
      model: this.notificationModel,
      paginationQuery,
      filterQuery,
    });
  }

  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const unreadCount = await this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      isRead: false,
    });

    return { unreadCount };
  }

  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<NotificationDocument> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('Invalid notification ID');
    }

    const notification = await this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        recipient: new Types.ObjectId(userId),
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      {
        recipient: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    return { modifiedCount: result.modifiedCount };
  }

  async deleteForUser(
    userId: string,
    notificationId: string,
  ): Promise<{ success: boolean }> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('Invalid notification ID');
    }

    const result = await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      recipient: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notification not found');
    }

    return { success: true };
  }

  // ============================================================================
  // Admin Notification Methods (Marketing & Broadcast)
  // ============================================================================

  async adminSendNotification(
    dto: AdminSendNotificationDto,
    sentByAdminId?: string,
  ): Promise<{ success: boolean; sentCount: number }> {
    let recipientIds: Types.ObjectId[] = [];

    switch (dto.targetType) {
      case NotificationTargetType.ALL: {
        const users = await this.userModel
          .find(
            {
              accountStatus: {
                $nin: [AccountStatus.DELETED, AccountStatus.BLOCKED],
              },
            },
            { _id: 1 },
          )
          .lean();
        recipientIds = users.map((u) => u._id);
        break;
      }

      case NotificationTargetType.SPECIFIC_USERS: {
        if (!dto.userIds || dto.userIds.length === 0) {
          throw new BadRequestException(
            'userIds must not be empty for SPECIFIC_USERS target',
          );
        }
        recipientIds = dto.userIds
          .filter((id) => Types.ObjectId.isValid(id))
          .map((id) => new Types.ObjectId(id));
        break;
      }

      case NotificationTargetType.USER_GROUP: {
        if (!dto.userGroup) {
          throw new BadRequestException(
            'userGroup must be specified for USER_GROUP target',
          );
        }
        const users = await this.userModel
          .find(
            {
              'roles.type': dto.userGroup,
              accountStatus: {
                $nin: [AccountStatus.DELETED, AccountStatus.BLOCKED],
              },
            },
            { _id: 1 },
          )
          .lean();
        recipientIds = users.map((u) => u._id);
        break;
      }
    }

    if (recipientIds.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const type = dto.type || NotificationType.MARKETING;
    const channels = dto.channels || [NotificationChannel.IN_APP];
    const metadata = {
      sentByAdminId,
      targetType: dto.targetType,
      userGroup: dto.userGroup,
    };

    // Bulk insert notifications in batches for performance
    const BATCH_SIZE = 500;
    const documents = recipientIds.map((recipientId) => ({
      recipient: recipientId,
      type,
      category: dto.category,
      title: dto.title,
      message: dto.message,
      data: dto.data || {},
      channels,
      metadata,
      isRead: false,
    }));

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      await this.notificationModel.insertMany(batch);
    }

    this.logger.log(
      `Admin broadcast notification sent to ${recipientIds.length} recipients.`,
    );

    return { success: true, sentCount: recipientIds.length };
  }

  async adminFindAll(
    query: AdminNotificationQueryDto,
  ): Promise<IPaginatedResponse<NotificationDocument>> {
    const paginationQuery = paginationHelpers.calculatePagination(query);

    const filterQuery: FilterQuery<NotificationDocument> = {};

    if (query.recipientId) {
      filterQuery.recipient = new Types.ObjectId(query.recipientId);
    }

    if (query.isRead !== undefined) {
      filterQuery.isRead = query.isRead;
    }

    if (query.type) {
      filterQuery.type = query.type;
    }

    if (query.category) {
      filterQuery.category = query.category;
    }

    if (query.searchTerm) {
      filterQuery.$or = [
        { title: { $regex: query.searchTerm, $options: 'i' } },
        { message: { $regex: query.searchTerm, $options: 'i' } },
      ];
    }

    return getPaginatedData<NotificationDocument>({
      model: this.notificationModel,
      paginationQuery,
      filterQuery,
      populate: {
        path: 'recipient',
        select: 'fullName email phone primaryRole',
      },
    });
  }

  async adminGetStats(): Promise<{
    total: number;
    totalUnread: number;
    transactional: number;
    marketing: number;
    system: number;
  }> {
    const [total, totalUnread, transactional, marketing, system] =
      await Promise.all([
        this.notificationModel.countDocuments(),
        this.notificationModel.countDocuments({ isRead: false }),
        this.notificationModel.countDocuments({
          type: NotificationType.TRANSACTIONAL,
        }),
        this.notificationModel.countDocuments({
          type: NotificationType.MARKETING,
        }),
        this.notificationModel.countDocuments({
          type: NotificationType.SYSTEM,
        }),
      ]);

    return {
      total,
      totalUnread,
      transactional,
      marketing,
      system,
    };
  }

  async adminDelete(notificationId: string): Promise<{ success: boolean }> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new BadRequestException('Invalid notification ID');
    }

    const result =
      await this.notificationModel.findByIdAndDelete(notificationId);
    if (!result) {
      throw new NotFoundException('Notification not found');
    }

    return { success: true };
  }

  // ============================================================================
  // Legacy / Channel Email Dispatchers (Verification, Password Reset, SMS)
  // ============================================================================

  async sendEmailVerification(email: string, token: string, name: string) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
      const template = verifyEmailTemplate({
        name,
        token,
        url: verificationUrl,
      });

      await this.emailProvider.send({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return true;
    } catch (error) {
      this.logger.error(`Failed to send email verification to ${email}`, error);
      throw error;
    }
  }

  async sendPasswordReset(email: string, token: string, name: string) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      const template = resetPasswordTemplate({
        name,
        url: resetUrl,
      });

      await this.emailProvider.send({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error,
      );
      throw error;
    }
  }

  sendPhoneVerification(phoneNumber: string, token: string) {
    this.logger.log(
      `[SMS] To: ${phoneNumber} | Message: Your verification code is ${token}`,
    );
    return true;
  }
}
