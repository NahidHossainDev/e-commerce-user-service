import {
  ArgumentsHost,
  BadRequestException,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { IGenericError } from 'src/common/interface';
import {
  ApiError,
  handleCastError,
  handleDuplicateKeyError,
  handleMongooseValidationError,
  handleUnknownError,
  handleValidationError,
  isClassValidatorError,
  isDuplicateKeyError,
  isMongooseCastError,
  isMongooseValidationError,
  isStringArray,
} from '../errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let errorResponse: IGenericError;

    // 1. Custom API Error
    if (exception instanceof ApiError) {
      errorResponse = {
        statusCode: exception.statusCode,
        message: exception.message,
        errorMsg: [],
      };
    }
    // 2. BadRequest with class-validator errors
    else if (exception instanceof BadRequestException) {
      const response = exception.getResponse();

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message: unknown }).message;

        if (isClassValidatorError(msg)) {
          errorResponse = handleValidationError(msg as ValidationError[]);
        } else if (isStringArray(msg)) {
          errorResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation Error',
            errorMsg: msg.map((m) => ({ path: 'unknown', message: m })),
          };
        } else {
          errorResponse = {
            statusCode: HttpStatus.BAD_REQUEST,
            message: exception.message,
            errorMsg: [],
          };
        }
      } else {
        errorResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: exception.message,
          errorMsg: [],
        };
      }
    } else if (isMongooseValidationError(exception)) {
      errorResponse = handleMongooseValidationError(exception);
    } else if (isMongooseCastError(exception)) {
      errorResponse = handleCastError(exception);
    } else if (isDuplicateKeyError(exception)) {
      errorResponse = handleDuplicateKeyError(exception);
    } else if (exception instanceof HttpException) {
      errorResponse = {
        statusCode: exception.getStatus(),
        message: exception.message,
        errorMsg: [],
      };
    } else {
      errorResponse = handleUnknownError(exception);
    }

    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

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
