import { HttpException, HttpStatus } from '@nestjs/common';
import {
  IThrowHttpCustomError,
  IThrowHttpErrorPayload,
  IThrowHttpExceptionPayload,
} from './util.type';

export class CustomException {
  throwHttpError(errorPayload: IThrowHttpErrorPayload): never {
    const error: IThrowHttpCustomError = new Error();
    error.errorMessage = errorPayload.message;
    error.errorMessages = errorPayload.messages?.length
      ? errorPayload.messages
      : [errorPayload.message];
    error.statusCode = errorPayload.status;
    error.errorKey = errorPayload.errorKey;
    error.data = errorPayload.data;

    throw error;
  }

  throwHttpException(errorPayload: IThrowHttpExceptionPayload): never {
    throw new HttpException(
      {
        status: errorPayload.status,
        message: errorPayload.message,
        messages: errorPayload.messages?.length
          ? errorPayload.messages
          : [errorPayload.message],
      },
      errorPayload.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
