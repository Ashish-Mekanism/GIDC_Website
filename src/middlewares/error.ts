import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { NODE_ENVIRONMENT, RESPONSE_CODE } from '../utils/constants';
import { getReasonPhrase } from 'http-status-codes';
//import multer from 'multer';

import ApiError from '../utils/ApiError';
import { ErrorResponse } from '../utils/responses';
import Config from '../config';
import FileHelper from '../services/fileService/fileHelper';
//import { __ } from 'i18n';

const fileHelper = new FileHelper();
const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode: number = RESPONSE_CODE.INTERNAL_SERVER_ERROR;
    const errors = {};
    let message: string = '';
    if (error instanceof mongoose.Error) {
      statusCode = RESPONSE_CODE.BAD_REQUEST;
      message = error.message;
      // } else if (error instanceof multer.MulterError) {
      //   statusCode = RESPONSE_CODE.BAD_REQUEST;
      //   message = error.message;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      message = 'Internal Server Error: ' + (error as Error).message;
    }

    error = new ApiError(
      statusCode,
      message,
      errors,
      false,
      (error as Error).stack
    );
  }

  next(error);
};

const errorHandler = async (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  let statusCode: number = err.statusCode;
  let message: string = err.message;
  const errors: Record<string, unknown> = err.errors;
  const status: boolean = err.success;
  let stack: string | undefined = err.stack;
  if (req.file || req.files) {
    try {
      console.log(req.file)
      console.log(req.files)
      if (req.file) {
        console.log(req.file)
        const filePath = req.file.path;
        await fileHelper.deleteFile(filePath);
      } else if (req.files) {
        if (req.files) {
          if (Array.isArray(req.files)) {
            const filePaths = req.files.map((file: any) => file.path);
            await fileHelper.deleteFiles(filePaths);
          } else if (typeof req.files === 'object') {
        
            for (const fieldName in req.files) {
  
                const files = req.files[fieldName];
                console.log(files,'files')
                if (Array.isArray(files)) {
                  console.log(`Files for field: ${fieldName}`, files);
                  const filePaths = files.map((file: any) => file.path);
                  await fileHelper.deleteFiles(filePaths);
                }
              
            }
          }
        }

      }
    } catch (deleteError) {
      // errorLogger.error(
      //   `Error deleting uploaded files: ${deleteError.message}`
      // );
    }
  }
  if (Config.NODE_ENV === NODE_ENVIRONMENT.PRODUCTION && err.isOperational) {
    statusCode = statusCode ?? RESPONSE_CODE.INTERNAL_SERVER_ERROR;
    message = message ?? getReasonPhrase(RESPONSE_CODE.INTERNAL_SERVER_ERROR);
  }

  res.locals.errorMessage = message;
  stack = Config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT ? stack : undefined;

  if (Config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT) {
    logger.error(message);
  }

  // Calling ErrorResponse function to send the response
  ErrorResponse(res, statusCode, message, errors, status, stack);
};

export { errorConverter, errorHandler };
