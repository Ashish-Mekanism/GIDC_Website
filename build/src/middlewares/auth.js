"use strict";
// src/middleware/authMiddleware.ts
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
exports.adminOrSubAdminAuth = exports.adminAuth = exports.userAuth = void 0;
const tokenService_1 = require("../services/tokenService");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const constants_1 = require("../utils/constants");
const blackListTokenService_1 = __importDefault(require("../services/blackListTokenService"));
const user_1 = __importDefault(require("../services/user"));
const helper_1 = require("../utils/helper");
const admin_1 = __importDefault(require("../services/admin"));
// Base class for shared functionality
class AuthMiddleware {
    constructor(tokenService) {
        this.authenticate = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = (_a = req['headers']['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return next(new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, 'Please log in and try again.'));
            }
            try {
                const decodedToken = this.verifyToken(token);
                const userId = decodedToken['userId'];
                const { errorMessage = 'Account Inactive Or Deleted', user } = yield this.getUser(userId);
                if (!user) {
                    return next(new ApiError_1.default(constants_1.RESPONSE_CODE.FORBIDDEN, errorMessage));
                }
                const loggedOutSession = yield this.blackListTokenService.isTokenBlacklisted(token);
                if (loggedOutSession) {
                    return next(new ApiError_1.default(constants_1.RESPONSE_CODE.FORBIDDEN, 'Session Expired! Please log in again'));
                }
                req.user = user;
                req.user_id = user._id;
                req.account_status = user.account_status;
                req.is_user = user.is_user;
                req.is_admin = user.is_admin;
                next();
            }
            catch (error) {
                if (error instanceof Error) {
                    next(new ApiError_1.default(constants_1.RESPONSE_CODE.FORBIDDEN, error.message));
                }
            }
        });
        this.tokenService = tokenService;
        this.blackListTokenService = new blackListTokenService_1.default();
    }
}
// UserAuthMiddleware extending the base AuthMiddleware class
class UserAuthMiddleware extends AuthMiddleware {
    constructor() {
        super(new tokenService_1.UserTokenService());
    }
    verifyToken(token) {
        return this.tokenService.verifyUserAccessToken(token);
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userService = new user_1.default();
            const user = yield userService.findActiveUserByUserTypeAndId(constants_1.USER_TYPE.USER, (0, helper_1.toObjectId)(userId));
            // const user = await userService.findById(
            //   toObjectId(userId)
            // );
            return {
                user,
            };
        });
    }
}
class AdminAuthMiddleware extends AuthMiddleware {
    constructor() {
        super(new tokenService_1.AdminTokenService());
    }
    verifyToken(token) {
        return this.tokenService.verifyAdminAccessToken(token);
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminService = new admin_1.default();
            const user = yield adminService.findActiveUserByUserTypeAndId(constants_1.USER_TYPE.SUPER_ADMIN, (0, helper_1.toObjectId)(userId));
            // const user = await User.findOne({
            //   _id: toObjectId(userId),
            //   is_Admin: true,
            // });
            return {
                validUser: true,
                user: user,
            };
        });
    }
}
class AdminOrSubAdminAuthMiddleware extends AuthMiddleware {
    constructor() {
        super(new tokenService_1.AdminTokenService());
    }
    verifyToken(token) {
        return this.tokenService.verifyAdminAccessToken(token);
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminService = new admin_1.default();
            // const user = await userService.findUserByUserTypeAndId(
            //   USER_TYPE.USER,
            //   userId
            // );
            const user = yield adminService.findActiveSubAdminByUserTypeAndId([constants_1.USER_TYPE.SUPER_ADMIN, constants_1.USER_TYPE.SUB_ADMIN], (0, helper_1.toObjectId)(userId));
            return {
                user: user,
            };
        });
    }
}
const userAuth = new UserAuthMiddleware();
exports.userAuth = userAuth;
const adminAuth = new AdminAuthMiddleware();
exports.adminAuth = adminAuth;
const adminOrSubAdminAuth = new AdminOrSubAdminAuthMiddleware();
exports.adminOrSubAdminAuth = adminOrSubAdminAuth;
