"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../config/logger"));
const constants_1 = require("../utils/constants");
const http_status_codes_1 = require("http-status-codes");
//import multer from 'multer';
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const responses_1 = require("../utils/responses");
const config_1 = __importDefault(require("../config"));
const fileHelper_1 = __importDefault(require("../services/fileService/fileHelper"));
//import { __ } from 'i18n';
const fileHelper = new fileHelper_1.default();
const errorConverter = (err, _req, _res, next) => {
    let error = err;
    if (!(error instanceof ApiError_1.default)) {
        let statusCode = constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR;
        const errors = {};
        let message = '';
        if (error instanceof mongoose_1.default.Error) {
            statusCode = constants_1.RESPONSE_CODE.BAD_REQUEST;
            message = error.message;
            // } else if (error instanceof multer.MulterError) {
            //   statusCode = RESPONSE_CODE.BAD_REQUEST;
            //   message = error.message;
        }
        else if (typeof error === 'object' &&
            error !== null &&
            'message' in error) {
            message = 'Internal Server Error: ' + error.message;
        }
        error = new ApiError_1.default(statusCode, message, errors, false, error.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    let statusCode = err.statusCode;
    let message = err.message;
    const errors = err.errors;
    const status = err.success;
    let stack = err.stack;
    if (req.file || req.files) {
        try {
            console.log(req.file);
            console.log(req.files);
            if (req.file) {
                console.log(req.file);
                const filePath = req.file.path;
                yield fileHelper.deleteFile(filePath);
            }
            else if (req.files) {
                if (req.files) {
                    if (Array.isArray(req.files)) {
                        const filePaths = req.files.map((file) => file.path);
                        yield fileHelper.deleteFiles(filePaths);
                    }
                    else if (typeof req.files === 'object') {
                        for (const fieldName in req.files) {
                            const files = req.files[fieldName];
                            console.log(files, 'files');
                            if (Array.isArray(files)) {
                                console.log(`Files for field: ${fieldName}`, files);
                                const filePaths = files.map((file) => file.path);
                                yield fileHelper.deleteFiles(filePaths);
                            }
                        }
                    }
                }
            }
        }
        catch (deleteError) {
            // errorLogger.error(
            //   `Error deleting uploaded files: ${deleteError.message}`
            // );
        }
    }
    if (config_1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.PRODUCTION && err.isOperational) {
        statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR;
        message = message !== null && message !== void 0 ? message : (0, http_status_codes_1.getReasonPhrase)(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
    res.locals.errorMessage = message;
    stack = config_1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.DEVELOPMENT ? stack : undefined;
    if (config_1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.DEVELOPMENT) {
        logger_1.default.error(message);
    }
    // Calling ErrorResponse function to send the response
    (0, responses_1.ErrorResponse)(res, statusCode, message, errors, status, stack);
});
exports.errorHandler = errorHandler;
