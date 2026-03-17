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
exports.CommitteeService = void 0;
const Committee_1 = __importDefault(require("../../models/Committee"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const CommitteeMember_1 = __importDefault(require("../../models/CommitteeMember"));
const path_1 = __importDefault(require("path"));
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
class CommitteeService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createCommittee(payload, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryData = Object.assign(Object.assign({}, payload), { CreatedBy: userid });
            const savedCommittee = yield Committee_1.default.create(categoryData);
            // Return only required fields
            return savedCommittee;
        });
    }
    getCommitteeList() {
        return __awaiter(this, void 0, void 0, function* () {
            const committeeList = yield Committee_1.default.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "CreatedBy",
                        foreignField: "_id",
                        as: "creatorDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$creatorDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        "CreatedBy": {
                            email: "$creatorDetails.email",
                            userType: {
                                $switch: {
                                    branches: [
                                        { case: { $eq: ["$creatorDetails.user_type", 1] }, then: "SUPER_ADMIN" },
                                        { case: { $eq: ["$creatorDetails.user_type", 2] }, then: "SUB_ADMIN" },
                                        { case: { $eq: ["$creatorDetails.user_type", 3] }, then: "USER" }
                                    ],
                                    default: "Unknown"
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        CommitteeName: 1,
                        // Active: 1,
                        CreatedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
            const totalCount = yield Committee_1.default.countDocuments();
            return { totalCount: totalCount, committeeList: committeeList };
        });
    }
    updateCommittee(payload, committeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find and update the telephone entry
            const updatedCommittee = yield Committee_1.default.findByIdAndUpdate(committeeId, // Find by ID
            { $set: payload }, // Only update provided fields
            { new: true, runValidators: true } // Return updated doc & validate fields
            ).lean();
            // If no telephone found, throw error
            if (!updatedCommittee) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Committee not found");
            }
            return updatedCommittee;
        });
    }
    deleteCommittee(committeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the committee document
            const committee = yield Committee_1.default.findById(committeeId);
            if (!committee) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Committee not found");
            }
            // Fetch all committee members associated with the committee
            const committeeMembers = yield CommitteeMember_1.default.find({ CommitteeModelId: committeeId });
            if (committeeMembers.length > 0) {
                // Iterate through each member to delete associated photos
                for (const member of committeeMembers) {
                    const userId = member.CreatedBy.toString();
                    const photoFileName = member.Photo;
                    const filePath = path_1.default.join("uploads", "CommitteeMember", userId, photoFileName);
                    yield this.fileHelper.deleteFile(filePath);
                }
                // Delete all committee members associated with the committee
                yield CommitteeMember_1.default.deleteMany({ CommitteeModelId: committeeId });
            }
            // Delete the committee document
            yield Committee_1.default.deleteOne({ _id: committeeId });
            return {
                success: true,
                message: "Committee and associated members have been deleted successfully",
            };
        });
    }
}
exports.CommitteeService = CommitteeService;
