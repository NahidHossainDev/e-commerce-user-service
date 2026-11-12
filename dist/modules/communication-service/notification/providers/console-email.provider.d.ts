import { EmailOptions, EmailProvider } from '../interfaces/email-provider.interface';
export declare class ConsoleEmailProvider implements EmailProvider {
    private readonly logger;
    send(options: EmailOptions): Promise<void>;
}
