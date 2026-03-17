"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponseWithData = exports.SuccessResponseWithoutData = exports.ValidationErrorResponse = exports.ErrorResponse = void 0;
const ErrorResponse = (res, code, message, errors = {}, success = false, stack) => {
    const response = {
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
exports.ErrorResponse = ErrorResponse;
const ValidationErrorResponse = (res, message, code = 400) => {
    const response = {
        success: false,
        code,
        message,
    };
    res.status(code).send(response);
};
exports.ValidationErrorResponse = ValidationErrorResponse;
const SuccessResponseWithoutData = (res, code, message, success = true) => {
    const response = {
        success,
        code,
        message,
    };
    res.status(code).send(response);
};
exports.SuccessResponseWithoutData = SuccessResponseWithoutData;
const SuccessResponseWithData = (res, code, message, success = true, data) => {
    const response = {
        success,
        code,
        message,
        data,
    };
    res.status(code).send(response);
};
exports.SuccessResponseWithData = SuccessResponseWithData;
