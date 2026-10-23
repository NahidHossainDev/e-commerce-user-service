export enum NotificationType {
  TRANSACTIONAL = 'TRANSACTIONAL',
  MARKETING = 'MARKETING',
  SYSTEM = 'SYSTEM',
}

export enum NotificationCategory {
  // Transactional
  ORDER_PLACED = 'ORDER_PLACED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',

  // Marketing
  MARKETING = 'MARKETING',

  // System / Account
  ACCOUNT_WELCOME = 'ACCOUNT_WELCOME',
  ACCOUNT_SECURITY = 'ACCOUNT_SECURITY',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export interface INotificationPayload {
  recipientId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
  metadata?: Record<string, any>;
}

export interface INotificationChannelHandler {
  readonly channel: NotificationChannel;
  send(payload: INotificationPayload): Promise<void>;
}

export const NOTIFICATION_CHANNEL_HANDLERS = 'NOTIFICATION_CHANNEL_HANDLERS';
