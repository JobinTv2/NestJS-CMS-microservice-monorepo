import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInerceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInerceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, path } = request;
    const { statusCode } = response;
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${statusCode} || ${method} - ${path}  ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
