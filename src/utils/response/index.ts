import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    // If it's an HttpException, extract status and message safely
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();
      if (typeof res === 'string') {
        messages = [res];
      } else if (res && typeof res === 'object') {
        // res might be { message: string | string[] } or similar
        // Use runtime checks to be safe
        const maybeMessage = (res as { message?: unknown }).message;
        if (Array.isArray(maybeMessage)) {
          messages = maybeMessage.filter(
            (m): m is string => typeof m === 'string',
          );
        } else if (typeof maybeMessage === 'string') {
          messages = [maybeMessage];
        } else {
          // Fallback to stringified object if no message field
          messages = [JSON.stringify(res)];
        }
      } else {
        messages = [String(res)];
      }
    } else if (exception instanceof Error) {
      // Generic Error instance
      messages = [exception.message];
    } else if (typeof exception === 'string') {
      messages = [exception];
    } else {
      // unknown shape — keep default or stringify
      try {
        messages = [JSON.stringify(exception)];
      } catch {
        /* keep default message */
      }
    }

    // Log with stack if available
    const stack =
      typeof exception === 'object' &&
      exception !== null &&
      'stack' in exception &&
      typeof (exception as { stack?: unknown }).stack === 'string'
        ? (exception as { stack: string }).stack
        : undefined;

    this.logger.error(
      `HTTP Status: ${status} Message: ${messages.join('; ')}`,
      stack,
      request?.url,
    );

    response.status(status).json({
      success: false,
      message: messages,
      data: null,
    });
  }
}

/* Generic response shape used by the interceptor */
export class ResponseDto<T> {
  @ApiProperty()
  success!: boolean;

  @ApiProperty({ required: false })
  data!: T | null;

  @ApiProperty({ required: false })
  message?: unknown;
}

@Injectable()
export class GlobalResponseTransformer<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map(
        (data: T): ResponseDto<T> => ({
          success: true,
          data: data ?? null,
          message: null,
        }),
      ),
    );
  }
}
