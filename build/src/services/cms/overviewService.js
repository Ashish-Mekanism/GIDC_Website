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
exports.OverviewService = void 0;
const Overview_1 = __importDefault(require("../../models/Overview"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const helper_1 = require("../../utils/helper");
const AboutUsImages_1 = __importDefault(require("../../models/AboutUsImages"));
const path_1 = __importDefault(require("path"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
class OverviewService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createOverview(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingOverview = yield Overview_1.default.findOne();
            if (existingOverview) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Overview' entry already exists. You cannot create another one.");
            }
            const { NoOfIndustriesInOdhav, NoOfMembers, AreaOfIndustrialEstate } = payload;
            // Prepare the new businessBulletin document
            const newOverview = new Overview_1.default({
                NoOfIndustriesInOdhav,
                NoOfMembers,
                AreaOfIndustrialEstate,
                CreatedBy: userId,
            });
            // Save the document
            yield newOverview.save();
            return newOverview;
        });
    }
    getOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const overview = yield Overview_1.default.find().lean();
            if (!overview) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Overview Not Found.");
            }
            // Prepare the response
            const response = overview;
            return response;
        });
    }
    updateOverview(payload, overviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const overview = yield Overview_1.default.findById((0, helper_1.toObjectId)(overviewId));
            if (!overview) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Overview not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedOverview = (yield Overview_1.default.findByIdAndUpdate(overviewId, updatedPayload, { new: true }).lean());
            return updatedOverview;
        });
    }
    createAboutUsImages(userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(files, "imagessssssssss");
            const { overviewImage, corpoImage } = files;
            const overviewImagesArray = overviewImage
                ? overviewImage.map((file) => ({
                    fileName: file.filename,
                }))
                : [];
            const csrImagesArray = corpoImage
                ? corpoImage.map((file) => ({
                    fileName: file.filename,
                }))
                : [];
            const updateData = {
                CreatedBy: userId,
            };
            // ✅ Update only what is provided
            if (overviewImagesArray.length > 0) {
                updateData.OverviewImage = overviewImagesArray;
            }
            if (csrImagesArray.length > 0) {
                updateData.CorporateSocialResponsibilityImage = csrImagesArray;
            }
            const aboutUsImages = yield AboutUsImages_1.default.findOneAndUpdate({ CreatedBy: userId }, // 🔑 single document condition
            { $set: updateData }, {
                new: true,
                upsert: true, // ✅ create if not exists
            });
            return aboutUsImages;
        });
    }
    updateAboutUsImages(payload, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!payload.aboutUsId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "AboutUs ID is required", {}, false);
            }
            const aboutUs = yield AboutUsImages_1.default.findById(payload.aboutUsId);
            if (!aboutUs) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "AboutUs not found", {}, false);
            }
            const createdById = aboutUs.CreatedBy.toString();
            // ===============================
            // 1️⃣ DELETE OVERVIEW IMAGES
            // ===============================
            if (payload.deleteOverviewImageIds) {
                const deleteIds = payload.deleteOverviewImageIds
                    .replace(/[\[\]\{\}]/g, "")
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean);
                if (deleteIds.length > 0) {
                    const imagesToDelete = aboutUs.OverviewImage.filter((img) => deleteIds.includes(img._id.toString()));
                    for (const img of imagesToDelete) {
                        const filePath = path_1.default.join("uploads", "overview", createdById, img.fileName);
                        yield this.fileHelper.deleteFile(filePath);
                    }
                    aboutUs.OverviewImage = aboutUs.OverviewImage.filter((img) => !deleteIds.includes(img._id.toString()));
                    aboutUs.markModified("OverviewImage");
                }
            }
            // ===============================
            // 2️⃣ DELETE CSR IMAGES
            // ===============================
            if (payload.deleteCSRImageIds) {
                const deleteIds = payload.deleteCSRImageIds
                    .replace(/[\[\]\{\}]/g, "")
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean);
                if (deleteIds.length > 0) {
                    const imagesToDelete = aboutUs.CorporateSocialResponsibilityImage.filter((img) => deleteIds.includes(img._id.toString()));
                    for (const img of imagesToDelete) {
                        const filePath = path_1.default.join("uploads", "overview", createdById, img.fileName);
                        yield this.fileHelper.deleteFile(filePath);
                    }
                    aboutUs.CorporateSocialResponsibilityImage =
                        aboutUs.CorporateSocialResponsibilityImage.filter((img) => !deleteIds.includes(img._id.toString()));
                    aboutUs.markModified("CorporateSocialResponsibilityImage");
                }
            }
            // ===============================
            // 3️⃣ ADD NEW UPLOADED FILES
            // ===============================
            if (((_a = files === null || files === void 0 ? void 0 : files.overviewImage) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const newOverviewImages = files.overviewImage.map((file) => ({
                    fileName: file.filename,
                }));
                aboutUs.OverviewImage.push(...newOverviewImages);
                aboutUs.markModified("OverviewImage");
            }
            if (((_b = files === null || files === void 0 ? void 0 : files.corpoImage) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                const newCSRImages = files.corpoImage.map((file) => ({
                    fileName: file.filename,
                }));
                aboutUs.CorporateSocialResponsibilityImage.push(...newCSRImages);
                aboutUs.markModified("CorporateSocialResponsibilityImage");
            }
            // ===============================
            // 4️⃣ SAVE (NO NEW RECORD)
            // ===============================
            yield aboutUs.save();
            return aboutUs;
        });
    }
    getAboutUsImages() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Fetch single AboutUs document
            const aboutUs = yield AboutUsImages_1.default.findOne().lean();
            if (!aboutUs) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'About Us data not found');
            }
            const createdByIdString = (_a = aboutUs.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString();
            // ===============================
            // Map Overview Images
            // ===============================
            aboutUs.OverviewImage = aboutUs.OverviewImage.map((img) => (Object.assign(Object.assign({}, img), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.OVERVIEW, [createdByIdString, img.fileName]) })));
            // ===============================
            // Map CSR Images
            // ===============================
            aboutUs.CorporateSocialResponsibilityImage =
                aboutUs.CorporateSocialResponsibilityImage.map((img) => (Object.assign(Object.assign({}, img), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.OVERVIEW, [createdByIdString, img.fileName]) })));
            return aboutUs;
        });
    }
}
exports.OverviewService = OverviewService;
