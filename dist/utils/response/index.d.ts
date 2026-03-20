import { ArgumentsHost, CallHandler, ExceptionFilter, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
export declare class ResponseDto<T> {
    success: boolean;
    data: T | null;
    message?: unknown;
}
export declare class GlobalResponseTransformer<T> implements NestInterceptor<T, ResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseDto<T>>;
}
