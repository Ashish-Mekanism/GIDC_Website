"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("../utils/constants");
const _1 = __importDefault(require("."));
// Define a token to extract error messages from the response
morgan_1.default.token('message', (_req, res) => res.locals.errorMessage || '');
// Determine the IP format based on the environment
const getIpFormat = () => _1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.PRODUCTION ? ':remote-addr - ' : '';
// Define the formats for success and error responses
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;
// Define the stream options for success and error handlers
const successStream = {
    write: (message) => logger_1.default.info(message.trim()),
};
const errorStream = {
    write: (message) => logger_1.default.error(message.trim()),
};
// Create the success and error handlers
const successHandler = (0, morgan_1.default)(successResponseFormat, {
    skip: (_req, res) => res.statusCode >= 400,
    stream: successStream,
});
const errorHandler = (0, morgan_1.default)(errorResponseFormat, {
    skip: (_req, res) => res.statusCode < 400,
    stream: errorStream,
});
exports.default = { successHandler, errorHandler };
