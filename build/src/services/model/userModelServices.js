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
exports.UserModelService = void 0;
const User_1 = __importDefault(require("../../models/User"));
class UserModelService {
    constructor() {
        this.UserModel = User_1.default;
        // this.mediaService = new MediaService();
    }
    updateRestEmailVerificationTokenAndExpiry(email, token, tokenExpiry, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email,
                user_name,
            }, {
                email_Verification_Token: token,
                email_Verification_Token_Expiry: tokenExpiry,
            });
        });
    }
    clearEmailVerificationToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email: email,
            }, {
                email_Verification_Token: null,
                email_Verification_Token_Expiry: null,
            });
        });
    }
    verifyUserEmail(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UserModel.updateOne({ _id: userId }, {
                $set: { is_Email_Verified: true },
                $unset: {
                    email_Verification_Token: 1,
                    email_Verification_Token_Expiry: 1,
                },
            });
        });
    }
    projectFields(fields) {
        const projection = {};
        fields.forEach(field => {
            projection[field] = 1;
        });
        return {
            $project: projection,
        };
    }
    updateForgotPasswordTokenAndExpiry(email, token, tokenExpiry, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email,
                user_name,
            }, {
                password_Forgot_Token: token,
                password_Forgot_Token_Expiry: tokenExpiry,
            });
        });
    }
    clearForgotPasswordToken(email, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email: email,
                user_name: user_name,
            }, {
                password_Forgot_Token: null,
                password_Forgot_Token_Expiry: null,
            });
        });
    }
    findUserByForgotPasswordToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                password_Forgot_Token: token,
            });
        });
    }
    findUserByResetPasswordToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                reset_password_token: token,
            });
        });
    }
    updateUserPassword(password, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                user_name: user_name,
            }, {
                password: password,
            });
        });
    }
    updateRestPasswordTokenAndExpiry(email, token, tokenExpiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email,
            }, {
                reset_password_token: token,
                reset_password_token_expiry: tokenExpiry,
            });
        });
    }
    clearResetPasswordToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.updateOne({
                email: email,
            }, {
                reset_password_token: null,
                reset_password_token_expiry: null,
            });
        });
    }
}
exports.UserModelService = UserModelService;
