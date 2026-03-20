import { Config } from '../../../../config';
import { EmailOptions, EmailProvider } from '../interfaces/email-provider.interface';
export declare class NodemailerEmailProvider implements EmailProvider {
    private readonly config;
    private readonly logger;
    private transporter;
    constructor(config: Config);
    send(options: EmailOptions): Promise<void>;
}
