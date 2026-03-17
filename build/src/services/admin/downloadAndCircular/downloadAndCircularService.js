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
exports.DownloadAndCircularService = void 0;
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const DownloadAndCircular_1 = __importDefault(require("../../../models/DownloadAndCircular"));
const helper_1 = require("../../../utils/helper");
class DownloadAndCircularService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createCircular(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Heading, Description, Date, Category = '' } = payload;
            // Validate required fields
            if (!Heading || !Date) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Missing required fields');
            }
            if (!Category) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Circular Must have a Category');
            }
            // Create a new circular instance
            const newCircular = new DownloadAndCircular_1.default({
                Heading,
                Description,
                Date,
                Document: (file === null || file === void 0 ? void 0 : file.filename) || null, // Save the uploaded PDF file name
                CreatedBy: userId,
                Active: true,
                Category,
            });
            // Save the circular in the database
            yield newCircular.save();
            return newCircular;
        });
    }
    updateCircular(payload, circularId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing event
            const circular = yield DownloadAndCircular_1.default.findById((0, helper_1.toObjectId)(circularId));
            if (!circular) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Circular not found');
            }
            const updatedCircular = (yield DownloadAndCircular_1.default.findByIdAndUpdate((0, helper_1.toObjectId)(circularId), // Corrected variable name
            { $set: payload }, // Ensure update structure is correct
            { new: true, runValidators: true } // Return updated doc & apply schema validation
            ).lean());
            return updatedCircular;
        });
    }
    // async getCircularList(): Promise<any> {
    //     // Fetch all events
    //     const circulars = await DownloadAndCircular.find().lean();
    //     const totalCount= await DownloadAndCircular.countDocuments();
    //     return {
    //         data: circulars.map(circular => ({
    //             ...circular,
    //             DocumentUrl: typeof circular.Document === "string"
    //                 ? this.fileService.getFilePathFromDatabase(
    //                     FOLDER_NAMES.CIRCULAR,
    //                     [circular.CreatedBy.toString(), circular.Document]
    //                 )
    //                 : null // Handle cases where Photo is missing
    //         })),
    //         totalCount:totalCount
    //     };
    // }
    getCircularList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category = '' } = query;
            const matchStage = {};
            if (category && category.trim()) {
                matchStage.Category = category;
            }
            const circulars = yield DownloadAndCircular_1.default.aggregate([
                {
                    $match: matchStage,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'creatorDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$creatorDetails',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        CreatedBy: {
                            _id: '$creatorDetails._id',
                            email: '$creatorDetails.email',
                            userType: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 1] },
                                            then: 'SUPER_ADMIN',
                                        },
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 2] },
                                            then: 'SUB_ADMIN',
                                        },
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 3] },
                                            then: 'USER',
                                        },
                                    ],
                                    default: 'Unknown',
                                },
                            },
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        Heading: 1,
                        Description: 1,
                        Date: 1,
                        Active: 1,
                        CreatedBy: 1,
                        Document: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        Category: 1,
                    },
                },
            ]);
            const totalCount = yield DownloadAndCircular_1.default.countDocuments(matchStage);
            // Process document URL in JavaScript
            const updatedCirculars = circulars.map(circular => {
                var _a, _b;
                return (Object.assign(Object.assign({}, circular), { DocumentUrl: circular.Document
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.CIRCULAR, [(_b = (_a = circular.CreatedBy) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(), circular.Document] // Using email instead of ObjectId
                        )
                        : null }));
            });
            return { totalCount, data: updatedCirculars };
        });
    }
    getCircularDetails(circularId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the event from the database
            const circular = yield DownloadAndCircular_1.default.findById(circularId).lean();
            if (!circular) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Circular not found');
            }
            const createdByIdString = ((_a = circular.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString()) || '';
            if (circular.Document) {
                circular.Document = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.CIRCULAR, [createdByIdString, String(circular.Document)] // Pass an array of submodules
                );
            }
            return circular;
        });
    }
    activeInactiveCircular(downlaodAndCircular_Id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const downlaodAndCircular_id = (0, helper_1.toObjectId)(downlaodAndCircular_Id);
            const circular = yield DownloadAndCircular_1.default.findById(downlaodAndCircular_id);
            if (!circular) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Circular not found', {}, false);
            }
            // Determine new status based on the action
            const newStatus = action
                ? constants_1.CIRCULAR_STATUS.ACTIVE
                : constants_1.CIRCULAR_STATUS.INACTIVE;
            // If user is already in the desired state, return early
            if (circular.Active === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? 'active' : 'deactivated'}.`,
                };
            }
            // Update user status
            yield DownloadAndCircular_1.default.findByIdAndUpdate(downlaodAndCircular_id, {
                Active: newStatus,
            });
            return {
                success: true,
                message: `Circular has been ${action ? 'activated' : 'deactivated'} successfully.`,
            };
        });
    }
    getActiveCircularList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category = '' } = query;
            const matchStage = {};
            if (category && category.trim()) {
                matchStage.Category = category;
            }
            matchStage.Active = true;
            const circulars = yield DownloadAndCircular_1.default.aggregate([
                {
                    $match: matchStage,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'CreatedBy',
                        foreignField: '_id',
                        as: 'creatorDetails',
                    },
                },
                {
                    $unwind: {
                        path: '$creatorDetails',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        CreatedBy: {
                            _id: '$creatorDetails._id',
                            email: '$creatorDetails.email',
                            userType: {
                                $switch: {
                                    branches: [
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 1] },
                                            then: 'SUPER_ADMIN',
                                        },
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 2] },
                                            then: 'SUB_ADMIN',
                                        },
                                        {
                                            case: { $eq: ['$creatorDetails.user_type', 3] },
                                            then: 'USER',
                                        },
                                    ],
                                    default: 'Unknown',
                                },
                            },
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        Heading: 1,
                        Description: 1,
                        Date: 1,
                        Active: 1,
                        CreatedBy: 1,
                        Document: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        Category: 1,
                    },
                },
            ]);
            // Process document URL in JavaScript
            const updatedCirculars = circulars.map(circular => {
                var _a, _b;
                return (Object.assign(Object.assign({}, circular), { DocumentUrl: circular.Document
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.CIRCULAR, [(_b = (_a = circular.CreatedBy) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(), circular.Document] // Using email instead of ObjectId
                        )
                        : null }));
            });
            return { data: updatedCirculars };
        });
    }
}
exports.DownloadAndCircularService = DownloadAndCircularService;
