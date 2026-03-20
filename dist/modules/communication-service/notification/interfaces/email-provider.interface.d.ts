export interface EmailOptions {
    to: string;
    from?: string;
    subject: string;
    html: string;
    text?: string;
}
export interface EmailProvider {
    send(options: EmailOptions): Promise<void>;
}
export declare const EMAIL_PROVIDER = "EMAIL_PROVIDER";
