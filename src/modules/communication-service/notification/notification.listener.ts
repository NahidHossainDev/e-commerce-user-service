import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderCreatedEvent,
  OrderEvents,
} from 'src/common/events/order.events';
import { OrderStatus } from 'src/common/interface';
import {
  Order,
  OrderDocument,
} from 'src/modules/order-service/order/schemas/order.schema';
import { REFUND_NOTIFICATION_EVENTS } from 'src/modules/order-service/refund/constants/refund.constants';
import {
  PaymentCompletedEvent,
  PaymentEvents,
} from 'src/modules/payment-service/payment/payment.events';
import {
  AUTH_EVENTS,
  PasswordResetRequestedEvent,
  UserRegisteredEvent,
  UserResendVerificationEvent,
} from '../../user-service/auth/events/auth.events';
import {
  NotificationCategory,
  NotificationType,
} from './interfaces/notification.interface';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  // ============================================================================
  // Transactional Notifications: Orders
  // ============================================================================

  @OnEvent(OrderEvents.ORDER_CREATED)
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.logger.log(`Handling order created notification for order: ${event.orderId}`);
    try {
      await this.notificationService.send({
        recipientId: event.userId,
        type: NotificationType.TRANSACTIONAL,
        category: NotificationCategory.ORDER_PLACED,
        title: 'Order Placed Successfully',
        message: `Your order #${event.orderId} of amount $${event.payableAmount} has been placed successfully.`,
        data: {
          orderId: event.orderId,
          payableAmount: event.payableAmount,
          totalAmount: event.totalAmount,
          itemCount: event.items?.length,
          url: `/orders/${event.orderId}`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order placed notification for order ${event.orderId}:`,
        error,
      );
    }
  }

  @OnEvent(OrderEvents.ORDER_STATUS_UPDATED)
  async handleOrderStatusUpdatedEvent(event: {
    orderId: string;
    userId?: string;
    status: OrderStatus;
    reason?: string;
  }) {
    this.logger.log(
      `Handling order status updated event for order: ${event.orderId} -> ${event.status}`,
    );

    try {
      let recipientId = event.userId;
      if (!recipientId) {
        const order = await this.orderModel
          .findOne({ orderId: event.orderId }, { userId: 1 })
          .lean();
        recipientId = order?.userId?.toString();
      }

      if (!recipientId) {
        this.logger.warn(
          `Could not determine recipient for order status update on order: ${event.orderId}`,
        );
        return;
      }

      let category: NotificationCategory;
      let title: string;
      let message: string;

      switch (event.status) {
        case OrderStatus.CONFIRMED:
          category = NotificationCategory.ORDER_CONFIRMED;
          title = 'Order Confirmed';
          message = `Your order #${event.orderId} has been confirmed and is being processed.`;
          break;

        case OrderStatus.SHIPPED:
          category = NotificationCategory.ORDER_SHIPPED;
          title = 'Order Shipped / Out for Delivery';
          message = `Great news! Your order #${event.orderId} has been shipped and is on its way to you.`;
          break;

        case OrderStatus.DELIVERED:
          category = NotificationCategory.ORDER_DELIVERED;
          title = 'Order Delivered';
          message = `Your order #${event.orderId} has been delivered. Thank you for shopping with us!`;
          break;

        case OrderStatus.CANCELLED:
          category = NotificationCategory.ORDER_CANCELLED;
          title = 'Order Cancelled';
          message = `Your order #${event.orderId} has been cancelled.${event.reason ? ` Reason: ${event.reason}` : ''}`;
          break;

        default:
          return;
      }

      await this.notificationService.send({
        recipientId,
        type: NotificationType.TRANSACTIONAL,
        category,
        title,
        message,
        data: {
          orderId: event.orderId,
          status: event.status,
          reason: event.reason,
          url: `/orders/${event.orderId}`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to process order status notification for order ${event.orderId}:`,
        error,
      );
    }
  }

  // ============================================================================
  // Transactional Notifications: Payments
  // ============================================================================

  @OnEvent(PaymentEvents.PAYMENT_COMPLETED)
  async handlePaymentCompletedEvent(event: PaymentCompletedEvent) {
    this.logger.log(
      `Handling payment completed notification for order: ${event.orderId}`,
    );
    try {
      await this.notificationService.send({
        recipientId: event.userId,
        type: NotificationType.TRANSACTIONAL,
        category: NotificationCategory.PAYMENT_SUCCESS,
        title: 'Payment Successful',
        message: `Payment of $${event.amount} for order #${event.orderId} was completed successfully.`,
        data: {
          orderId: event.orderId,
          paymentId: event.paymentId,
          transactionId: event.transactionId,
          amount: event.amount,
          method: event.method,
          url: `/orders/${event.orderId}`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send payment success notification for order ${event.orderId}:`,
        error,
      );
    }
  }

  // ============================================================================
  // Transactional Notifications: Refunds
  // ============================================================================

  @OnEvent(REFUND_NOTIFICATION_EVENTS.REFUND_COMPLETED)
  async handleRefundCompletedEvent(event: {
    refundId: string;
    userId: string;
    amount: number;
  }) {
    this.logger.log(
      `Handling refund completed notification for refund: ${event.refundId}`,
    );
    try {
      await this.notificationService.send({
        recipientId: event.userId,
        type: NotificationType.TRANSACTIONAL,
        category: NotificationCategory.REFUND_PROCESSED,
        title: 'Refund Processed',
        message: `Your refund of $${event.amount} (Ref: ${event.refundId}) has been successfully processed.`,
        data: {
          refundId: event.refundId,
          amount: event.amount,
          url: `/refunds/${event.refundId}`,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send refund notification for refund ${event.refundId}:`,
        error,
      );
    }
  }

  // ============================================================================
  // System / Account Notifications
  // ============================================================================

  @OnEvent(AUTH_EVENTS.USER_REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log(`Handling user registered event for: ${event.email}`);

    // Send email verification
    try {
      await this.notificationService.sendEmailVerification(
        event.email,
        event.rawVerificationToken,
        event.fullName,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${event.email}`,
        error,
      );
    }

    // Also send in-app welcome notification if userId is present
    if (event.userId) {
      try {
        await this.notificationService.send({
          recipientId: event.userId,
          type: NotificationType.SYSTEM,
          category: NotificationCategory.ACCOUNT_WELCOME,
          title: 'Welcome to our store! 🎉',
          message: `Hello ${event.fullName}, welcome aboard! We are delighted to have you with us.`,
          data: {
            url: '/',
          },
        });
      } catch (error) {
        this.logger.error(
          `Failed to send in-app welcome notification for ${event.userId}:`,
          error,
        );
      }
    }
  }

  @OnEvent(AUTH_EVENTS.USER_RESEND_VERIFICATION)
  async handleUserResendVerificationEvent(event: UserResendVerificationEvent) {
    this.logger.log(
      `Handling user resend verification event for: ${event.email}`,
    );
    try {
      await this.notificationService.sendEmailVerification(
        event.email,
        event.rawVerificationToken,
        event.fullName,
      );
    } catch (error) {
      this.logger.error(
        `Failed to resend verification email to ${event.email}`,
        error,
      );
    }
  }

  @OnEvent(AUTH_EVENTS.PASSWORD_RESET_REQUESTED)
  async handlePasswordResetRequestedEvent(event: PasswordResetRequestedEvent) {
    this.logger.log(`Handling password reset requested event for: ${event.email}`);
    try {
      await this.notificationService.sendPasswordReset(
        event.email,
        event.token,
        event.fullName,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${event.email}`,
        error,
      );
    }
  }
}
