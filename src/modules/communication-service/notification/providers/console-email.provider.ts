import { Injectable, Logger } from '@nestjs/common';
import {
  EmailOptions,
  EmailProvider,
} from '../interfaces/email-provider.interface';

@Injectable()
export class ConsoleEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ConsoleEmailProvider.name);

  send(options: EmailOptions): Promise<void> {
    this.logger.log(
      `\n=======================================================\n` +
        `📨 [CONSOLE EMAIL]\n` +
        `To: ${options.to}\n` +
        `Subject: ${options.subject}\n` +
        `Text: ${options.text || '(HTML only)'}\n` +
        `=======================================================`,
    );
    return Promise.resolve();
  }
}
