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
exports.IndustriesService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const Industries_1 = __importDefault(require("../../models/Industries"));
const helper_1 = require("../../utils/helper");
const path_1 = __importDefault(require("path"));
class IndustriesService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createIndustry(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IndustriesName } = payload;
            // Validate required fields
            if (!IndustriesName) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Industries Name is mandatory.");
            }
            // Prepare the new PresidentMessage document
            const newIndustry = new Industries_1.default({
                IndustriesName,
                CreatedBy: userId,
                Photo: file ? file.filename : "", // Set photo filename if file exists
            });
            // Save the document
            yield newIndustry.save();
            return newIndustry;
        });
    }
    getIndustriesList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const industriesList = yield Industries_1.default.find().lean();
            // Prepare the response
            const response = industriesList.map(industries => ({
                _id: industries._id,
                IndustriesName: industries.IndustriesName,
                Photo: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.INDUSTRIES, [industries.CreatedBy.toString(), industries.Photo]),
                createdBy: industries.CreatedBy,
            }));
            return response;
        });
    }
    updateIndustry(payload, industryId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const industryData = yield Industries_1.default.findById((0, helper_1.toObjectId)(industryId));
            if (!industryData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Industry not found", {}, false);
            }
            let oldFilePath = `uploads/industries/${industryData.CreatedBy.toString()}/${industryData.Photo}`;
            let newPhoto = file ? file.filename : industryData.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedindustry = (yield Industries_1.default.findByIdAndUpdate(industryId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && industryData.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedindustry;
        });
    }
    deleteIndustry(industryId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const industries = yield Industries_1.default.findById(industryId);
            if (!industries) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Industries not found");
            }
            // Extract user ID and photo filename
            const userId = industries.CreatedBy.toString();
            const photoFileName = industries.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "industries", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield Industries_1.default.deleteOne({ _id: industryId });
            return {
                success: true,
                message: "Industry and associated photo have been deleted successfully",
            };
        });
    }
}
exports.IndustriesService = IndustriesService;
