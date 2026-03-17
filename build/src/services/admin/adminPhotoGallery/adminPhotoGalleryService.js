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
exports.AdminPhotoGalleryService = void 0;
const AdminPhotoGallery_1 = __importDefault(require("../../../models/AdminPhotoGallery"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const path_1 = __importDefault(require("path"));
class AdminPhotoGalleryService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createAdminPhotoGallery(payload, userId, files // Array of images
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure files exist
            if (!files || files.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "No Image Uploaded", {}, false);
            }
            // Process uploaded images
            const galleryPhotos = files.map((file) => ({
                fileName: file.filename,
            }));
            // Prepare the gallery data
            const newGallery = new AdminPhotoGallery_1.default({
                CreatedBy: userId,
                Heading: payload.Heading,
                SeminarBy: payload.SeminarBy,
                Date: payload.Date,
                Photos: galleryPhotos,
            });
            // Save to database
            yield newGallery.save();
            return newGallery;
        });
    }
    updateAdminPhotoGallery(payload, adminPhotoGalleryId, files // Array of image files
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that we have a gallery id to update.
            if (!adminPhotoGalleryId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Admin photo gallery ID is required", {}, false);
            }
            // Find the gallery document by ID.
            const gallery = yield AdminPhotoGallery_1.default.findById(adminPhotoGalleryId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery Not Found", {}, false);
            }
            const CreatedById = gallery.CreatedBy.toString();
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds = [];
            if (payload.deleteGalleryPhotosId) {
                // Clean up the incoming delete photo IDs
                const cleaned = payload.deleteGalleryPhotosId.replace(/[\[\]\{\}]/g, "");
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
                        const filePath = path_1.default.join("uploads", "adminPhotoGallery", CreatedById, filename);
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
            if (payload.Heading) {
                gallery.Heading = payload.Heading;
            }
            if (payload.SeminarBy) {
                gallery.SeminarBy = payload.SeminarBy;
            }
            if (payload.Date) {
                gallery.Date = payload.Date;
            }
            // Ensure Mongoose detects changes in other fields
            gallery.markModified("Heading");
            gallery.markModified("SeminarBy");
            gallery.markModified("Date");
            // Save the updated gallery document
            yield gallery.save();
            return gallery;
        });
    }
    deleteAdminPhotoGallery(adminPhotoGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the gallery document
            const gallery = yield AdminPhotoGallery_1.default.findById(adminPhotoGalleryId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery not found", {}, false);
            }
            // Extract the user ID from the gallery document
            const userId = gallery.CreatedBy.toString();
            // Delete each photo file
            const deleteFilePromises = gallery.Photos.map((photo) => {
                const filePath = path_1.default.join("uploads", "adminPhotoGallery", userId, photo.fileName);
                return this.fileHelper.deleteFile(filePath);
            });
            // Wait for all file deletions to complete
            yield Promise.all(deleteFilePromises);
            // Delete the gallery document from the database
            yield AdminPhotoGallery_1.default.deleteOne({ _id: adminPhotoGalleryId });
            return {
                success: true,
                message: "Gallery and its image files have been deleted successfully",
            };
        });
    }
    // async getAdminPhotoGalleryList() {
    //     const AdminPhotoGalleryList = await AdminPhotoGallery.find({}, { 
    //         _id: 1, 
    //         CreatedBy: 1,
    //         Heading: 1, 
    //         Date: 1, 
    //         createdAt: 1 
    //     }).populate({
    //         path: "CreatedBy",  // Assuming CreatedBy is the userId reference
    //         select: "email user_type", // Selecting only email and role from User collection
    //         model: "User" // Ensuring it refers to the User collection
    //     });
    //     const totalCount = await AdminPhotoGallery.countDocuments();
    //     return { totalCount, AdminPhotoGalleryList };
    // }
    getAdminPhotoGalleryList() {
        return __awaiter(this, void 0, void 0, function* () {
            const AdminPhotoGalleryList = yield AdminPhotoGallery_1.default.aggregate([
                {
                    $lookup: {
                        from: "users", // The collection name for User
                        localField: "CreatedBy",
                        foreignField: "_id",
                        as: "creatorDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$creatorDetails",
                        preserveNullAndEmptyArrays: true // Ensure it doesn't break if no user found
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
                        creatorDetails: 0, // Exclude the extra user object
                        photos: 0,
                        SeminarBy: 0,
                    }
                }
            ]);
            const totalCount = yield AdminPhotoGallery_1.default.countDocuments();
            return { totalCount, AdminPhotoGalleryList };
        });
    }
    getPhotoGalleryImages(adminPhotoGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the gallery from the database
            const gallery = yield AdminPhotoGallery_1.default.findById(adminPhotoGalleryId).lean();
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
            // Ensure userId is converted to a string
            const createdByIdString = (_a = gallery.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString();
            // Map through photos array to generate full URL paths
            gallery.Photos = gallery.Photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINPHOTOGALLERY, [createdByIdString, photo.fileName]) })));
            return gallery;
        });
    }
    getPhotoGalleryAllImages() {
        return __awaiter(this, void 0, void 0, function* () {
            // Retrieve all galleries from the database
            const galleries = yield AdminPhotoGallery_1.default.find().lean();
            // Map through each gallery to generate full URL paths for photos
            const updatedGalleries = galleries.map(gallery => {
                var _a;
                const createdByIdString = (_a = gallery.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString();
                return Object.assign(Object.assign({}, gallery), { photos: gallery.Photos.map(photo => (Object.assign(Object.assign({}, photo), { imageUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINPHOTOGALLERY, [createdByIdString, photo.fileName]) }))) });
            });
            return updatedGalleries;
        });
    }
}
exports.AdminPhotoGalleryService = AdminPhotoGalleryService;
