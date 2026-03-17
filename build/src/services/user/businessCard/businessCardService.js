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
exports.BusinessCardService = void 0;
const BusinessCard_1 = __importDefault(require("../../../models/BusinessCard"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const helper_1 = require("../../../utils/helper");
const paginationService_1 = require("../../paginationService");
const DigitalCardGallery_1 = __importDefault(require("../../../models/DigitalCardGallery"));
const path_1 = __importDefault(require("path"));
const DigitalCardSlider_1 = __importDefault(require("../../../models/DigitalCardSlider"));
const config_1 = __importDefault(require("../../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
class BusinessCardService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createBusinessCard(payload, user_id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileImage = file ? file.filename : null;
            const updatedPayload = Object.assign(Object.assign({}, payload), { userId: user_id, profilePhoto: profileImage, active: true });
            console.log(updatedPayload, "updatedPayload");
            return yield BusinessCard_1.default.create(updatedPayload);
        });
    }
    updateBusinessCard(payload, businessCardId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const businessCard = yield BusinessCard_1.default.findById((0, helper_1.toObjectId)(businessCardId));
            if (!businessCard) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Business card not found", {}, false);
            }
            // Prepare old file path for deletion if it exists
            // let oldFilePath = businessCard.profilePhoto
            //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
            //   : null;
            let oldFilePath = `uploads/businessCard/${businessCard.userId}/${businessCard.profilePhoto}`;
            let newProfilePhoto = file ? file.filename : businessCard.profilePhoto;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { profilePhoto: newProfilePhoto });
            // Update business card in database
            const updatedBusinessCard = (yield BusinessCard_1.default.findByIdAndUpdate(businessCardId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && businessCard.profilePhoto) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedBusinessCard;
        });
    }
    activeInactiveBusinessCard(payload, businessCardId, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Find existing business card
            const businessCard = yield BusinessCard_1.default.findById(businessCardId);
            if (!businessCard) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Business card not found", {}, false);
            }
            if (businessCard.userId.toString() !== userid.toString()) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.UNAUTHORIZED, "You can't activate or deactivate this business card", {}, false);
            }
            // Ensure active field is boolean
            const isActive = (_a = payload.active) !== null && _a !== void 0 ? _a : false;
            // Check if the active state is already the same as the requested state
            if (businessCard.active === isActive) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, `Business card is already ${isActive ? 'active' : 'inactive'}`, {}, false);
            }
            // Update active status
            businessCard.active = isActive;
            yield businessCard.save();
            return Object.assign(Object.assign({}, businessCard.toObject()), { message: `Business card successfully ${isActive ? 'activated' : 'deactivated'}` });
        });
    }
    // async getBusinessCard(businessCardId: string): Promise<any> {
    //   // Retrieve the business card from the database
    //   const businessCard = await BusinessCardModel.findById(businessCardId).lean();
    //   if (!businessCard) {
    //     throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Business card not found');
    //   }
    //   // Update the profilePhoto field with the full URL.
    //   // Adjust the module and submodules as required by your folder structure.
    //   // For example, if profile photos are stored under: uploads/profile/
    //   const userIdString = businessCard.userId?.toString()
    //   businessCard.profilePhoto = this.fileService.getFilePathFromDatabase(FOLDER_NAMES.BUSINESSCARD, [userIdString, businessCard.profilePhoto]);
    //   return businessCard;
    // }
    getBusinessCard(businessCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Retrieve the business card from the database
            const businessCard = yield BusinessCard_1.default.findById(businessCardId).lean();
            if (!businessCard) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Business card not found');
            }
            if (businessCard.active === false) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Business card is Inactive');
            }
            // Update the profilePhoto field with the full URL
            const userIdString = (_a = businessCard.userId) === null || _a === void 0 ? void 0 : _a.toString();
            const businessCardString = (_b = businessCard._id) === null || _b === void 0 ? void 0 : _b.toString();
            businessCard.profilePhoto = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.BUSINESSCARD, [userIdString, businessCard.profilePhoto]);
            // Fetch the digital card gallery
            const digitalCardGallery = yield DigitalCardGallery_1.default.find({
                digitalCardId: businessCard._id
            }).lean();
            // Fetch the digital card slider
            const digitalCardSlider = yield DigitalCardSlider_1.default.findOne({
                digitalCardId: businessCard._id
            }).lean();
            // Format file paths for gallery photos
            digitalCardGallery.forEach(gallery => {
                gallery.photos = gallery.photos.map(photo => (Object.assign(Object.assign({}, photo), { filePath: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.DIGITALCARDGALLERY, [businessCardString, photo.fileName]) })));
            });
            // Format file paths for slider photos
            if (digitalCardSlider) {
                digitalCardSlider.photos = digitalCardSlider.photos.map(photo => (Object.assign(Object.assign({}, photo), { filePath: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.DIGITALCARDSLIDER, [businessCardString, photo.fileName]) })));
            }
            return Object.assign(Object.assign({}, businessCard), { digitalCardGallery,
                digitalCardSlider });
        });
    }
    // async getPaginationUserDigitalCardList(
    //   queryParams: PaginationOptions,
    //   userId: ObjectId
    // ) {
    //   const parsedParams = parsePaginationParams(queryParams);
    //   const { skip, limit, sort } = generatePaginationOptions(parsedParams);
    //   // Define the match condition
    //   const dynamicMatch = {
    //     userId, // Filtering by userId (assuming userId is an ObjectId)
    //   };
    //   // Fetch digital card list
    //   const digitalCardList = await BusinessCardModel.aggregate([
    //     { $match: dynamicMatch },
    //     // Project only required fields
    //     {
    //       $project: {
    //         _id: 1,
    //         createdAt: 1,
    //         updateAt: 1,
    //         name: 1,
    //         active: 1,
    //       },
    //     },
    //     // Sorting, Pagination
    //     { $sort: sort },
    //     { $skip: skip },
    //     { $limit: limit },
    //   ]);
    //   // Generate pagination response
    //   const paginatedResponse = await generatePaginatedResponse(
    //     parsedParams,
    //     BusinessCardModel, // Pass the correct model here
    //     dynamicMatch
    //   );
    //   return {
    //     ...paginatedResponse,
    //     digitalCardList,
    //   };
    // }
    getUserDigitalCardList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const FeBaseURL = config_1.default.FE_BASE_URL;
            // Convert userId to ObjectId if it's a string
            const convertedUserId = typeof userId === 'string' && ObjectId.isValid(userId)
                ? (0, helper_1.toObjectId)(userId)
                : userId;
            const matchCondition = {
                userId: convertedUserId,
            };
            const digitalCardList = yield BusinessCard_1.default.aggregate([
                { $match: matchCondition },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        name: 1,
                        active: 1,
                    },
                },
                {
                    $addFields: {
                        url: {
                            $concat: [
                                FeBaseURL,
                                "/e-card/",
                                { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "-" } } },
                                "/",
                                { $toString: "$_id" },
                            ],
                        },
                    },
                },
                { $sort: { createdAt: -1 } }, // Optional: sort by newest first
            ]);
            return {
                total: digitalCardList.length,
                digitalCardList,
            };
        });
    }
    // async getPaginationUserDigitalCardList(
    //   queryParams: PaginationOptions,
    //   userId: ObjectId| string
    // ) {
    //  const FeBaseURL = Config.FE_BASE_URL;
    //   const parsedParams = parsePaginationParams(queryParams);
    //   const { skip, limit, sort } = generatePaginationOptions(parsedParams);
    //   const convertedUserId =
    //   typeof userId === 'string' && ObjectId.isValid(userId)
    //     ? toObjectId(userId)
    //     : userId;
    //   // Define the match condition
    //   const dynamicMatch = {
    //     userId:convertedUserId , // Filtering by userId (assuming userId is an ObjectId)
    //   };
    // console.log(dynamicMatch,'dynamicMatch');
    //   // Fetch digital card list
    //   const digitalCardList = await BusinessCardModel.aggregate([
    //     { $match: dynamicMatch },
    //     // Project only required fields
    //     {
    //       $project: {
    //         _id: 1,
    //         createdAt: 1,
    //         updatedAt: 1,
    //         name: 1,
    //         active: 1,
    //       },
    //     },
    //     // Add URL field dynamically
    //     {
    //       $addFields: {
    //         url: {
    //           $concat: [
    //             FeBaseURL,
    //             "/e-card/",
    //             { $toLower: { $replaceAll: { input: "$name", find: " ", replacement: "-" } } },
    //             "/",
    //             { $toString: "$_id" }
    //           ],
    //         },
    //       },
    //     },
    //     // Sorting, Pagination
    //     { $sort: sort },
    //     { $skip: skip },
    //     { $limit: limit },
    //   ]);
    //   // Generate pagination response
    //   const paginatedResponse = await generatePaginatedResponse(
    //     parsedParams,
    //     BusinessCardModel, // Pass the correct model here
    //     dynamicMatch
    //   );
    //   return {
    //     ...paginatedResponse,
    //     digitalCardList,
    //   };
    // }
    getPaginationUserDigitalGalleryList(queryParams, businessCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedParams = (0, paginationService_1.parsePaginationParams)(queryParams);
            const { skip, limit, sort } = (0, paginationService_1.generatePaginationOptions)(parsedParams);
            const galleryExist = yield DigitalCardGallery_1.default.findOne({ digitalCardId: businessCardId });
            if (!galleryExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, // Or another appropriate status code for conflicts
                " Digital Gallery Does Not Exists", {}, false);
            }
            // Define the match condition
            const dynamicMatch = {
                digitalCardId: (0, helper_1.toObjectId)(businessCardId)
            };
            // Fetch digital card list
            const digitalGalleryList = yield DigitalCardGallery_1.default.aggregate([
                { $match: dynamicMatch },
                // Project only required fields
                {
                    $project: {
                        _id: 1,
                        galleryName: 1,
                    },
                },
                // Sorting, Pagination
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
            ]);
            // Generate pagination response
            const paginatedResponse = yield (0, paginationService_1.generatePaginatedResponse)(parsedParams, DigitalCardGallery_1.default, // Pass the correct model here
            dynamicMatch);
            return Object.assign(Object.assign({}, paginatedResponse), { digitalGalleryList });
        });
    }
    digitalCardGallery(payload, businessCardId, files // Array of images
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure files exist
            if (!files || files.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "No Image Uploded", {}, false);
            }
            // Process uploaded images
            const galleryPhotos = files.map((file) => ({
                fileName: file.filename,
            }));
            // Prepare the gallery data
            const newGallery = new DigitalCardGallery_1.default({
                digitalCardId: businessCardId,
                galleryName: payload.galleryName,
                photos: galleryPhotos,
            });
            // Save to database
            yield newGallery.save();
            return { success: true, message: "Gallery saved successfully", newGallery };
        });
    }
    updateDigitalCardGallery(payload, businessCardId, files // Array of image files
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that we have a gallery id to update.
            if (!payload.digitalCardGalleryId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Digital card gallery id is required", {}, false);
            }
            // Find the gallery document (and ensure it belongs to the businessCardId)
            const gallery = yield DigitalCardGallery_1.default.findOne({
                _id: payload.digitalCardGalleryId,
                digitalCardId: businessCardId,
            });
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery Not Found", {}, false);
            }
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds = [];
            if (payload.deleteGalleryPhotosId) {
                /**
                 * The incoming string might look like:
                 * "[[67a05d70e3dbc4df769c6363},{67a05d70e3dbc4df769c6362}]"
                 * Remove square brackets and curly braces, then split by comma.
                 */
                const cleaned = payload.deleteGalleryPhotosId.replace(/[\[\]\{\}]/g, "");
                deleteIds = cleaned
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id); // Remove empty strings
            }
            // Get the photos to delete from the gallery document.
            const photosToDelete = gallery.photos.filter((photo) => deleteIds.includes(photo._id.toString()));
            // Get the filenames of the photos that need to be deleted.
            const deleteFileNames = photosToDelete.map((photo) => photo.fileName);
            // Delete each file using FileHelper and the correct path:
            // The expected path is: uploads/digitalCardGallery/<userId>/<filename>
            if (deleteFileNames.length > 0) {
                const deletePromises = deleteFileNames.map((filename) => {
                    const filePath = path_1.default.join("uploads", "digitalCardGallery", businessCardId, filename);
                    return this.fileHelper.deleteFile(filePath);
                });
                yield Promise.all(deletePromises);
            }
            // Remove the deleted photos from the gallery's photos array.
            gallery.photos = gallery.photos.filter((photo) => !deleteIds.includes(photo._id.toString()));
            // ******************************
            // 2. ADD NEW UPLOADED FILES (IF ANY)
            // ******************************
            if (files && files.length > 0) {
                // Process each new file.
                // Ensure that the file object has the expected properties.
                const newPhotos = files.map((file) => ({
                    fileName: file.filename, // Adjust if you need file.originalname or file.path
                    // Optionally, include fileUrl if applicable:
                    // fileUrl: file.path || file.location,
                }));
                // Append the new photos to the existing photos array.
                gallery.photos.push(...newPhotos);
            }
            // ******************************
            // 3. UPDATE GALLERY DETAILS
            // ******************************
            if (payload.galleryName) {
                gallery.galleryName = payload.galleryName;
            }
            // Save the updated gallery document.
            yield gallery.save();
            return {
                success: true,
                message: "Gallery updated successfully",
                gallery,
            };
        });
    }
    deleteDigitalCardGallery(digitalCardGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the gallery document and populate the digitalCardId reference.
            // Assumes that the referenced BusinessCard document has a userId field.
            const gallery = yield DigitalCardGallery_1.default.findById(digitalCardGalleryId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery not found", {}, false);
            }
            // Extract the business card object from the populated field.
            const businessCard = gallery.digitalCardId;
            console.log(businessCard, '  businessCard');
            // Ensure that the businessCard has a userId.
            if (!businessCard) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Business card id not found", {}, false);
            }
            const userId = businessCard.toString();
            // Delete each photo file.
            // Construct the file path: uploads/digitalCardGallery/<userId>/<fileName>
            const deleteFilePromises = gallery.photos.map((photo) => {
                const filePath = path_1.default.join("uploads", "digitalCardGallery", userId, photo.fileName);
                console.log(filePath, 'filePath');
                return this.fileHelper.deleteFile(filePath);
            });
            // Wait for all file deletions to complete.
            yield Promise.all(deleteFilePromises);
            // Delete the gallery document from the database.
            yield DigitalCardGallery_1.default.deleteOne({ _id: digitalCardGalleryId });
            return {
                success: true,
                message: "Gallery and its image files have been deleted successfully",
            };
        });
    }
    digitalCardSlider(businessCardId, files // Array of images
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure files exist
            if (!files || files.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "No Image Uploded", {}, false);
            }
            const sliderExist = yield DigitalCardSlider_1.default.findOne({ digitalCardId: businessCardId });
            if (sliderExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, // Or another appropriate status code for conflicts
                "Slider already exists", {}, false);
            }
            // Process uploaded images
            const sliderPhotos = files.map((file) => ({
                fileName: file.filename,
            }));
            // Prepare the gallery data
            const newGallery = new DigitalCardSlider_1.default({
                digitalCardId: businessCardId,
                photos: sliderPhotos,
            });
            // Save to database
            yield newGallery.save();
            return { success: true, message: "Slider saved successfully", newGallery };
        });
    }
    updateDigitalCardSlider(payload, businessCardId, files // Array of image files
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that we have a gallery id to update.
            if (!payload.digitalCardSliderId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Digital card gallery id is required", {}, false);
            }
            // Find the gallery document (and ensure it belongs to the businessCardId)
            const slider = yield DigitalCardSlider_1.default.findOne({
                _id: payload.digitalCardSliderId,
                digitalCardId: businessCardId,
            });
            if (!slider) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Slider Not Found", {}, false);
            }
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds = [];
            if (payload.deleteSliderPhotosId) {
                /**
                 * The incoming string might look like:
                 * "[[67a05d70e3dbc4df769c6363},{67a05d70e3dbc4df769c6362}]"
                 * Remove square brackets and curly braces, then split by comma.
                 */
                const cleaned = payload.deleteSliderPhotosId.replace(/[\[\]\{\}]/g, "");
                deleteIds = cleaned
                    .split(",")
                    .map((id) => id.trim())
                    .filter((id) => id); // Remove empty strings
            }
            // Get the photos to delete from the gallery document.
            const photosToDelete = slider.photos.filter((photo) => deleteIds.includes(photo._id.toString()));
            // Get the filenames of the photos that need to be deleted.
            const deleteFileNames = photosToDelete.map((photo) => photo.fileName);
            // Delete each file using FileHelper and the correct path:
            // The expected path is: uploads/digitalCardGallery/<userId>/<filename>
            if (deleteFileNames.length > 0) {
                const deletePromises = deleteFileNames.map((filename) => {
                    const filePath = path_1.default.join("uploads", "digitalCardSlider", businessCardId, filename);
                    // const filePath = `${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.DIGITALCARDSLIDER}/${filename}`;
                    return this.fileHelper.deleteFile(filePath);
                });
                yield Promise.all(deletePromises);
            }
            // Remove the deleted photos from the gallery's photos array.
            slider.photos = slider.photos.filter((photo) => !deleteIds.includes(photo._id.toString()));
            // ******************************
            // 2. ADD NEW UPLOADED FILES (IF ANY)
            // ******************************
            if (files && files.length > 0) {
                // Process each new file.
                // Ensure that the file object has the expected properties.
                const newPhotos = files.map((file) => ({
                    fileName: file.filename, // Adjust if you need file.originalname or file.path
                    // Optionally, include fileUrl if applicable:
                    // fileUrl: file.path || file.location,
                }));
                // Append the new photos to the existing photos array.
                slider.photos.push(...newPhotos);
            }
            // ******************************
            // 3. UPDATE GALLERY DETAILS
            // ******************************
            // Save the updated gallery document.
            yield slider.save();
            return {
                success: true,
                message: "Gallery updated successfully",
                slider,
            };
        });
    }
    getDigitalCardGalleryImages(digitalCardGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the gallery from the database
            const gallery = yield DigitalCardGallery_1.default.findById(digitalCardGalleryId).lean();
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
            // Ensure userId is converted to a string
            const digitalCardIdString = (_a = gallery.digitalCardId) === null || _a === void 0 ? void 0 : _a.toString();
            // Map through photos array to generate full URL paths
            gallery.photos = gallery.photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.DIGITALCARDGALLERY, [digitalCardIdString, photo.fileName]) })));
            return gallery;
        });
    }
    getDigitalCardSliderImages(digitalCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the gallery from the database
            const slider = yield DigitalCardSlider_1.default.findOne({ digitalCardId: digitalCardId }).lean();
            if (!slider) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
            // Ensure userId is converted to a string
            const digitalCardIdString = (_a = slider.digitalCardId) === null || _a === void 0 ? void 0 : _a.toString();
            // Map through photos array to generate full URL paths
            slider.photos = slider.photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.DIGITALCARDSLIDER, [digitalCardIdString, photo.fileName]) })));
            return slider;
        });
    }
    getDigitalCardGalleries(digitalCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Retrieve all galleries that match the digitalCardId
            const galleries = yield DigitalCardGallery_1.default.find({ digitalCardId }).lean();
            if (!galleries || galleries.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'No galleries found');
            }
            // Map through each gallery
            return galleries.map(gallery => {
                var _a;
                const digitalCardIdString = (_a = gallery.digitalCardId) === null || _a === void 0 ? void 0 : _a.toString();
                return Object.assign(Object.assign({}, gallery), { photos: gallery.photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.DIGITALCARDGALLERY, [digitalCardIdString, photo.fileName]) }))) });
            });
        });
    }
}
exports.BusinessCardService = BusinessCardService;
