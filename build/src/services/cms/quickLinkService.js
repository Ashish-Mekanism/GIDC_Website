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
exports.QuickLinkService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const QuickLinks_1 = __importDefault(require("../../models/QuickLinks"));
const helper_1 = require("../../utils/helper");
const path_1 = __importDefault(require("path"));
class QuickLinkService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createQuickLink(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Title, Links } = payload;
            // Validate required fields
            if (!Title || !Array.isArray(Links) || Links.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
            }
            // Validate each link in the array
            for (const link of Links) {
                if (!link.title || !link.url) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Each link must have a title and URL");
                }
            }
            // Create new QuickLink entry
            const newQuickLink = new QuickLinks_1.default({
                Icon: (file === null || file === void 0 ? void 0 : file.filename) || "", // Store file name if uploaded, else empty string
                Title,
                Links,
                CreatedBy: userId, // Add createdBy if needed
            });
            yield newQuickLink.save();
            return newQuickLink;
        });
    }
    updateQuickLink(payload, quickLinkId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing quick link
            const quickLink = yield QuickLinks_1.default.findById((0, helper_1.toObjectId)(quickLinkId));
            if (!quickLink) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Quick Link not found", {}, false);
            }
            // Handle icon update
            let newIcon = quickLink.Icon;
            if (file) {
                newIcon = file.filename;
                // Delete old icon if it exists
                if (quickLink.Icon) {
                    const oldFilePath = `uploads/quickLinkIcon/${quickLink.CreatedBy}/${quickLink.Icon}`;
                    try {
                        yield this.fileHelper.deleteFile(oldFilePath);
                    }
                    catch (error) {
                        console.error("Error deleting old icon:", error);
                        // Continue with update even if file deletion fails
                    }
                }
            }
            // Prepare update payload
            const updateData = Object.assign(Object.assign({}, payload), { Icon: newIcon });
            // Handle Links array separately to ensure proper updating
            if (payload.Links) {
                // Links array is provided in payload, completely replace the existing links
                updateData.Links = payload.Links.map(link => ({
                    title: link.title,
                    url: link.url
                }));
            }
            // Update quick link in database
            const updatedQuickLink = yield QuickLinks_1.default.findByIdAndUpdate(quickLinkId, updateData, { new: true }).lean();
            if (!updatedQuickLink) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to update Quick Link", {}, false);
            }
            return updatedQuickLink;
        });
    }
    getQuickLinkList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all Quick Links
                const quickLinkList = yield QuickLinks_1.default.find().lean();
                if (!quickLinkList.length) {
                    return { message: "No Quick Links found." };
                }
                // Prepare the response
                const response = quickLinkList.map(quickLink => ({
                    quickLinkId: quickLink._id,
                    Title: quickLink.Title,
                    Icon: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.QUICKLINKICON, [quickLink.CreatedBy.toString(), quickLink.Icon]),
                    CreatedBy: quickLink.CreatedBy,
                    Links: quickLink.Links.map(link => ({
                        id: link._id,
                        title: link.title,
                        url: link.url
                    })),
                }));
                return response;
            }
            catch (error) {
                console.error("Error fetching Quick Link list:", error);
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to fetch Quick Links", {}, false);
            }
        });
    }
    deleteQuickLink(quickLinkId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the QuickLink document
            const quickLink = yield QuickLinks_1.default.findById(quickLinkId);
            if (!quickLink) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Quick Link not found", {}, false);
            }
            // Extract the user ID from the QuickLink document
            const userId = quickLink.CreatedBy.toString();
            // Construct the file path for the icon
            const filePath = path_1.default.join("uploads", "quickLinkIcon", userId, quickLink.Icon);
            // Delete the icon file from the file system
            yield this.fileHelper.deleteFile(filePath);
            // Delete the QuickLink document from the database
            yield QuickLinks_1.default.deleteOne({ _id: quickLinkId });
            return {
                success: true,
                message: "Quick Link and its associated icon have been deleted successfully",
            };
        });
    }
}
exports.QuickLinkService = QuickLinkService;
