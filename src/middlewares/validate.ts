import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
// import {
//   convertMulterArrayToPaths,
//   convertMulterFieldsToPaths,
//   pick,
// } from '../utils/helpers';
import { ValidationSchema } from '../types/common';
import ApiError from '../utils/ApiError';
import { RESPONSE_CODE } from '../utils/constants';
//import MediaService from '../services/mediaService';
import _, { pick } from 'lodash';

const validateRequest =
  (schema: ValidationSchema, multerType?: 'fields' | 'array') =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const validSchema = pick(schema, ['params', 'query', 'body']);
      const object = pick(
        req,
        Object.keys(validSchema) as Array<keyof Request>
      );

      const { value, error } = Joi.object(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object, {
          errors: {
            wrap: {
              label: false,
            },
            language: req.headers['accept-language'],
          },
        });

      if (error) {
        console.log(error, 'errorr');

        //const mediaService = new MediaService();
        //   if (req.file) {
        //     const filePath = req.file.path;
        //     await mediaService.deleteFile(filePath);
        //   }
        //   if (req.files) {
        //     if (multerType === 'fields') {
        //       const filePaths = convertMulterFieldsToPaths(req.files);
        //       await mediaService.deleteMultipleFiles(filePaths);
        //     } else if (multerType === 'array') {
        //       const filePaths = convertMulterArrayToPaths(req.files);
        //       await mediaService.deleteMultipleFiles(filePaths);
        //     }
        //   }
        const errorMessages = error?.details;

        const errors: Record<string, string> = {};
        errorMessages.forEach(err => {
          const key = err.context?.key || 'unknown';

          errors[key] = err.message;
        });
        return next(
          new ApiError(
            RESPONSE_CODE.UNPROCESSABLE_ENTITY,
            'Validation Error',
            errors
          )
        );
      }
      Object.assign(req, value);
      next();
    } catch (_error: unknown) {
      console.error('Unexpected error in validateRequest:', _error);
      if (_error instanceof Error) {
        next(
          new ApiError(
            RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            _error.message,
            {},
            false,
            _error.stack
          )
        );
      } else {
        next(
          new ApiError(
            RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            'Unexpected Error',
            {}
          )
        );
      }
    }
  };

export default validateRequest;
