export interface IThrowHttpCustomError extends Error {
  errorMessage?: string;
  errorMessages?: string[];
  statusCode?: number;
  errorKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<any, any> | string | Record<any, any>[];
}

export interface IThrowHttpErrorPayload {
  message: string;
  messages?: string[];
  status: number;
  errorKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<any, any> | string | Record<any, any>[];
}

export interface IThrowHttpExceptionPayload {
  message: string;
  messages: string[];
  status: number;
}
