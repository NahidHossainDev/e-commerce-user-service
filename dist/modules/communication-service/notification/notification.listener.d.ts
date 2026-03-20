import { UserRegisteredEvent, UserResendVerificationEvent } from '../../user-service/auth/events/auth.events';
import { NotificationService } from './notification.service';
export declare class NotificationListener {
    private readonly notificationService;
    private readonly logger;
    constructor(notificationService: NotificationService);
    handleUserRegisteredEvent(event: UserRegisteredEvent): Promise<void>;
    handleUserResendVerificationEvent(event: UserResendVerificationEvent): Promise<void>;
}
