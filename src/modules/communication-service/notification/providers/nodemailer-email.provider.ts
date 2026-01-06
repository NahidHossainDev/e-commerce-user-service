import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { Config } from '../../../../config';
import {
  EmailOptions,
  EmailProvider,
} from '../interfaces/email-provider.interface';

@Injectable()
export class NodemailerEmailProvider implements EmailProvider {
  private readonly logger = new Logger(NodemailerEmailProvider.name);
  private transporter: Transporter;

  constructor(private readonly config: Config) {
    this.transporter = createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    }) as Transporter;
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      await (this.transporter.sendMail({
        from: options.from || this.config.mail.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }) as Promise<any>);
      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }
}
