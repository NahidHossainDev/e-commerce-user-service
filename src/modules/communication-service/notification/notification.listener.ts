import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AUTH_EVENTS,
  PasswordResetRequestedEvent,
  UserRegisteredEvent,
  UserResendVerificationEvent,
} from '../../user-service/auth/events/auth.events';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(AUTH_EVENTS.USER_REGISTERED)
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    this.logger.log(`Handling user registered event for: ${event.email}`);
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
