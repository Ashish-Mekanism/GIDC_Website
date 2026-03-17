import { Response } from 'express';
import { ErrorResponseType, SuccessResponseType } from '../types/common';

export const ErrorResponse = (
  res: Response,
  code: number,
  message: string,
  errors: Record<string, unknown> = {},
  success: boolean = false,
  stack?: string
): void => {
  const response: ErrorResponseType = {
    success,
    code,
    message,
  };

  if (Object.keys(errors).length > 0) {
    response.errors = errors;
  }

  if (stack) {
    response.stack = stack;
  }

  res.status(code).send(response);
};

export const ValidationErrorResponse = (
  res: Response,
  message: string,
  code: number = 400
): void => {
  const response: ErrorResponseType = {
    success: false,
    code,
    message,
  };

  res.status(code).send(response);
};

export const SuccessResponseWithoutData = (
  res: Response,
  code: number,
  message: string,
  success: boolean = true
): void => {
  const response: SuccessResponseType = {
    success,
    code,
    message,
  };

  res.status(code).send(response);
};

export const SuccessResponseWithData = <T>(
  res: Response,
  code: number,
  message: string,
  success: boolean = true,
  data: T
): void => {
  const response: SuccessResponseType<T> = {
    success,
    code,
    message,
    data,
  };

  res.status(code).send(response);
};
