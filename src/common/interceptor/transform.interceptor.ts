import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    global.console.log('Interceptor Transform...');
    return next.handle().pipe(
      map(data => {
        return typeof data === 'object'
          ? Object.assign({ result: 0 }, data)
          : { result: 0, data };
      }),
    );
  }
}
