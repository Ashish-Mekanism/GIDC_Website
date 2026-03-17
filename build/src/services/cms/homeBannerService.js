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
exports.HomeBannerService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const HomeBanner_1 = __importDefault(require("../../models/HomeBanner"));
const path_1 = __importDefault(require("path"));
class HomeBannerService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createHomeBanner(
    //payload: Partial<IForeignEmbassiesBody>,
    userId, files // Array of images
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure files exist
            if (!files || files.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "No Image Uploaded", {}, false);
            }
            const existingHomeBanner = yield HomeBanner_1.default.findOne();
            if (existingHomeBanner) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'HomeBanner' entry already exists. You cannot create another one.");
            }
            // Process uploaded images
            const homeBannerPhotos = files.map((file) => ({
                fileName: file.filename,
            }));
            // Prepare the gallery data
            const newGallery = new HomeBanner_1.default({
                CreatedBy: userId,
                Photos: homeBannerPhotos,
            });
            // Save to database
            yield newGallery.save();
            return newGallery;
        });
    }
    updateHomeBanner(payload, homeBannerId, files // Array of image files
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that we have a gallery id to update.
            if (!homeBannerId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Home BannerId ID is required", {}, false);
            }
            // Find the gallery document by ID.
            const gallery = yield HomeBanner_1.default.findById(homeBannerId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Home Banner Not Found", {}, false);
            }
            const CreatedById = gallery.CreatedBy.toString();
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds = [];
            if (payload.DeleteHomeBannerPhotoId) {
                // Clean up the incoming delete photo IDs
                const cleaned = payload.DeleteHomeBannerPhotoId.replace(/[\[\]\{\}]/g, "");
                deleteIds = cleaned.split(",").map((id) => id.trim()).filter((id) => id); // Remove empty strings
            }
            if (deleteIds.length > 0) {
                // Find the photos that need to be deleted
                const photosToDelete = gallery.Photos.filter((photo) => deleteIds.includes(photo._id.toString()));
                // Get the filenames of the photos to delete
                const deleteFileNames = photosToDelete.map((photo) => photo.fileName);
                // Delete each file from the file system
                if (deleteFileNames.length > 0) {
                    const deletePromises = deleteFileNames.map((filename) => {
                        const filePath = path_1.default.join("uploads", "homeBanner", CreatedById, filename);
                        return this.fileHelper.deleteFile(filePath);
                    });
                    yield Promise.all(deletePromises);
                }
                // Remove deleted photos from the gallery's photos array
                gallery.Photos = gallery.Photos.filter((photo) => !deleteIds.includes(photo._id.toString()));
                // Important: Mark the field as modified
                gallery.markModified("Photos");
            }
            // ******************************
            // 2. ADD NEW UPLOADED FILES (IF ANY)
            // ******************************
            if (files && files.length > 0) {
                // Process each new file and add to the gallery
                const newPhotos = files.map((file) => ({
                    fileName: file.filename,
                }));
                gallery.Photos.push(...newPhotos);
                // Mark Photos field as modified
                gallery.markModified("Photos");
            }
            // ******************************
            // 3. UPDATE GALLERY DETAILS
            // ******************************
            // Save the updated gallery document
            yield gallery.save();
            return gallery;
        });
    }
    getHomeBanner() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the gallery from the database
            const gallery = yield HomeBanner_1.default.findOne().lean();
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
            // Ensure userId is converted to a string
            const createdByIdString = (_a = gallery.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString();
            // Map through photos array to generate full URL paths
            gallery.Photos = gallery.Photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.HOMEBANNER, [createdByIdString, photo.fileName]) })));
            return gallery;
        });
    }
}
exports.HomeBannerService = HomeBannerService;
