import winston, { format, transports, Logger } from 'winston';
import { NODE_ENVIRONMENT } from '../utils/constants';
import Config from '.';

// Custom format to handle error objects
const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// Create the logger instance
const logger: Logger = winston.createLogger({
  level: Config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT ? 'debug' : 'info',
  format: format.combine(
    format.json(),
    enumerateErrorFormat(),
    Config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT
      ? format.colorize()
      : format.uncolorize(),

    format.splat(),
    format.printf(({ level, message }) => {
      return `${level}: ${message}`;
    })
  ),

  transports: [
    new transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
});

export default logger;
