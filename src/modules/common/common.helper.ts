import { HttpStatus, Injectable } from '@nestjs/common';
import { IErrorPayload, IResponsePayload } from './common.type';

@Injectable()
export class CommonHelper {
  constructor() {}

  apiErrorHandler(errorPayload: IErrorPayload) {
    const status =
      errorPayload.error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    return errorPayload.res
      .status(status)
      .json({
        status,
        data: errorPayload.data || null,
        message: errorPayload.error?.errorMessage,
        messages: errorPayload.error?.errorMessages || [
          errorPayload.error.message,
        ],
        errorKey: errorPayload.error?.errorKey || '',
        timeStamp: new Date().toISOString(),
      })
      .end();
  }

  apiResponseHandler(responsePayload: IResponsePayload) {
    const status = responsePayload.status || HttpStatus.OK;

    return responsePayload.res
      .status(status)
      .json({
        status,
        data: responsePayload.data || null,
        message: responsePayload.message || 'Ok',
        timeStamp: new Date().toISOString(),
      })
      .end();
  }
}
