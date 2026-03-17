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
exports.PresidentMessageService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const PresidentMessage_1 = __importDefault(require("../../models/PresidentMessage"));
const helper_1 = require("../../utils/helper");
const path_1 = __importDefault(require("path"));
class PresidentMessageService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createPresidentMessage(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Title, Sub_Title, Description } = payload;
            // Validate required fields
            if (!Title || !Description) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title and Description are mandatory.");
            }
            // Prepare the new PresidentMessage document
            const newPresidentMessage = new PresidentMessage_1.default({
                Title,
                Sub_Title: Sub_Title || "", // Default to an empty string if not provided
                Description,
                CreatedBy: userId,
                Photo: file ? file.filename : "", // Set photo filename if file exists
            });
            // Save the document
            yield newPresidentMessage.save();
            return newPresidentMessage;
        });
    }
    getPresidentMessageList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const presidentMessageList = yield PresidentMessage_1.default.find().lean();
            // Prepare the response
            const response = presidentMessageList.map(presidentMessage => ({
                _id: presidentMessage._id,
                Title: presidentMessage.Title,
                Sub_Title: presidentMessage.Sub_Title,
                Description: presidentMessage.Description,
                Photo: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.PRESIDENTPHOTO, [presidentMessage.CreatedBy.toString(), presidentMessage.Photo]),
                createdBy: presidentMessage.CreatedBy,
            }));
            return response;
        });
    }
    updatePresidentMessage(payload, presidentMessageId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const presidentMessageData = yield PresidentMessage_1.default.findById((0, helper_1.toObjectId)(presidentMessageId));
            if (!presidentMessageData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "President Message not found", {}, false);
            }
            let oldFilePath = `uploads/presidentPhoto/${presidentMessageData.CreatedBy.toString()}/${presidentMessageData.Photo}`;
            let newPhoto = file ? file.filename : presidentMessageData.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedPresidentMessage = (yield PresidentMessage_1.default.findByIdAndUpdate(presidentMessageId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && presidentMessageData.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedPresidentMessage;
        });
    }
    deletePresidentMessage(presidentMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const presidentMessage = yield PresidentMessage_1.default.findById(presidentMessageId);
            if (!presidentMessage) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "President Message not found");
            }
            // Extract user ID and photo filename
            const userId = presidentMessage.CreatedBy.toString();
            const photoFileName = presidentMessage.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "presidentPhoto", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield PresidentMessage_1.default.deleteOne({ _id: presidentMessageId });
            return {
                success: true,
                message: "President Message and associated photo have been deleted successfully",
            };
        });
    }
}
exports.PresidentMessageService = PresidentMessageService;
