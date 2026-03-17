"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const commonValidations_1 = __importDefault(require("../commonValidations"));
const constants_1 = require("../../utils/constants");
const adminLoginSchema = {
    body: joi_1.default.object().keys({
        password: commonValidations_1.default.passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
        email: commonValidations_1.default.emailValidator.required(),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
const generateNewUserPasswordSchema = {
    body: joi_1.default.object().keys({
        newPassword: commonValidations_1.default.passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
        userId: commonValidations_1.default.objectIdValidator.required(),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
exports.default = {
    adminLoginSchema,
    generateNewUserPasswordSchema,
};
