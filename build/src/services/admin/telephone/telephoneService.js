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
exports.TelephoneService = void 0;
const Telephone_1 = __importDefault(require("../../../models/Telephone"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const SubTelephone_1 = __importDefault(require("../../../models/SubTelephone"));
const path_1 = __importDefault(require("path"));
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
class TelephoneService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createTelephoneTitle(payload, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryData = Object.assign(Object.assign({}, payload), { CreatedBy: userid, Active: true });
            const savedTelephone = yield Telephone_1.default.create(categoryData);
            // Return only required fields
            return savedTelephone;
        });
    }
    getAllTelephoneList() {
        return __awaiter(this, void 0, void 0, function* () {
            const telephoneList = yield Telephone_1.default.aggregate([
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
                        Title: 1,
                        Active: 1,
                        CreatedBy: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
            const totalCount = yield Telephone_1.default.countDocuments();
            return { totalCount: totalCount, telephoneList: telephoneList };
        });
    }
    updateTelephoneTitle(payload, telephoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find and update the telephone entry
            const updatedTelephone = yield Telephone_1.default.findByIdAndUpdate(telephoneId, // Find by ID
            { $set: payload }, // Only update provided fields
            { new: true, runValidators: true } // Return updated doc & validate fields
            ).lean();
            // If no telephone found, throw error
            if (!updatedTelephone) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Telephone not found");
            }
            return updatedTelephone;
        });
    }
    deleteTelephone(telephoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the telephone document
            const telephone = yield Telephone_1.default.findById(telephoneId);
            if (!telephone) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Telephone not found");
            }
            // Fetch all sub telephone associated with the telephone
            const subTelephone = yield SubTelephone_1.default.find({ TelephoneModelId: telephoneId });
            if (subTelephone.length > 0) {
                // Iterate through each subtelephone to delete associated photos
                for (const telephone of subTelephone) {
                    const userId = telephone.CreatedBy.toString();
                    const photoFileName = telephone.Photo;
                    const filePath = path_1.default.join("uploads", "telephone", userId, photoFileName);
                    yield this.fileHelper.deleteFile(filePath);
                }
                // Delete all sub telephone associated with the telephone
                yield SubTelephone_1.default.deleteMany({ TelephoneModelId: telephoneId });
            }
            // Delete the telephone document
            yield Telephone_1.default.deleteOne({ _id: telephoneId });
            return {
                success: true,
                message: "Telephone have been deleted successfully",
            };
        });
    }
}
exports.TelephoneService = TelephoneService;
