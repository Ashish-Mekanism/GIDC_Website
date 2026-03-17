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
exports.AdminVideoGalleryService = void 0;
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const AdminVideoGallery_1 = __importDefault(require("../../../models/AdminVideoGallery"));
const path_1 = __importDefault(require("path"));
class AdminVideoGalleryService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createAdminVideoGallery(payload, userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure files exist
            if (!files || files.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "No Video Uploaded", {}, false);
            }
            const videoFile = {
                fileName: files.Videos[0].filename,
            };
            const posterFileName = files.Poster[0].filename;
            // Prepare the gallery data
            const newGallery = new AdminVideoGallery_1.default({
                CreatedBy: userId,
                Heading: payload.Heading,
                Date: payload.Date,
                Videos: [videoFile],
                Poster: posterFileName,
            });
            // Save to database
            yield newGallery.save();
            return newGallery;
        });
    }
    getAdminVideoGalleryList() {
        return __awaiter(this, void 0, void 0, function* () {
            const AdminPhotoGalleryList = yield AdminVideoGallery_1.default.aggregate([
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
                        Photos: 0,
                        SeminarBy: 0,
                    }
                }
            ]);
            const totalCount = yield AdminVideoGallery_1.default.countDocuments();
            return { totalCount, AdminPhotoGalleryList };
        });
    }
    getAdminVideoGalleryListUserSide() {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Aggregate and enrich with user details
            const AdminPhotoGalleryList = yield AdminVideoGallery_1.default.aggregate([
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
                // {
                //     $addFields: {
                //         CreatedById: "$CreatedBy", // Preserve original ObjectId
                //         CreatedBy: {
                //             email: "$creatorDetails.email",
                //             userType: {
                //                 $switch: {
                //                     branches: [
                //                         { case: { $eq: ["$creatorDetails.user_type", 1] }, then: "SUPER_ADMIN" },
                //                         { case: { $eq: ["$creatorDetails.user_type", 2] }, then: "SUB_ADMIN" },
                //                         { case: { $eq: ["$creatorDetails.user_type", 3] }, then: "USER" }
                //                     ],
                //                     default: "Unknown"
                //                 }
                //             }
                //         }
                //     }
                // },
                {
                    $project: {
                        creatorDetails: 0, // Clean up unnecessary fields
                        Photos: 0,
                        SeminarBy: 0
                    }
                }
            ]);
            // Step 2: Get total count for pagination/stats
            const totalCount = yield AdminVideoGallery_1.default.countDocuments();
            // Step 3: Add video URLs, Heading, and Date to each video
            const updatedGalleryList = AdminPhotoGalleryList.map(gallery => {
                var _a;
                const createdByIdString = (_a = gallery === null || gallery === void 0 ? void 0 : gallery.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString(); // ✅ FIXED
                if (Array.isArray(gallery.Videos)) {
                    gallery.Videos = gallery.Videos.map((video) => (Object.assign(Object.assign({}, video), { videoUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, video.fileName]), posterUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, gallery.Poster]), Heading: gallery.Heading, Date: gallery.Date // Add Date to each video
                     })));
                }
                // Remove Heading and Date from the gallery object
                delete gallery.Heading;
                delete gallery.Date;
                delete gallery.CreatedById; // Clean up the ObjectId field
                delete gallery.CreatedBy; // Clean up the ObjectId field
                return gallery;
            });
            // Step 4: Return final data
            return {
                totalCount,
                AdminPhotoGalleryList: updatedGalleryList
            };
        });
    }
    getAdminGalleryVideos(adminVideoGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the gallery from the database
            const gallery = yield AdminVideoGallery_1.default.findById(adminVideoGalleryId).lean();
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
            // Ensure userId is converted to a string
            const createdByIdString = (_a = gallery.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString();
            // Map through photos array to generate full URL paths
            gallery.Videos = gallery.Videos.map(video => (Object.assign(Object.assign({}, video), { videoUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, video.fileName]) })));
            gallery.Poster = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, gallery.Poster]);
            return gallery;
        });
    }
    updateAdminVideoGallery(payload, adminVideoGalleryId, files // Array of image files
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that we have a gallery id to update.
            if (!adminVideoGalleryId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Admin Video Gallery ID Is Required", {}, false);
            }
            // Find the gallery document by ID.
            const gallery = yield AdminVideoGallery_1.default.findById(adminVideoGalleryId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery Not Found", {}, false);
            }
            const CreatedById = gallery.CreatedBy.toString();
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds = [];
            if (payload.deleteGalleryVideoId) {
                // Clean up the incoming delete photo IDs
                const cleaned = payload.deleteGalleryVideoId.replace(/[\[\]\{\}]/g, "");
                deleteIds = cleaned.split(",").map((id) => id.trim()).filter((id) => id); // Remove empty strings
            }
            if (deleteIds.length > 0) {
                // Find the photos that need to be deleted
                const photosToDelete = gallery.Videos.filter((photo) => deleteIds.includes(photo._id.toString()));
                // Get the filenames of the photos to delete
                const deleteFileNames = photosToDelete.map((photo) => photo.fileName);
                // Delete each file from the file system
                if (deleteFileNames.length > 0) {
                    const deletePromises = deleteFileNames.map((filename) => {
                        const filePath = path_1.default.join("uploads", "adminVideoGallery", CreatedById, filename);
                        return this.fileHelper.deleteFile(filePath);
                    });
                    yield Promise.all(deletePromises);
                }
                // Remove deleted photos from the gallery's photos array
                gallery.Videos = gallery.Videos.filter((photo) => !deleteIds.includes(photo._id.toString()));
                // Important: Mark the field as modified
                gallery.markModified("Photos");
            }
            // ******************************
            // 2. ADD NEW UPLOADED FILES (IF ANY)
            // ******************************
            if (files && files.Videos && files.Videos.length > 0) {
                // Process each new file and add to the gallery
                // const newPhotos = files.map((file: any) => ({
                //     fileName: file.filename,
                // }));
                const videoFile = {
                    fileName: files.Videos[0].filename,
                };
                gallery.Videos = [videoFile];
                // Mark Photos field as modified
                gallery.markModified("Videos");
            }
            // ******************************
            // 3. UPDATE GALLERY DETAILS
            // ******************************
            // 3. UPDATE POSTER (if any)
            // ******************************
            if (files && files.Poster && files.Poster.length > 0) {
                const newPoster = files.Poster[0].filename;
                // Delete the old poster file from disk
                if (gallery.Poster) {
                    const oldPosterPath = path_1.default.join("uploads", "adminVideoGallery", CreatedById, gallery.Poster);
                    yield this.fileHelper.deleteFile(oldPosterPath);
                }
                // Update poster
                gallery.Poster = newPoster;
                gallery.markModified("Poster");
            }
            if (payload.Heading) {
                gallery.Heading = payload.Heading;
            }
            if (payload.Date) {
                gallery.Date = payload.Date;
            }
            // Ensure Mongoose detects changes in other fields
            gallery.markModified("Heading");
            gallery.markModified("Date");
            // Save the updated gallery document
            yield gallery.save();
            return gallery;
        });
    }
    deleteAdminVideoGallery(adminVideoGalleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the gallery document
            const gallery = yield AdminVideoGallery_1.default.findById(adminVideoGalleryId);
            if (!gallery) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Gallery not found", {}, false);
            }
            // Extract the user ID from the gallery document
            const userId = gallery.CreatedBy.toString();
            // Delete each photo file
            const deleteFilePromises = gallery.Videos.map((photo) => {
                const filePath = path_1.default.join("uploads", "adminVideoGallery", userId, photo.fileName);
                return this.fileHelper.deleteFile(filePath);
            });
            // Wait for all file deletions to complete
            yield Promise.all(deleteFilePromises);
            // Delete the gallery document from the database
            yield AdminVideoGallery_1.default.deleteOne({ _id: adminVideoGalleryId });
            return {
                success: true,
                message: "Gallery and its video files have been deleted successfully",
            };
        });
    }
}
exports.AdminVideoGalleryService = AdminVideoGalleryService;
