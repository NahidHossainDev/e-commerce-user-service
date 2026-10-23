import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../../../config';
import {
  Order,
  OrderSchema,
} from '../../order-service/order/schemas/order.schema';
import { User, UserSchema } from '../../user-service/user/user.schema';
import {
  AdminNotificationController,
  NotificationController,
} from './controller';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';
import { ConsoleEmailProvider } from './providers/console-email.provider';
import { InAppChannelHandler } from './providers/in-app-channel.handler';
import { NodemailerEmailProvider } from './providers/nodemailer-email.provider';
import { SendGridEmailProvider } from './providers/sendgrid-email.provider';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [AdminNotificationController, NotificationController],
  providers: [
    NotificationService,
    NotificationListener,
    InAppChannelHandler,
    {
      provide: EMAIL_PROVIDER,
      useFactory: () => {
        if (config.mail.provider === 'sendgrid') {
          return new SendGridEmailProvider();
        }
        if (config.mail.provider === 'console') {
          return new ConsoleEmailProvider();
        }
        return new NodemailerEmailProvider(config);
      },
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
