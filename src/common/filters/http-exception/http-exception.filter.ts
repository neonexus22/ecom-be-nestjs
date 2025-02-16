import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Fix class name
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // handle validation errors
    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      const validationMessages =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse.message
          : exceptionResponse;

      const groupedMessages = {};
      if (Array.isArray(validationMessages)) {
        (validationMessages as string[]).forEach((message) => {
          if (typeof message !== 'string') return;
          const field = message?.split(' ')?.[0]; // Extract the field name
          if (!groupedMessages[field]) {
            groupedMessages[field] = message;
          }
        });
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Validation failed',
        errors: Object.values(groupedMessages),
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.message || 'Internal server error',
    });
  }
}
