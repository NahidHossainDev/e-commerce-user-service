import { Module } from '@nestjs/common';
import { config } from '../../../config';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';
import { NotificationService } from './notification.service';
import { NodemailerEmailProvider } from './providers/nodemailer-email.provider';
import { SendGridEmailProvider } from './providers/sendgrid-email.provider';

@Module({
  providers: [
    NotificationService,
    {
      provide: EMAIL_PROVIDER,
      useFactory: () => {
        if (config.mail.provider === 'sendgrid') {
          return new SendGridEmailProvider();
        }
        return new NodemailerEmailProvider(config);
      },
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
