import { Injectable, Logger } from '@nestjs/common';
import {
  EmailOptions,
  EmailProvider,
} from '../interfaces/email-provider.interface';

@Injectable()
export class SendGridEmailProvider implements EmailProvider {
  private readonly logger = new Logger(SendGridEmailProvider.name);

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(
      `[SendGrid STUB] Sending email to ${options.to} with subject: ${options.subject}`,
    );
    // Real implementation would use @sendgrid/mail
    return Promise.resolve();
  }
}
