import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception['status'];
    const exceptionResponse = exception['response'];

    for (const key in exception) {
      console.log('filter过滤字段：', key, exception[key]);
    }

    let validMessage = '';
    if (typeof exceptionResponse === 'object') {
      if (Array.isArray(exceptionResponse['message'])) {
        validMessage = exceptionResponse['message'][0];
      } else {
        validMessage = exceptionResponse['message'];
      }
    } else {
      validMessage = exceptionResponse;
    }

    const errorResponse = {
      data: {},
      message: validMessage,
      code: -1,
    };

    response.status(status).json(errorResponse);
  }
}
