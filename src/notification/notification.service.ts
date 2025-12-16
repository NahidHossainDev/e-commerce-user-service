import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendEmailVerification(email: string, token: string) {
    // In production, integrate with SendGrid/AWS SES
    this.logger.log(`[EMAIL] To: ${email} | Subject: Verify Email | Token: ${token}`);
    return true;
  }

  async sendPhoneVerification(phoneNumber: string, token: string) {
    // In production, integrate with Twilio/AWS SNS
    this.logger.log(`[SMS] To: ${phoneNumber} | Message: Your verification code is ${token}`);
    return true;
  }
}
