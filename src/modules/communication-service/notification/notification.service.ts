import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  EMAIL_PROVIDER,
  EmailProvider,
} from './interfaces/email-provider.interface';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { verifyEmailTemplate } from './templates/verify-email.template';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProvider,
  ) {}

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
    // In production, integrate with Twilio/AWS SNS
    this.logger.log(
      `[SMS] To: ${phoneNumber} | Message: Your verification code is ${token}`,
    );
    return true;
  }
}
