import { ObjectId } from "mongoose";
import { IForeignEmbassiesBody, IUpdateForeignEmbassiesBody } from "../../types/requests";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import ForeignEmbassies from "../../models/ForeignEmbassies";
import path from "path";

export class ForeignEmbassiesService{


        fileHelper = new FileHelper();
        fileService = new FileService();
    
        async createForeignEmbassies(
            //payload: Partial<IForeignEmbassiesBody>,
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
       const existingForeignEmbassies= await ForeignEmbassies.findOne();
        
                if (existingForeignEmbassies) {
                    throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Foreign Embassies' entry already exists. You cannot create another one.");
                }
        

            // Process uploaded images
            const foreignEmbassiesPhotos = files.map((file: any) => ({
                fileName: file.filename,
            }));
    
            // Prepare the gallery data
            const newGallery = new ForeignEmbassies({
                CreatedBy: userId,
                Photos: foreignEmbassiesPhotos,
            });
    
            // Save to database
            await newGallery.save();
    
            return newGallery;
        }
    
        async updateForeignEmbassies(
            payload: Partial<IUpdateForeignEmbassiesBody>,
            foreignEmbassiesId: string,
            files: any // Array of image files
        ): Promise<any> {
            // Validate that we have a gallery id to update.
            if (!foreignEmbassiesId) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Foreign Embassies ID is required", {}, false);
            }
    
            // Find the gallery document by ID.
            const gallery = await ForeignEmbassies.findById(foreignEmbassiesId);
    
            if (!gallery) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Foreign Embassies Not Found", {}, false);
            }
    
            const CreatedById = gallery.CreatedBy.toString();
    
            // ******************************
            // 1. DELETE SPECIFIED PHOTOS
            // ******************************
            let deleteIds: string[] = [];
    
            if (payload.DeleteForeignEmbassiesPhotoId) {
                // Clean up the incoming delete photo IDs
                const cleaned = payload.DeleteForeignEmbassiesPhotoId.replace(/[\[\]\{\}]/g, "");
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
                        const filePath = path.join("uploads", "foreignEmbassies", CreatedById, filename);
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
           
            // Save the updated gallery document
            await gallery.save();
    
            return gallery;
        }
    
       

        async getForeignEmbassies(): Promise<any> {
            // Retrieve the gallery from the database
            const gallery = await ForeignEmbassies.findOne().lean();
            if (!gallery) {
              throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
            }
        
            // Ensure userId is converted to a string
            const createdByIdString = gallery.CreatedBy?.toString();
        
            // Map through photos array to generate full URL paths
            gallery.Photos = gallery.Photos.map(photo => ({
              ...photo,
              imageUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.FOREIGNEMBASSIES, [createdByIdString, photo.fileName])
            }));
        
            return gallery;
          }
        
        
        
    
    }


