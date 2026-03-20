import { EmailProvider } from './interfaces/email-provider.interface';
export declare class NotificationService {
    private readonly emailProvider;
    private readonly logger;
    constructor(emailProvider: EmailProvider);
    sendEmailVerification(email: string, token: string, name: string): Promise<boolean>;
    sendPhoneVerification(phoneNumber: string, token: string): boolean;
}
