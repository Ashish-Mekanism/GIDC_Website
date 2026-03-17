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
const asyncHandler_1 = __importDefault(require("../../../utils/asyncHandler"));
const responses_1 = require("../../../utils/responses");
const constants_1 = require("../../../utils/constants");
const auth_1 = __importDefault(require("../../../services/admin/auth"));
const emailService_1 = require("../../../services/emailService");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const auth_2 = __importDefault(require("../../../services/user/auth"));
const adminRegisterUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const createdById = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    const { email, password, confirmPassword, user_type, user_name } = payload;
    const sendMailToUser = new emailService_1.SendMailToUser();
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'Password and Confirm Password do not match.', {}, false);
    }
    const userAuthService = new auth_2.default();
    // Register the User
    const registeredUser = yield adminAuthService.subAdminRegister(payload, createdById);
    console.log(registeredUser, 'registeredUser');
    const id = registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser._id.toString();
    const UserEmail = registeredUser === null || registeredUser === void 0 ? void 0 : registeredUser.email;
    //await userAuthService.sendEmailVerificationLink(UserEmail, id)
    yield sendMailToUser.sendUserWelcomeMail(UserEmail);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'registerUserSuccess', constants_1.API_RESPONSE_STATUS.SUCCESS, registeredUser);
}));
const adminLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const adminAuthService = new auth_1.default();
    const loginUser = yield adminAuthService.login(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'loginAdminSuccess', constants_1.API_RESPONSE_STATUS.SUCCESS, loginUser);
}));
const adminLogout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminAuthService = new auth_1.default();
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    yield adminAuthService.adminLogout(token);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'logoutSuccess', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const adminSendPasswordResetEmail = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const payload = req.body;
    const email = payload.email;
    yield adminAuthService.sendPasswordResetEmail(email);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Reset Password Email Sent Success', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const adminVerifyResetPasswordToken = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const queryPayload = req.query;
    const bodyPayload = req.body;
    const token = queryPayload.token;
    const password = bodyPayload.password;
    yield adminAuthService.verifyPasswordReset(token, password);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Password Reset Success', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const getSubAdminList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const subAdminList = yield adminAuthService.getSubAdminList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sub-Admin List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subAdminList);
}));
const updateSubAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userId = req === null || req === void 0 ? void 0 : req.params.id;
    console.log(payload, 'payload');
    const userAuthService = new auth_2.default();
    // Register the User
    const subAdminOrUserUpdated = yield adminAuthService.updateSubAdminOrUser(payload, userId);
    console.log(subAdminOrUserUpdated, 'subAdminOrUserUpdated');
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'User/Sub-Admin Updated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, subAdminOrUserUpdated);
}));
const generateNewUserPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminAuthService = new auth_1.default();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    yield adminAuthService.generateNewUserPassword(payload);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.CREATED, 'User Password Generated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    adminLogin,
    adminLogout,
    adminSendPasswordResetEmail,
    adminVerifyResetPasswordToken,
    adminRegisterUser,
    getSubAdminList,
    updateSubAdmin,
    generateNewUserPassword,
};
