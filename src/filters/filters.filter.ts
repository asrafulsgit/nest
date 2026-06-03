import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

type ErrorType = {
  field?: string;
  message?: string;
}[];

type ResponseType = {
  status: boolean;
  timestamp: string;
  path: string | undefined;
  code?: string;
  message: string;
  errors?: ErrorType;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let timestamp: string = new Date().toLocaleString();
    let path: string = httpAdapter.getRequestUrl(ctx.getRequest());
    let message: string = 'Internal server error';
    let errors: ErrorType | undefined = undefined;

    console.log(exception)

    // Handle HttpException errors
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;
      if (
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).code === 'VALIDATION_ERROR'
      ) {
        errors = (exceptionResponse as any).errors;
      }
    }

    // Handle PrismaClientKnownRequestError errors
    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const field = exception.meta?.modelName;
          httpStatus = HttpStatus.CONFLICT;
          message = `${field || 'resource'} already exists.`;
          break;
        }
        case 'P2025': {
          const field = exception.meta?.modelName;
          httpStatus = HttpStatus.NOT_FOUND;
          message = `${field || 'resource'} not found.`;
          break;
        }
        default:
          message = 'Database error.';
      }
    }

    const responseBody: ResponseType = {
      status: false,
      timestamp,
      path:
        this.configService.get<string>('app.nodeEnv') === 'development'
          ? path
          : undefined,
      message,
      errors,
    };

    // Send the final response
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
