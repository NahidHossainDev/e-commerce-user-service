import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatus } from 'src/common/interface';
import { Order } from 'src/modules/order-service/order/schemas/order.schema';
import {
  NotificationCategory,
  NotificationType,
} from './interfaces/notification.interface';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';

describe('NotificationListener', () => {
  let listener: NotificationListener;
  let notificationService: any;
  let orderModel: any;

  beforeEach(async () => {
    notificationService = {
      send: jest.fn().mockResolvedValue(undefined),
      sendEmailVerification: jest.fn().mockResolvedValue(true),
      sendPasswordReset: jest.fn().mockResolvedValue(true),
    };

    orderModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationListener,
        {
          provide: NotificationService,
          useValue: notificationService,
        },
        {
          provide: getModelToken(Order.name),
          useValue: orderModel,
        },
      ],
    }).compile();

    listener = module.get<NotificationListener>(NotificationListener);
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleOrderCreatedEvent', () => {
    it('should create order placed notification', async () => {
      const event = {
        orderId: 'ORD-1001',
        userId: 'user-123',
        items: [{ productId: 'p1', name: 'Item 1', quantity: 1 }],
        totalAmount: 100,
        payableAmount: 100,
        timestamp: new Date(),
      };

      await listener.handleOrderCreatedEvent(event);

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          type: NotificationType.TRANSACTIONAL,
          category: NotificationCategory.ORDER_PLACED,
          title: 'Order Placed Successfully',
        }),
      );
    });
  });

  describe('handlePaymentCompletedEvent', () => {
    it('should create payment success notification', async () => {
      const event: any = {
        paymentId: 'pay-1',
        transactionId: 'tx-1',
        orderId: 'ORD-1001',
        userId: 'user-123',
        amount: 100,
        method: 'STRIPE',
        paidAt: new Date(),
      };

      await listener.handlePaymentCompletedEvent(event);

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          type: NotificationType.TRANSACTIONAL,
          category: NotificationCategory.PAYMENT_SUCCESS,
          title: 'Payment Successful',
        }),
      );
    });
  });

  describe('handleOrderStatusUpdatedEvent', () => {
    it('should create order confirmed notification', async () => {
      await listener.handleOrderStatusUpdatedEvent({
        orderId: 'ORD-1001',
        userId: 'user-123',
        status: OrderStatus.CONFIRMED,
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          category: NotificationCategory.ORDER_CONFIRMED,
          title: 'Order Confirmed',
        }),
      );
    });

    it('should create order shipped notification', async () => {
      await listener.handleOrderStatusUpdatedEvent({
        orderId: 'ORD-1001',
        userId: 'user-123',
        status: OrderStatus.SHIPPED,
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          category: NotificationCategory.ORDER_SHIPPED,
        }),
      );
    });

    it('should create order delivered notification', async () => {
      await listener.handleOrderStatusUpdatedEvent({
        orderId: 'ORD-1001',
        userId: 'user-123',
        status: OrderStatus.DELIVERED,
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          category: NotificationCategory.ORDER_DELIVERED,
        }),
      );
    });

    it('should create order cancelled notification', async () => {
      await listener.handleOrderStatusUpdatedEvent({
        orderId: 'ORD-1001',
        userId: 'user-123',
        status: OrderStatus.CANCELLED,
        reason: 'Customer requested',
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          category: NotificationCategory.ORDER_CANCELLED,
          title: 'Order Cancelled',
        }),
      );
    });

    it('should fetch order recipient if userId is not in event', async () => {
      orderModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ userId: 'user-fetched' }),
      });

      await listener.handleOrderStatusUpdatedEvent({
        orderId: 'ORD-999',
        status: OrderStatus.CONFIRMED,
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-fetched',
          category: NotificationCategory.ORDER_CONFIRMED,
        }),
      );
    });
  });

  describe('handleRefundCompletedEvent', () => {
    it('should create refund processed notification', async () => {
      await listener.handleRefundCompletedEvent({
        refundId: 'REF-100',
        userId: 'user-123',
        amount: 50,
      });

      expect(notificationService.send).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-123',
          category: NotificationCategory.REFUND_PROCESSED,
          title: 'Refund Processed',
        }),
      );
    });
  });
});
