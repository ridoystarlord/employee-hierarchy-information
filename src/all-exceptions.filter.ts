import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

import APIResponse from './utils/apiResponse';

type MyResponseObj = {
  statusCode: number;
  success: boolean;
  message: string;
  path: string;
  data: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      success: false,
      message: 'Internal Server Error',
      path: request.url,
      data: '',
    };

    // Add more Prisma Error Types if you want
    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.data = exception.getResponse();
      myResponseObj.message = exception.message;
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = 422;
      myResponseObj.data = exception.message.replaceAll(/\n/g, ' ');
      myResponseObj.message = exception.message.replaceAll(/\n/g, ' ');
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.data = 'Internal Server Error';
      myResponseObj.message = 'Internal Server Error';
    }
    delete myResponseObj.statusCode;
    delete myResponseObj.path;
    APIResponse(response, myResponseObj);

    super.catch(exception, host);
  }
}
