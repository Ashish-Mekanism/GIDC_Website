"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../utils/constants");
const emailValidator = joi_1.default.string().email().label('Email').trim();
const passwordValidator = joi_1.default.string().required().label('Password').trim();
const objectIdValidator = joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/);
const page = joi_1.default.number().optional().allow('', null);
const perPage = joi_1.default.number().optional().allow('', null);
const searchKey = joi_1.default.string()
    .optional()
    .allow(null, '')
    .regex(/^[^*$\\]+$/);
const sortBy = joi_1.default.string().optional().allow(null, '');
const sortOrder = joi_1.default.number().valid(1, -1).optional().allow(null, '');
const paginationValidator = {
    page,
    perPage,
    searchKey,
    sortBy,
    sortOrder,
};
const sendPasswordForgotEmailSchema = {
    body: joi_1.default.object().keys({
        email: emailValidator.required(),
        user_name: joi_1.default.string().required(),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
const verifyPasswordForgotSchema = {
    body: joi_1.default.object().keys({
        newPassword: passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
        confirmPassword: passwordValidator,
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
const sendPasswordResetEmailSchema = {
    body: joi_1.default.object().keys({
        email: emailValidator.required(),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
const verifyPasswordResetSchema = {
    body: joi_1.default.object().keys({
        password: passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
const resetPasswordSchema = {
    body: joi_1.default.object().keys({
        oldPassword: passwordValidator,
        newPassword: passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
        confirmPassword: passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
exports.default = {
    emailValidator,
    passwordValidator,
    objectIdValidator,
    sendPasswordForgotEmailSchema,
    verifyPasswordForgotSchema,
    paginationValidator,
    sendPasswordResetEmailSchema,
    verifyPasswordResetSchema,
    resetPasswordSchema,
};
