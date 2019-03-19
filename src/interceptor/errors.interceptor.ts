import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadGatewayException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Interceptor Errors...');
    return next
      .handle()
      .pipe(
        catchError(() => throwError(new BadGatewayException('Miss Error'))),
      );
  }
}
