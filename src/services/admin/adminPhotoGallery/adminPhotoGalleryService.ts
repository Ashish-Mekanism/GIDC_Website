import { ObjectId } from "mongoose";
import AdminPhotoGallery from "../../../models/AdminPhotoGallery";
import { IAdminPhotoGalleryBody, IUpdateAdminPhotoGalleryBody } from "../../../types/requests";
import ApiError from "../../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../../utils/constants";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import path from "path";
export class AdminPhotoGalleryService {
    fileHelper = new FileHelper();
    fileService = new FileService();

    async createAdminPhotoGallery(
        payload: Partial<IAdminPhotoGalleryBody>,
        userId: ObjectId,
        files: any // Array of images
    ): Promise<any> {

        // Ensure files exist
        if (!files || files.length === 0) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "No Image Uploaded",
                {},
                false
            );
        }



        // Process uploaded images
        const galleryPhotos = files.map((file: any) => ({
            fileName: file.filename,
        }));

        // Prepare the gallery data
        const newGallery = new AdminPhotoGallery({
            CreatedBy: userId,
            Heading: payload.Heading,
            SeminarBy: payload.SeminarBy,
            Date: payload.Date,
            Photos: galleryPhotos,
        });

        // Save to database
        await newGallery.save();

        return newGallery;
    }

    async updateAdminPhotoGallery(
        payload: Partial<IUpdateAdminPhotoGalleryBody>,
        adminPhotoGalleryId: string,
        files: any // Array of image files
    ): Promise<any> {
        // Validate that we have a gallery id to update.
        if (!adminPhotoGalleryId) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Admin photo gallery ID is required", {}, false);
        }

        // Find the gallery document by ID.
        const gallery = await AdminPhotoGallery.findById(adminPhotoGalleryId);

        if (!gallery) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Gallery Not Found", {}, false);
        }

        const CreatedById = gallery.CreatedBy.toString();

        // ******************************
        // 1. DELETE SPECIFIED PHOTOS
        // ******************************
        let deleteIds: string[] = [];

        if (payload.deleteGalleryPhotosId) {
            // Clean up the incoming delete photo IDs
            const cleaned = payload.deleteGalleryPhotosId.replace(/[\[\]\{\}]/g, "");
            deleteIds = cleaned.split(",").map((id: string) => id.trim()).filter((id: string) => id); // Remove empty strings
        }

        if (deleteIds.length > 0) {
            // Find the photos that need to be deleted
            const photosToDelete = gallery.Photos.filter((photo: any) => deleteIds.includes(photo._id.toString()));

            // Get the filenames of the photos to delete
            const deleteFileNames = photosToDelete.map((photo: any) => photo.fileName);

            // Delete each file from the file system
            if (deleteFileNames.length > 0) {
                const deletePromises = deleteFileNames.map((filename) => {
                    const filePath = path.join("uploads", "adminPhotoGallery", CreatedById, filename);
                    return this.fileHelper.deleteFile(filePath);
                });

                await Promise.all(deletePromises);
            }

            // Remove deleted photos from the gallery's photos array
            gallery.Photos = gallery.Photos.filter((photo: any) => !deleteIds.includes(photo._id.toString()));

            // Important: Mark the field as modified
            gallery.markModified("Photos");
        }

        // ******************************
        // 2. ADD NEW UPLOADED FILES (IF ANY)
        // ******************************
        if (files && files.length > 0) {
            // Process each new file and add to the gallery
            const newPhotos = files.map((file: any) => ({
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
        await gallery.save();

        return gallery;
    }

    async deleteAdminPhotoGallery(adminPhotoGalleryId: string): Promise<any> {
        // Fetch the gallery document
        const gallery = await AdminPhotoGallery.findById(adminPhotoGalleryId);

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
        const deleteFilePromises = gallery.Photos.map((photo: any) => {
            const filePath = path.join("uploads", "adminPhotoGallery", userId, photo.fileName);
            return this.fileHelper.deleteFile(filePath);
        });

        // Wait for all file deletions to complete
        await Promise.all(deleteFilePromises);

        // Delete the gallery document from the database
        await AdminPhotoGallery.deleteOne({ _id: adminPhotoGalleryId });

        return {
            success: true,
            message: "Gallery and its image files have been deleted successfully",
        };
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
    
    async getAdminPhotoGalleryList() {
        const AdminPhotoGalleryList = await AdminPhotoGallery.aggregate([
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
                    creatorDetails: 0 ,// Exclude the extra user object
                    photos:0,
                    SeminarBy:0,
                }
            }
        ]);
    
        const totalCount = await AdminPhotoGallery.countDocuments();
    
        return { totalCount, AdminPhotoGalleryList };
    }


    async getPhotoGalleryImages(adminPhotoGalleryId: string): Promise<any> {
        // Retrieve the gallery from the database
        const gallery = await AdminPhotoGallery.findById(adminPhotoGalleryId).lean();
        if (!gallery) {
          throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
        }
    
        // Ensure userId is converted to a string
        const createdByIdString = gallery.CreatedBy?.toString();
    
        // Map through photos array to generate full URL paths
        gallery.Photos = gallery.Photos.map(photo => ({
          ...photo,
          imageUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.ADMINPHOTOGALLERY, [createdByIdString, photo.fileName])
        }));
    
        return gallery;
      }
    
    
      async getPhotoGalleryAllImages(): Promise<any> {
        // Retrieve all galleries from the database
        const galleries = await AdminPhotoGallery.find().lean();
        
        // Map through each gallery to generate full URL paths for photos
        const updatedGalleries = galleries.map(gallery => {
            const createdByIdString = gallery.CreatedBy?.toString();
            return {
                ...gallery,
                photos: gallery.Photos.map(photo => ({
                    ...photo,
                    imageUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.ADMINPHOTOGALLERY, [createdByIdString, photo.fileName])
                }))
            };
        });
    
        return updatedGalleries;
    }
    

}