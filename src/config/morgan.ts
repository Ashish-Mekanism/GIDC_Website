import morgan, { StreamOptions } from 'morgan';

import logger from './logger';
import { NODE_ENVIRONMENT } from '../utils/constants';
import { Request, Response } from 'express';
import Config from '.';
// Define a token to extract error messages from the response
morgan.token(
  'message',
  (_req: Request, res: Response) => res.locals.errorMessage || ''
);

// Determine the IP format based on the environment
const getIpFormat = (): string =>
  Config.NODE_ENV === NODE_ENVIRONMENT.PRODUCTION ? ':remote-addr - ' : '';

// Define the formats for success and error responses
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

// Define the stream options for success and error handlers
const successStream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};
const errorStream: StreamOptions = {
  write: (message) => logger.error(message.trim()),
};

// Create the success and error handlers
const successHandler = morgan(successResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode >= 400,
  stream: successStream,
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: errorStream,
});

export default { successHandler, errorHandler };
