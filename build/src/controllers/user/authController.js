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
const emailService_1 = require("../../services/emailService");
const auth_1 = __importDefault(require("../../services/user/auth"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const registerUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { email, password, confirmPassword } = payload;
    const sendMailToUser = new emailService_1.SendMailToUser();
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'Password and Confirm Password do not match.', {}, false);
    }
    const userAuthService = new auth_1.default();
    // Register the User
    const registeredUser = yield userAuthService.register(payload);
    const id = registeredUser._id.toString();
    const UserEmail = registeredUser.email;
    yield userAuthService.sendEmailVerificationLink(UserEmail, id);
    yield sendMailToUser.sendUserWelcomeMail(UserEmail);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'registerUserSuccess', constants_1.API_RESPONSE_STATUS.SUCCESS, registeredUser);
}));
const loginUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    console.log(payload, "payload");
    const userAuthService = new auth_1.default();
    const loginUser = yield userAuthService.login(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'login User Success', constants_1.API_RESPONSE_STATUS.SUCCESS, loginUser);
}));
const logoutUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userAuthService = new auth_1.default();
    const token = (_a = req['headers']['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    yield userAuthService.userLogout(token);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'logout Success', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const verifyEmail = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req === null || req === void 0 ? void 0 : req.query;
    const { token, id } = data;
    // Ensure token and id are strings
    if (typeof token !== 'string' || typeof id !== 'string') {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid token or id', {}, false);
    }
    console.log(token, "tokenn");
    console.log(id, "ID");
    const userAuthService = new auth_1.default();
    const emailVerified = yield userAuthService.verifyUserEmail(token, id);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.ACCEPTED, emailVerified.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const sendPasswordForgotEmailUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuthService = new auth_1.default();
    const payload = req.body;
    const email = payload.email;
    const user_name = payload.user_name;
    yield userAuthService.sendPasswordForgotEmail(email, user_name);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Reset Password Email Sent Success', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const verifyForgotPasswordTokenUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuthService = new auth_1.default();
    const queryPayload = req.query;
    const bodyPayload = req.body;
    const { newPassword, confirmPassword } = bodyPayload;
    const token = queryPayload === null || queryPayload === void 0 ? void 0 : queryPayload.token;
    // Check if password and confirmPassword match
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'Password and Confirm Password do not match.', {}, false);
    }
    const password = newPassword;
    yield userAuthService.verifyPasswordForgot(token, password);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'passwordResetSuccess', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const resetPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuthService = new auth_1.default();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userId = req === null || req === void 0 ? void 0 : req.user_id;
    const resetPasswordSuccess = yield userAuthService.resetUserPassword(payload, userId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, resetPasswordSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    loginUser,
    registerUser,
    verifyEmail,
    logoutUser,
    sendPasswordForgotEmailUser,
    verifyForgotPasswordTokenUser,
    resetPassword,
};
