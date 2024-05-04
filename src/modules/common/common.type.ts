import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

enum EError {}

export interface ICustomApiErrorObject extends Error {
  errorMessage?: string;
  errorMessages: string[];
  statusCode?: HttpStatus;
  type?: EError;
  errorKey?: string;
}
export interface IErrorPayload {
  req: Request;
  res: Response;
  error: ICustomApiErrorObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<any, any> | string | Record<any, any>[];
}

export interface IMorganRequest extends Request {
  logged?: boolean;
}

export interface IResponsePayload {
  res: Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<any, any> | Record<any, any>[] | undefined | void | null;
  message?: string;
  status: HttpStatus;
}
