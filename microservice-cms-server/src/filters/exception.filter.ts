import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${status} || ${exception.message} - ${request.method} - ${request.url} `,
      exception.stack,
    );

    if (status !== 400) {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        validationError: exception.getResponse(),
      });
    }
  }
}
