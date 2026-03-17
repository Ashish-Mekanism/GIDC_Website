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
exports.MembersService = void 0;
const MembersRegistrastionForm_1 = __importDefault(require("../../../models/MembersRegistrastionForm"));
const User_1 = __importDefault(require("../../../models/User"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
class MembersService {
    getAllMembersApprovedList(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate } = queryParams;
            console.log('Query Params:', queryParams);
            const dateMatch = {};
            if (fromDate || toDate) {
                dateMatch.createdAt = {};
                if (fromDate)
                    dateMatch.createdAt.$gte = new Date(fromDate);
                if (toDate)
                    dateMatch.createdAt.$lte = new Date(toDate);
            }
            const matchConditions = Object.assign({ 'userDetails.approval_status': 1 }, dateMatch);
            const membersList = yield MembersRegistrastionForm_1.default.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: matchConditions,
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        memberCompanyName: 1,
                        companyType: 1,
                        plotShedNo: 1,
                        roadNo: 1,
                        email: 1,
                        phone: 1,
                        mobile: 1,
                        createdAt: 1,
                        membership_Id: 1,
                        approval_status: '$userDetails.approval_status',
                        account_status: '$userDetails.account_status',
                        user_name: '$userDetails.user_name', // Adding user_name from User model
                    },
                },
                { $sort: { createdAt: -1 } },
            ]);
            const totalCount = yield MembersRegistrastionForm_1.default.countDocuments(matchConditions);
            return { membersList, totalCount };
        });
    }
    // async getAllMembersApprovedList(queryParams: any) {
    //        const { fromDate, toDate } = queryParams;
    //   const membersList = await MembershipModel.aggregate([
    //     {
    //       $lookup: {
    //         from: "users", // Collection name of the User model
    //         localField: "userId",
    //         foreignField: "_id",
    //         as: "userDetails"
    //       }
    //     },
    //     {
    //       $unwind: {
    //         path: "$userDetails",
    //         preserveNullAndEmptyArrays: true // This ensures members without a user entry still appear in the list
    //       }
    //     },
    //     {
    //       $match: {
    //         "userDetails.approval_status": 1 // Filter only approved users
    //       }
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         userId: 1,
    //         memberCompanyName: 1,
    //         companyType: 1,
    //         plotShedNo: 1,
    //         roadNo: 1,
    //         email: 1,
    //         phone: 1,
    //         mobile: 1,
    //         createdAt: 1,
    //         membership_Id: 1,
    //         approval_status: "$userDetails.approval_status",
    //         account_status: "$userDetails.account_status" // Adding account_status from User model
    //       }
    //     },
    //     { $sort: { createdAt: -1 } } // Sorting by latest created members
    //   ]);
    //   const totalCount = await MembershipModel.countDocuments();
    //   return { membersList, totalCount };
    // }
    getAllMembersRequestList() {
        return __awaiter(this, void 0, void 0, function* () {
            const membersList = yield MembersRegistrastionForm_1.default.aggregate([
                {
                    $lookup: {
                        from: 'users', // Collection name of the User model
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true, // This ensures members without a user entry still appear in the list
                    },
                },
                {
                    $match: {
                        'userDetails.approval_status': 0, // Filter only approved users
                    },
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        memberCompanyName: 1,
                        companyType: 1,
                        plotShedNo: 1,
                        roadNo: 1,
                        email: 1,
                        phone: 1,
                        mobile: 1,
                        createdAt: 1,
                        membership_Id: 1,
                        approval_status: '$userDetails.approval_status',
                        account_status: '$userDetails.account_status', // Adding account_status from User model
                        user_name: '$userDetails.user_name', // Adding user_name from User model
                    },
                },
                { $sort: { createdAt: -1 } }, // Sorting by latest created members
            ]);
            const totalCount = yield MembersRegistrastionForm_1.default.countDocuments();
            return { membersList, totalCount };
        });
    }
    activeInactiveMember(userId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const userid = (0, helper_1.toObjectId)(userId);
            const user = yield User_1.default.findById(userid);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
            console.log(action, 'action received');
            // Determine new status based on the action
            const newStatus = action
                ? constants_1.ACCOUNT_STATUS.ACTIVE
                : constants_1.ACCOUNT_STATUS.DEACTIVATED;
            // If user is already in the desired state, return early
            if (user.account_status === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? 'active' : 'deactivated'}.`,
                };
            }
            // Update user status
            yield User_1.default.findByIdAndUpdate(userid, { account_status: newStatus });
            return {
                success: true,
                message: `User account has been ${action ? 'activated' : 'deactivated'} successfully.`,
            };
        });
    }
    memberApproval(payload, file, approved_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, receipt } = payload;
            const action = Number(payload.action);
            const userid = (0, helper_1.toObjectId)(userId);
            const user = yield User_1.default.findById(userid);
            const membershipForm = yield MembersRegistrastionForm_1.default.findOne({ userId: userid });
            console.log(file, 'file');
            if (!membershipForm) {
                return {
                    success: false,
                    message: 'Membership form not found',
                };
            }
            if (!user) {
                return {
                    success: false,
                    message: 'User not found',
                };
            }
            console.log(action, 'action received');
            // Determine new status based on the action
            let newStatus;
            if (action === constants_1.MEMBER_APPROVAL_STATUS.APPROVED) {
                newStatus = constants_1.MEMBER_APPROVAL_STATUS.APPROVED;
            }
            else if (action === constants_1.MEMBER_APPROVAL_STATUS.DECLINED) {
                newStatus = constants_1.MEMBER_APPROVAL_STATUS.DECLINED;
            }
            else {
                newStatus = constants_1.MEMBER_APPROVAL_STATUS.PENDING;
            }
            console.log(newStatus, 'newStatus');
            // If user is already in the desired state, return early
            if (user.approval_status === newStatus) {
                return {
                    success: false,
                    message: `User membership is already ${action === constants_1.MEMBER_APPROVAL_STATUS.APPROVED
                        ? 'approved'
                        : action === constants_1.MEMBER_APPROVAL_STATUS.DECLINED
                            ? 'declined'
                            : 'pending'}.`,
                };
            }
            const updateMembership = {};
            if (receipt)
                updateMembership.receipt = receipt;
            if (file && file.filename) {
                updateMembership.receiptPhoto = file.filename;
            }
            if (approved_by) {
                updateMembership.approved_by = approved_by;
            }
            console.log(updateMembership, 'updateMembership');
            if (Object.keys(updateMembership).length > 0) {
                yield MembersRegistrastionForm_1.default.findOneAndUpdate({ userId: userid }, { $set: updateMembership });
            }
            // Update user status
            yield User_1.default.findByIdAndUpdate(userid, {
                approval_status: newStatus,
                is_Member: true,
            });
            return {
                success: true,
                message: `User has been ${action === constants_1.MEMBER_APPROVAL_STATUS.APPROVED
                    ? 'approved'
                    : action === constants_1.MEMBER_APPROVAL_STATUS.DECLINED
                        ? 'declined'
                        : 'set to pending'} successfully.`,
            };
        });
    }
}
exports.MembersService = MembersService;
