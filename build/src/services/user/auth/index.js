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
const __1 = __importDefault(require(".."));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const emailService_1 = require("../../emailService");
//import BaseAuthService from "../../authService";
const passwordService_1 = __importDefault(require("../../passwordService"));
const tokenService_1 = require("../../tokenService");
const authService_1 = __importDefault(require("../../authService"));
const User_1 = __importDefault(require("../../../models/User"));
const bcrypt = require("bcrypt");
class UserAuthService extends authService_1.default {
    constructor() {
        super();
        this.tokenService = new tokenService_1.UserTokenService();
        this.passwordService = new passwordService_1.default();
        this.userService = new __1.default();
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // const user = await this.userService.findUserByEmail(userData.email);
            const userNameExists = yield this.userService.UserModel.findOne({
                user_name: userData.user_name,
            });
            // check existing user
            if (userNameExists) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, "User with same username already exists", {}, false);
            }
            // hash user password
            if (userData.password) {
                userData.password = yield this.passwordService.hashPassword(userData.password);
            }
            const newUser = this.userService.prepareNewUser(userData);
            return yield this.userService.UserModel.create(newUser);
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            //const user = await this.userService.findUserByEmail(userData.email);
            const userNameExists = yield this.userService.UserModel.findOne({
                user_name: userData.user_name,
            });
            if (!userNameExists) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Invalid Email or Password", {}, false);
            }
            if (userNameExists.account_status === constants_1.ACCOUNT_STATUS.DEACTIVATED) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Your account is deactivated", {}, false);
            }
            if (!(userNameExists === null || userNameExists === void 0 ? void 0 : userNameExists.is_Email_Verified)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Your Email is not verified ", {}, false);
            }
            const dbPassword = userNameExists.password;
            const inputPassword = userData.password;
            const userId = userNameExists._id.toString();
            // Verify user password
            const verifyPassword = yield this.passwordService.verifyPassword(inputPassword, dbPassword);
            if (!verifyPassword) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Invalid Email or Password", {}, false);
            }
            const accessToken = this.tokenService.generateUserAccessToken({
                userId: userId,
            });
            const userProfile = (yield this.userService.getUserProfile(userId));
            return Object.assign({ token: {
                    accessToken: accessToken,
                } }, userProfile);
        });
    }
    userLogout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const validToken = this.tokenService.verifyUserAccessToken(token);
            const expiryTime = validToken === null || validToken === void 0 ? void 0 : validToken.exp;
            this.logout(token, expiryTime);
        });
    }
    sendEmailVerificationLink(UserEmail, id) {
        return __awaiter(this, void 0, void 0, function* () {
            //Find User in DB
            // const user = await this.userService.findActiveUserByEmail(UserEmail);
            const user = yield this.userService.UserModel.findOne({
                email: UserEmail,
                _id: id,
            });
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Email not found", {}, false);
            }
            // Generate verificationLink Token
            const verificationToken = this.tokenService.generateCryptoToken(constants_1.cryptoTokenLength);
            const expiryDate = this.tokenService.createCryptoTokenExpiry(constants_1.cryptoTokenExpiry.duration, constants_1.cryptoTokenExpiry.unit);
            //Update token in DB and add new expiry
            yield this.userService.updateRestEmailVerificationTokenAndExpiry(UserEmail, verificationToken, expiryDate, user.user_name);
            //Generate Token URL
            const emailVerificationURL = (0, helper_1.generateResetEmailVerificationTokenURL)(verificationToken, id);
            /// Send Email
            const sendMailToUser = new emailService_1.SendMailToUser();
            try {
                yield sendMailToUser.sendUserEmailVerificationLink(UserEmail, emailVerificationURL, user.user_name);
            }
            catch (error) {
                yield this.userService.clearEmailVerificationToken(user.user_name);
                console.error("Error sending email verification mail:", error);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to sendemail verification mail", {}, false);
            }
        });
    }
    verifyUserEmail(token, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = (0, helper_1.toObjectId)(id);
            const userExist = yield this.userService.findById(objectId);
            console.log(userExist, "userExist");
            if (!userExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "User not found", {}, false);
            }
            if (userExist === null || userExist === void 0 ? void 0 : userExist.is_Email_Verified) {
                return { message: "Email is already verified" }; // Return success message
            }
            // Step 1: Find the user with the given ID and token
            const user = yield this.userService.findUserByIdAndToken(id, token);
            console.log(user, "user");
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Invalid email verification token or ID", {}, false);
            }
            // if (!user.email_Verification_Token) {
            //   throw new ApiError(
            //     RESPONSE_CODE.UNAUTHORIZED,
            //     'Email verification token expiry is missing',
            //     {},
            //     false
            //   );
            // }
            // // Step 2: Check if the token has expired
            // const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(
            //   user.email_Verification_Token_Expiry
            // );
            // if (isTokenExpired) {
            //   // Clear the token and expiry
            //   await this.userService.clearEmailVerificationToken(user.email);
            //   throw new ApiError(
            //     RESPONSE_CODE.UNAUTHORIZED,
            //     'Email verification token has expired',
            //     {},
            //     false
            //   );
            // }
            // Step 3: Clear the token and expiry (mark email as verified)
            yield this.userService.verifyUserEmail(user._id);
            // Return success
            return { message: "Email successfully verified" };
        });
    }
    sendPasswordForgotEmail(email, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            //Find User in DB
            // const user = await this.userService.findActiveUserByEmail(email);
            const user = yield this.userService.UserModel.findOne({
                email,
                user_name,
            });
            console.log(user, "user");
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Email not found", {}, false);
            }
            // Generate ResetPassword Token
            const forgotPasswordToken = this.tokenService.generateCryptoToken(constants_1.cryptoTokenLength);
            const expiryDate = this.tokenService.createCryptoTokenExpiry(constants_1.cryptoTokenExpiry.duration, constants_1.cryptoTokenExpiry.unit);
            //Update token in DB and add new expiry
            yield this.userService.updateForgotPasswordTokenAndExpiry(email, forgotPasswordToken, expiryDate, user_name);
            //Generate Token URL
            const resetPasswordURL = (0, helper_1.generateForgotPasswordTokenURL)(forgotPasswordToken);
            /// Send Email
            const sendMailToUser = new emailService_1.SendMailToUser();
            try {
                yield sendMailToUser.sendUserForgotPasswordLink(email, resetPasswordURL, user.user_name);
            }
            catch (error) {
                yield this.userService.clearForgotPasswordToken(user.email, user.user_name);
                console.error("Error sending password reset email:", error);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to send password reset email", {}, false);
            }
        });
    }
    verifyPasswordForgot(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the user with the given reset password token
            console.log(token, "token");
            console.log(newPassword, "newPassword");
            const user = yield this.userService.findUserByForgotPasswordToken(token);
            console.log(user, "   user");
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Invalid or expired password reset token", {}, false);
            }
            // Check if the token has expired
            const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(user.password_Forgot_Token_Expiry);
            if (isTokenExpired) {
                yield this.userService.clearForgotPasswordToken(user.email, user.user_name);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Password reset token has expired", {}, false);
            }
            // Hash the new password
            const hashedPassword = yield this.passwordService.hashPassword(newPassword);
            // Update the user's password and clear the reset token and expiry
            yield this.userService.updateUserPassword(hashedPassword, user.user_name);
            yield this.userService.clearForgotPasswordToken(user.email, user.user_name);
            return true;
        });
    }
    resetUserPassword(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "User ID is required", {}, false);
            }
            // Find user in the database
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "User not found", {}, false);
            }
            // Check if old password matches the stored password
            const isMatch = yield bcrypt.compare(payload.oldPassword, user.password);
            if (!isMatch) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "Old password is incorrect", {}, false);
            }
            // Check if newPassword matches ConfirmPassword
            if (payload.newPassword !== payload.confirmPassword) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "New password and confirm password do not match", {}, false);
            }
            // Hash the new password
            const hashedPassword = yield this.passwordService.hashPassword(payload.newPassword);
            // Update the user's password in the database
            user.password = hashedPassword;
            yield user.save();
            return { message: "Password reset successfully" };
        });
    }
}
exports.default = UserAuthService;
