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
exports.BusinessBulletinService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const BusinessBulletin_1 = __importDefault(require("../../models/BusinessBulletin"));
const helper_1 = require("../../utils/helper");
const path_1 = __importDefault(require("path"));
class BusinessBulletinService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createBusinessBulletin(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Title } = payload;
            // Validate required fields
            if (!Title) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title");
            }
            // Prepare the new businessBulletin document
            const newBusinessBulletin = new BusinessBulletin_1.default({
                Title,
                CreatedBy: userId,
                Photo: file ? file.filename : "", // Set photo filename if file exists
            });
            // Save the document
            yield newBusinessBulletin.save();
            return newBusinessBulletin;
        });
    }
    getBusinessBulletinList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const businessBulletinList = yield BusinessBulletin_1.default.find().lean();
            // Prepare the response
            const response = businessBulletinList.map(businessBulletin => ({
                _id: businessBulletin._id,
                Title: businessBulletin.Title,
                Photo: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.BUSINESSBULLETIN, [businessBulletin.CreatedBy.toString(), businessBulletin.Photo]),
                createdBy: businessBulletin.CreatedBy,
            }));
            return response;
        });
    }
    updateBusinessBulletin(payload, businessBulletinId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const businessBulletinData = yield BusinessBulletin_1.default.findById((0, helper_1.toObjectId)(businessBulletinId));
            if (!businessBulletinData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Business Bulletin not found", {}, false);
            }
            let oldFilePath = `uploads/businessBulletin/${businessBulletinData.CreatedBy.toString()}/${businessBulletinData.Photo}`;
            let newPhoto = file ? file.filename : businessBulletinData.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedBusinessBulletin = (yield BusinessBulletin_1.default.findByIdAndUpdate(businessBulletinId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && businessBulletinData.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedBusinessBulletin;
        });
    }
    deleteBusinessBulletin(businessBulletinId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const businessBulletin = yield BusinessBulletin_1.default.findById(businessBulletinId);
            if (!businessBulletin) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Business Bulletin not found");
            }
            // Extract user ID and photo filename
            const userId = businessBulletin.CreatedBy.toString();
            const photoFileName = businessBulletin.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "businessBulletin", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield BusinessBulletin_1.default.deleteOne({ _id: businessBulletinId });
            return {
                success: true,
                message: "Business Bulletin have been deleted successfully",
            };
        });
    }
}
exports.BusinessBulletinService = BusinessBulletinService;
