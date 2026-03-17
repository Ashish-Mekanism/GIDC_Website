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
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const authService_1 = __importDefault(require("../../authService"));
const passwordService_1 = __importDefault(require("../../passwordService"));
const tokenService_1 = require("../../tokenService");
const __1 = __importDefault(require(".."));
const User_1 = __importDefault(require("../../../models/User"));
const helper_1 = require("../../../utils/helper");
const emailService_1 = require("../../emailService");
class AdminAuthService extends authService_1.default {
    constructor() {
        super();
        this.tokenService = new tokenService_1.AdminTokenService();
        this.passwordService = new passwordService_1.default();
        this.adminService = new __1.default();
        this.sendMailToUserService = new emailService_1.SendMailToUser();
    }
    //seeder
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminService.findAdminByEmail(userData.email);
            // check existing admin
            if (admin) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Admin Alredy Exist', {}, false);
            }
            // hash user password
            if (userData.password) {
                userData.password = yield this.passwordService.hashPassword(userData.password);
            }
            const newUser = this.adminService.prepareNewUser(userData);
            //return await this.adminService.UserModel.create(newUser);
            return yield User_1.default.create(newUser);
        });
    }
    //Sub Admin Created by User
    subAdminRegister(userData, createdById) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userData, 'userData');
            // --- Case 1: Check SubAdmin by Email (must be unique) ---
            if (userData.user_type == 2 && !userData.user_name) {
                const subAdmin = yield User_1.default.findOne({
                    email: userData.email,
                    user_type: 2,
                });
                if (subAdmin) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Sub Admin Already Exist', {}, false);
                }
            }
            // --- Case 2: If registering a User (user_type = 3), check unique user_name ---
            if (userData.user_type == 3 && userData.user_name) {
                const user = yield User_1.default.findOne({
                    user_name: userData.user_name,
                    user_type: 3,
                });
                if (user) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'User Already Exist', {}, false);
                }
            }
            // --- Hash password ---
            if (userData.password) {
                userData.password = yield this.passwordService.hashPassword(userData.password);
            }
            // --- Create SubAdmin or User ---
            const newUser = this.adminService.prepareNewSubAdmin(userData, createdById);
            return yield User_1.default.create(newUser);
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminService.findAdminByEmail(userData.email);
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Invalid Email or Password', {}, false);
            }
            if (user.account_status != constants_1.ACCOUNT_STATUS.ACTIVE) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Account Inactive', {}, false);
            }
            const dbPassword = user.password;
            const inputPassword = userData.password;
            const userId = user._id;
            // Verify user password
            const verifyPassword = yield this.passwordService.verifyPassword(inputPassword, dbPassword);
            if (!verifyPassword) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Invalid Email or Password', {}, false);
            }
            const accessToken = this.tokenService.generateAdminAccessToken({
                userId: userId.toString(),
            });
            const adminProfile = (yield this.adminService.getAdminProfile(userId.toString()));
            return Object.assign({ token: {
                    accessToken: accessToken,
                } }, adminProfile);
        });
    }
    adminLogout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const validToken = this.tokenService.verifyAdminAccessToken(token);
            const expiryTime = validToken === null || validToken === void 0 ? void 0 : validToken.exp;
            this.logout(token, expiryTime);
        });
    }
    sendPasswordResetEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            //Find User in DB
            const user = yield this.adminService.findAdminByEmail(email);
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Email not found', {}, false);
            }
            // Generate ResetPassword Token
            const resetPasswordToken = this.tokenService.generateCryptoToken(constants_1.cryptoTokenLength);
            const expiryDate = this.tokenService.createCryptoTokenExpiry(constants_1.cryptoTokenExpiry.duration, constants_1.cryptoTokenExpiry.unit);
            //Update token in DB and add new expiry
            yield this.adminService.updateRestPasswordTokenAndExpiry(email, resetPasswordToken, expiryDate);
            //Generate Token URL
            const resetPasswordURL = (0, helper_1.generateResetPasswordTokenURL)(resetPasswordToken);
            /// Send Email
            const resetPasswordEmailService = new emailService_1.ResetPasswordEmailService();
            try {
                yield resetPasswordEmailService.sendResetPasswordEmail(email, resetPasswordURL);
            }
            catch (error) {
                yield this.adminService.clearResetPasswordToken(user.email);
                console.error('Error sending password reset email:', error);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to send password reset email', {}, false);
            }
        });
    }
    verifyPasswordReset(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the user with the given reset password token
            const user = yield this.adminService.findUserByResetPasswordToken(token);
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Invalid or expired password reset token', {}, false);
            }
            // Check if the token has expired
            const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(user.reset_password_token_expiry);
            if (isTokenExpired) {
                yield this.adminService.clearResetPasswordToken(user.email);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Password reset token has expired', {}, false);
            }
            // Hash the new password
            const hashedPassword = yield this.passwordService.hashPassword(newPassword);
            // Update the admin's password and clear the reset token and expiry
            yield this.adminService.updateUserPassword(hashedPassword, user.user_name);
            yield this.adminService.clearResetPasswordToken(user.email);
            return true;
        });
    }
    // async getSubAdminList() {
    //   const subAdmins = await User.aggregate([
    //     {
    //       $match: { user_type: 2 } // Filtering only Sub-Admins
    //     },
    //     {
    //       $lookup: {
    //         from: "roles", // Assuming 'roles' is the collection storing role details
    //         localField: "roleName.role_Name",
    //         foreignField: "_id",
    //         as: "roleDetails"
    //       }
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         email: 1,
    //         account_status: 1,
    //         createdAt: 1,
    //         roleDetails: { _id: 1, roleName: 1 }, // Include role name from populated data
    //         userType: {
    //           $switch: {
    //             branches: [
    //               { case: { $eq: ["$user_type", 1] }, then: "SUPER_ADMIN" },
    //               { case: { $eq: ["$user_type", 2] }, then: "SUB_ADMIN" },
    //               { case: { $eq: ["$user_type", 3] }, then: "USER" }
    //             ],
    //             default: "Unknown"
    //           }
    //         }
    //       }
    //     }
    //   ]);
    //   return subAdmins;
    // }
    getSubAdminList() {
        return __awaiter(this, void 0, void 0, function* () {
            const subAdmins = yield User_1.default.aggregate([
                {
                    $match: { user_type: 2 }, // Filtering only Sub-Admins
                },
                {
                    $lookup: {
                        from: 'roles', // Assuming 'roles' is the collection storing role details
                        localField: 'roleName.role_Name',
                        foreignField: '_id',
                        as: 'roleDetails',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        account_status: 1,
                        createdAt: 1,
                        roleName: {
                            $map: {
                                input: '$roleName',
                                as: 'role',
                                in: {
                                    _id: '$$role._id',
                                    role_Name: '$$role.role_Name',
                                    actions: '$$role.actions',
                                },
                            },
                        }, // Include roleName array with actions and IDs
                        userType: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$user_type', 1] }, then: 'SUPER_ADMIN' },
                                    { case: { $eq: ['$user_type', 2] }, then: 'SUB_ADMIN' },
                                    { case: { $eq: ['$user_type', 3] }, then: 'USER' },
                                ],
                                default: 'Unknown',
                            },
                        },
                    },
                },
            ]);
            return subAdmins;
        });
    }
    updateSubAdminOrUser(userData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const admin = await this.adminService.findAdminByEmail(userData.email);
            const admin = yield User_1.default.findById(userId);
            // check existing admin
            if (!admin) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Sub Admin Not Found', {}, false);
            }
            // hash user password
            if (userData.password) {
                userData.password = yield this.passwordService.hashPassword(userData.password);
            }
            const updatedUserData = this.adminService.updateSubAdminOrUser(userData);
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, updatedUserData, {
                new: true,
                runValidators: true,
            });
            return updatedUser;
        });
    }
    generateNewUserPassword(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = payload === null || payload === void 0 ? void 0 : payload.userId;
            const password = (_a = payload === null || payload === void 0 ? void 0 : payload.newPassword) === null || _a === void 0 ? void 0 : _a.trim();
            const user = yield User_1.default.findById(userId);
            if ((user === null || user === void 0 ? void 0 : user.user_type) === constants_1.USER_TYPE.SUPER_ADMIN) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Super Admin cannot change password', {}, false);
            }
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'User not found', {}, false);
            }
            if (user.account_status === constants_1.ACCOUNT_STATUS.DEACTIVATED) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'User account is inactive', {}, false);
            }
            const hashedPassword = yield this.passwordService.hashPassword(password);
            yield this.adminService.updateUserPassword(hashedPassword, user.user_name);
            yield this.sendMailToUserService.sendNewPasswordMail(user.email, user.user_name, password);
        });
    }
}
exports.default = AdminAuthService;
