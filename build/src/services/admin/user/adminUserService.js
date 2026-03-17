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
exports.AdminUserService = void 0;
const User_1 = __importDefault(require("../../../models/User"));
const helper_1 = require("../../../utils/helper");
class AdminUserService {
    getAllUsersList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate } = query;
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const matchStage = {};
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            matchStage.is_Member = false;
            const users = yield User_1.default.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'users', // The name of the collection
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'creator',
                    },
                },
                {
                    $unwind: { path: '$creator', preserveNullAndEmptyArrays: true },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        email: 1,
                        account_status: 1,
                        user_type: 1,
                        user_name: 1,
                        companyName: 1,
                        plotShedNo: 1,
                        waterConnectionNo: 1,
                        created_by: {
                            email: '$creator.email',
                            user_type: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $eq: ['$creator.user_type', 1] },
                                            then: 'SUPER_ADMIN',
                                        },
                                        {
                                            case: { $eq: ['$creator.user_type', 2] },
                                            then: 'SUB_ADMIN',
                                        },
                                        { case: { $eq: ['$creator.user_type', 3] }, then: 'USER' },
                                    ],
                                    default: 'USER',
                                },
                            },
                        },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ]);
            return users;
        });
    }
}
exports.AdminUserService = AdminUserService;
