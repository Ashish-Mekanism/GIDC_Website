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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const userModelServices_1 = require("../model/userModelServices");
const helper_1 = require("../../utils/helper");
class UserService extends userModelServices_1.UserModelService {
    constructor() {
        super();
    }
    prepareNewUser(userDetails) {
        return {
            user_name: userDetails.user_name,
            email: userDetails.email,
            password: userDetails.password,
            // membership_Id: userDetails?.membership_Id,
            is_Member: false,
            is_Email_Verified: false,
            account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            user_type: constants_1.USER_TYPE.USER,
            waterConnectionNo: userDetails === null || userDetails === void 0 ? void 0 : userDetails.waterConnectionNo,
            plotShedNo: userDetails === null || userDetails === void 0 ? void 0 : userDetails.plotShedNo,
            companyName: userDetails === null || userDetails === void 0 ? void 0 : userDetails.companyName,
        };
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                email,
                user_type: constants_1.USER_TYPE.USER,
                account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
    findActiveUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                email,
                account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
    findUserByIdAndToken(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || !token) {
                throw new Error('Both id and token must be provided');
            }
            // Convert id to ObjectId
            const objectId = (0, helper_1.toObjectId)(id);
            // Find the user by id and token
            const user = yield this.UserModel.findOne({
                _id: objectId,
                email_Verification_Token: token,
            }).exec();
            return user;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('ID must be provided');
            }
            // Find the user by ID
            const user = yield this.UserModel.findById(id).exec();
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = (0, helper_1.toObjectId)(userId);
            const userProfile = yield this.UserModel.aggregate([
                {
                    $match: {
                        _id: objectId,
                        //account_status: ACCOUNT_STATUS.ACTIVE,
                        // user_type: {
                        //   $ne: USER_TYPE.SUPER_ADMIN,
                        // },
                    },
                },
                {
                    $lookup: {
                        from: 'webdirectories', // Collection name of WebDirectory
                        localField: '_id', // Field in UserModel
                        foreignField: 'userId', // Field in WebDirectory
                        as: 'webDirectoryInfo', // Output array field
                    },
                },
                {
                    $unwind: {
                        path: '$webDirectoryInfo',
                        preserveNullAndEmptyArrays: true, // Keeps users even if no match found
                    },
                },
                {
                    $lookup: {
                        from: 'memberships', // Collection name of WebDirectory
                        localField: '_id', // Field in UserModel
                        foreignField: 'userId', // Field in WebDirectory
                        as: 'membershipsInfo', // Output array field
                    },
                },
                {
                    $unwind: {
                        path: '$membershipsInfo',
                        preserveNullAndEmptyArrays: true, // Keeps users even if no match found
                    },
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        is_Member: 1,
                        is_Email_Verified: 1,
                        approval_status: 1,
                        companyName: '$webDirectoryInfo.companyName', // Add companyName from WebDirectory
                        membershipId: '$membershipsInfo.membership_Id',
                        user_name: 1,
                        waterConnectionNo: 1,
                        plotShedNo: 1,
                        userCompanyName: '$companyName',
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
                user_type: constants_1.USER_TYPE.USER,
                account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
    findUserName(user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserModel.findOne({
                user_name,
                user_type: constants_1.USER_TYPE.USER,
                account_status: constants_1.ACCOUNT_STATUS.ACTIVE,
            });
        });
    }
}
exports.default = UserService;
