import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        data: null,
        message: errors[0].constraints?.[Object.keys(errors[0].constraints)[0]],
        messages: [
          ...errors.map((error) =>
            Object.values(error.constraints ?? {}).join(', '),
          ),
        ],
        errorKey: errors[0].property,
        timeStamp: new Date().toISOString(),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

export default validationOptions;
