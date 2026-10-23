import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { User } from 'src/modules/user-service/user/user.schema';
import { AdminSendNotificationDto, NotificationTargetType } from './dto';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';
import {
  NotificationCategory,
  NotificationChannel,
  NotificationType,
} from './interfaces/notification.interface';
import { NotificationService } from './notification.service';
import { InAppChannelHandler } from './providers/in-app-channel.handler';
import { Notification } from './schemas/notification.schema';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationModel: any;
  let userModel: any;
  let inAppChannelHandler: any;
  let emailProvider: any;

  const mockUserId = new Types.ObjectId().toString();
  const mockNotificationId = new Types.ObjectId().toString();

  beforeEach(async () => {
    notificationModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      updateMany: jest.fn(),
      deleteOne: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      insertMany: jest.fn(),
    };

    userModel = {
      find: jest.fn(),
    };

    inAppChannelHandler = {
      send: jest.fn(),
    };

    emailProvider = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken(Notification.name),
          useValue: notificationModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: InAppChannelHandler,
          useValue: inAppChannelHandler,
        },
        {
          provide: EMAIL_PROVIDER,
          useValue: emailProvider,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should dispatch to in-app channel handler by default', async () => {
      const payload = {
        recipientId: mockUserId,
        title: 'Test Title',
        message: 'Test Message',
        type: NotificationType.TRANSACTIONAL,
        category: NotificationCategory.ORDER_PLACED,
      };

      await service.send(payload);

      expect(inAppChannelHandler.send).toHaveBeenCalledWith(payload);
    });

    it('should dispatch across multiple channels if specified', async () => {
      const payload = {
        recipientId: mockUserId,
        title: 'Multi-Channel Alert',
        message: 'Alert message',
        type: NotificationType.TRANSACTIONAL,
        category: NotificationCategory.ORDER_PLACED,
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      };

      await service.send(payload);
      expect(inAppChannelHandler.send).toHaveBeenCalledWith(payload);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      notificationModel.countDocuments.mockResolvedValue(5);

      const result = await service.getUnreadCount(mockUserId);
      expect(result).toEqual({ unreadCount: 5 });
      expect(notificationModel.countDocuments).toHaveBeenCalledWith({
        recipient: new Types.ObjectId(mockUserId),
        isRead: false,
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark single notification as read', async () => {
      const mockDoc = { _id: mockNotificationId, isRead: true };
      notificationModel.findOneAndUpdate.mockResolvedValue(mockDoc);

      const result = await service.markAsRead(mockUserId, mockNotificationId);
      expect(result).toEqual(mockDoc);
      expect(notificationModel.findOneAndUpdate).toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      notificationModel.updateMany.mockResolvedValue({ modifiedCount: 3 });

      const result = await service.markAllAsRead(mockUserId);
      expect(result).toEqual({ modifiedCount: 3 });
      expect(notificationModel.updateMany).toHaveBeenCalledWith(
        {
          recipient: new Types.ObjectId(mockUserId),
          isRead: false,
        },
        expect.objectContaining({
          $set: expect.objectContaining({ isRead: true }),
        }),
      );
    });
  });

  describe('adminSendNotification', () => {
    it('should broadcast to all users when targetType is ALL', async () => {
      const user1 = { _id: new Types.ObjectId() };
      const user2 = { _id: new Types.ObjectId() };
      userModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([user1, user2]),
      });
      notificationModel.insertMany.mockResolvedValue([]);

      const dto: AdminSendNotificationDto = {
        targetType: NotificationTargetType.ALL,
        title: 'Flash Sale!',
        message: 'Save 20% today!',
        type: NotificationType.MARKETING,
      };

      const result = await service.adminSendNotification(dto, 'admin-id');
      expect(result.success).toBe(true);
      expect(result.sentCount).toBe(2);
      expect(notificationModel.insertMany).toHaveBeenCalled();
    });

    it('should send to specific users when targetType is SPECIFIC_USERS', async () => {
      notificationModel.insertMany.mockResolvedValue([]);

      const id1 = new Types.ObjectId().toString();
      const id2 = new Types.ObjectId().toString();

      const dto: AdminSendNotificationDto = {
        targetType: NotificationTargetType.SPECIFIC_USERS,
        userIds: [id1, id2],
        title: 'Exclusive Offer',
        message: 'For you only',
      };

      const result = await service.adminSendNotification(dto, 'admin-id');
      expect(result.success).toBe(true);
      expect(result.sentCount).toBe(2);
      expect(notificationModel.insertMany).toHaveBeenCalled();
    });
  });
});
