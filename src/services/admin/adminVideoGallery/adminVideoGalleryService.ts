import { ObjectId } from "mongoose";
import { IAdminVideoGalleryBody, IUpdateAdminVideoGalleryBody } from "../../../types/requests";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import ApiError from "../../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../../utils/constants";
import AdminVideoGallery from "../../../models/AdminVideoGallery";
import path from "path";

export class AdminVideoGalleryService {

    fileHelper = new FileHelper();
    fileService = new FileService();

    async createAdminVideoGallery(
        payload: Partial<IAdminVideoGalleryBody>,
        userId: ObjectId,
        files: any, // Array of images

    ): Promise<any> {

        // Ensure files exist
        if (!files || files.length === 0) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "No Video Uploaded",
                {},
                false
            );
        }

        const videoFile = {
            fileName: files.Videos[0].filename,
        };

        const posterFileName = files.Poster[0].filename;

        // Prepare the gallery data
        const newGallery = new AdminVideoGallery({
            CreatedBy: userId,
            Heading: payload.Heading,
            Date: payload.Date,
            Videos: [videoFile],
            Poster: posterFileName,
        });

        // Save to database
        await newGallery.save();

        return newGallery;
    }

    async getAdminVideoGalleryList() {
        const AdminPhotoGalleryList = await AdminVideoGallery.aggregate([
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
                    creatorDetails: 0,// Exclude the extra user object
                    Photos: 0,
                    SeminarBy: 0,
                }
            }
        ]);

        const totalCount = await AdminVideoGallery.countDocuments();

        return { totalCount, AdminPhotoGalleryList };
    }

    async getAdminVideoGalleryListUserSide() {
        // Step 1: Aggregate and enrich with user details
        const AdminPhotoGalleryList = await AdminVideoGallery.aggregate([
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
        const totalCount = await AdminVideoGallery.countDocuments();

        // Step 3: Add video URLs, Heading, and Date to each video
        const updatedGalleryList = AdminPhotoGalleryList.map(gallery => {

            const createdByIdString = gallery?.CreatedBy?.toString(); // ✅ FIXED

            if (Array.isArray(gallery.Videos)) {
                gallery.Videos = gallery.Videos.map((video: any) => ({
                    ...video,
                    videoUrl: this.fileService.getFilePathFromDatabase(
                        FOLDER_NAMES.ADMINVIDEOGALERY,
                        [createdByIdString, video.fileName]
                    ),
                    posterUrl: this.fileService.getFilePathFromDatabase(
                        FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, gallery.Poster]),
                    Heading: gallery.Heading, // Add Heading to each video
                    Date: gallery.Date // Add Date to each video
                }));
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
    }


    async getAdminGalleryVideos(adminVideoGalleryId: string): Promise<any> {
        // Retrieve the gallery from the database
        const gallery = await AdminVideoGallery.findById(adminVideoGalleryId).lean();
        if (!gallery) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
        }

        // Ensure userId is converted to a string
        const createdByIdString = gallery.CreatedBy?.toString();

        // Map through photos array to generate full URL paths
        gallery.Videos = gallery.Videos.map(video => ({
            ...video,
            videoUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, video.fileName])

        }));
        gallery.Poster = this.fileService.getFilePathFromDatabase(FOLDER_NAMES.ADMINVIDEOGALERY, [createdByIdString, gallery.Poster]);
        return gallery;
    }


    async updateAdminVideoGallery(
        payload: Partial<IUpdateAdminVideoGalleryBody>,
        adminVideoGalleryId: string,
        files: any // Array of image files
    ): Promise<any> {
        // Validate that we have a gallery id to update.
        if (!adminVideoGalleryId) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Admin Video Gallery ID Is Required", {}, false);
        }

        // Find the gallery document by ID.
        const gallery = await AdminVideoGallery.findById(adminVideoGalleryId);

        if (!gallery) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Gallery Not Found", {}, false);
        }

        const CreatedById = gallery.CreatedBy.toString();

        // ******************************
        // 1. DELETE SPECIFIED PHOTOS
        // ******************************
        let deleteIds: string[] = [];

        if (payload.deleteGalleryVideoId) {
            // Clean up the incoming delete photo IDs
            const cleaned = payload.deleteGalleryVideoId.replace(/[\[\]\{\}]/g, "");
            deleteIds = cleaned.split(",").map((id: string) => id.trim()).filter((id: string) => id); // Remove empty strings
        }

        if (deleteIds.length > 0) {
            // Find the photos that need to be deleted
            const photosToDelete = gallery.Videos.filter((photo: any) => deleteIds.includes(photo._id.toString()));

            // Get the filenames of the photos to delete
            const deleteFileNames = photosToDelete.map((photo: any) => photo.fileName);

            // Delete each file from the file system
            if (deleteFileNames.length > 0) {
                const deletePromises = deleteFileNames.map((filename) => {
                    const filePath = path.join("uploads", "adminVideoGallery", CreatedById, filename);
                    return this.fileHelper.deleteFile(filePath);
                });

                await Promise.all(deletePromises);
            }

            // Remove deleted photos from the gallery's photos array
            gallery.Videos = gallery.Videos.filter((photo: any) => !deleteIds.includes(photo._id.toString()));

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
                const oldPosterPath = path.join("uploads", "adminVideoGallery", CreatedById, gallery.Poster);
                await this.fileHelper.deleteFile(oldPosterPath);
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
        await gallery.save();

        return gallery;
    }

    async deleteAdminVideoGallery(adminVideoGalleryId: string): Promise<any> {
        // Fetch the gallery document
        const gallery = await AdminVideoGallery.findById(adminVideoGalleryId);

        if (!gallery) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Gallery not found",
                {},
                false
            );
        }

        // Extract the user ID from the gallery document
        const userId = gallery.CreatedBy.toString();

        // Delete each photo file
        const deleteFilePromises = gallery.Videos.map((photo: any) => {
            const filePath = path.join("uploads", "adminVideoGallery", userId, photo.fileName);
            return this.fileHelper.deleteFile(filePath);
        });

        // Wait for all file deletions to complete
        await Promise.all(deleteFilePromises);

        // Delete the gallery document from the database
        await AdminVideoGallery.deleteOne({ _id: adminVideoGalleryId });

        return {
            success: true,
            message: "Gallery and its video files have been deleted successfully",
        };
    }



}