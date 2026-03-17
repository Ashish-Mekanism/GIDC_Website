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
require("multer");
const User_1 = __importDefault(require("../../models/User"));
const helper_1 = require("../../utils/helper");
const userModelServices_1 = require("../model/userModelServices");
const constants_1 = require("../../utils/constants");
class AdminService extends userModelServices_1.UserModelService {
    prepareNewUser(userDetails) {
        return {
            user_type: constants_1.USER_TYPE.SUPER_ADMIN,
            account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            email: userDetails.email,
            password: userDetails.password,
        };
    }
    // prepareNewSubAdmin(userDetails: Partial<IUser>): Partial<IUser> {
    //   console.log(userDetails, 'userDetailsuserDetailsuserDetails');
    //   return {
    //     user_type: userDetails.user_type,
    //     roleName: userDetails.roleName
    //       ?.filter(role => role.role_Name) // Ensure role_Name exists
    //       .map(role => ({
    //         role_Name: role.role_Name // Convert properly
    //       })),
    //     account_status: ACCOUNT_STATUS.ACTIVE,
    //     email: userDetails.email,
    //     password: userDetails.password,
    //     is_Email_Verified:true
    //   };
    // }
    prepareNewSubAdmin(userDetails, createdById) {
        var _a;
        console.log(userDetails, "userDetails");
        return Object.assign({ user_type: userDetails.user_type, user_name: userDetails.user_name, roleName: (_a = userDetails.roleName) === null || _a === void 0 ? void 0 : _a.map(role => ({
                role_Name: role.role_Name, // Ensure it's a valid role
                actions: role.actions.map(action => action), // Ensure actions are valid
            })), account_status: constants_1.ACCOUNT_STATUS.ACTIVE, email: userDetails.email, password: userDetails.password, created_by: createdById, is_Email_Verified: true }, (Number(userDetails.user_type) === 3 ? { is_Member: false } : {}));
    }
    //   updateSubAdminOrUser(userDetails: Partial<IUser>): Partial<IUser> {
    //     console.log(userDetails, 'userDetailsuserDetailsuserDetails');
    //       return {
    //      // user_type: userDetails.user_type,
    //       roleName: userDetails.roleName
    //         ?.filter(role => role.role_Name) // Ensure role_Name exists
    //         .map(role => ({
    //           role_Name: role.role_Name // Convert properly
    //         })),
    //       password: userDetails.password,
    //     };
    // }
    updateSubAdminOrUser(userDetails) {
        console.log(userDetails, "Updating User Details");
        return Object.assign(Object.assign({}, (userDetails.password && { password: userDetails.password })), (userDetails.roleName && {
            roleName: userDetails.roleName.map(role => ({
                role_Name: role.role_Name, // Ensure valid role
                actions: role.actions.map(action => action), // Ensure valid actions
            })),
        }));
    }
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findOne({
                email,
                user_type: { $in: [constants_1.USER_TYPE.SUPER_ADMIN, constants_1.USER_TYPE.SUB_ADMIN] }
            });
        });
    }
    getAdminProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield User_1.default.aggregate([
                {
                    $match: {
                        _id: (0, helper_1.toObjectId)(userId), // Convert to ObjectId
                        // is_Admin: true,
                        user_type: { $in: [constants_1.USER_TYPE.SUPER_ADMIN, constants_1.USER_TYPE.SUB_ADMIN] },
                    },
                },
                {
                    $project: {
                        email: 1,
                        user_type: 1,
                        is_Member: 1,
                        roleName: 1,
                    },
                },
            ]);
            return userProfile.length ? userProfile[0] : null;
        });
    }
    findActiveUserByUserTypeAndId(user_type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                _id: id,
                user_type: constants_1.USER_TYPE.SUPER_ADMIN,
                //account_status: ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
    findActiveSubAdminByUserTypeAndId(user_type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                return null; // Handle undefined ID case
            return yield this.UserModel.findOne({
                _id: id,
                user_type: { $in: [constants_1.USER_TYPE.SUPER_ADMIN, constants_1.USER_TYPE.SUB_ADMIN] },
                account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
}
exports.default = AdminService;
