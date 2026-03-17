import { FilterQuery, ObjectId } from "mongoose";
import { IActiveInactiveBusinessCard, IBusinessCardBody, IDigitalCardGalleryBody, IDigitalCardSliderBody, IUpdateDigitalCardGalleryBody, IUpdateSliderGalleryBody } from "../../../types/requests";
import BusinessCardModel from "../../../models/BusinessCard";
import ApiError from "../../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../../utils/constants";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import { IBusinessCard } from "../../../types/models";
import { toObjectId } from "../../../utils/helper";
import { generatePaginatedResponse, generatePaginationOptions, PaginationOptions, parsePaginationParams } from "../../paginationService";
import DigitalCardGalleryModel from "../../../models/DigitalCardGallery";
import path from "path";
import DigitalCardSliderModel from "../../../models/DigitalCardSlider";
import { env } from "process";
import Config from "../../../config";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export class BusinessCardService {
  fileHelper = new FileHelper();
  fileService = new FileService();

  async createBusinessCard(
    payload: Partial<IBusinessCardBody>,
    user_id: ObjectId,
    file: any
  ): Promise<IBusinessCardBody> {
    const profileImage = file ? file.filename : null;

    const updatedPayload = {
      ...payload,
      userId: user_id,
      profilePhoto: profileImage,
      active: true,
    };
    console.log(updatedPayload, "updatedPayload");

    return await BusinessCardModel.create(updatedPayload);
  }

  async updateBusinessCard(
    payload: Partial<IBusinessCardBody>,
    businessCardId: string,
    file: any
  ): Promise<IBusinessCardBody> {
    console.log(file, "Received file object");

    // Find existing business card
    const businessCard = await BusinessCardModel.findById(
      toObjectId(businessCardId)
    );
    if (!businessCard) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Business card not found",
        {},
        false
      );
    }

    // Prepare old file path for deletion if it exists
    // let oldFilePath = businessCard.profilePhoto
    //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
    //   : null;
    let oldFilePath = `uploads/businessCard/${businessCard.userId}/${businessCard.profilePhoto}`;
    let newProfilePhoto = file ? file.filename : businessCard.profilePhoto;

    console.log(oldFilePath, "oldFilePath");

    // Update payload
    const updatedPayload = {
      ...payload,
      profilePhoto: newProfilePhoto,
    };

    // Update business card in database
    const updatedBusinessCard = (await BusinessCardModel.findByIdAndUpdate(
      businessCardId,
      updatedPayload,
      { new: true }
    ).lean()) as IBusinessCard;

    // Delete old profile photo if a new one is uploaded
    if (file && businessCard.profilePhoto) {
      // Check if oldFilePath exists before deleting
      if (oldFilePath) {
        await this.fileHelper.deleteFile(oldFilePath);
      }
    }

    return updatedBusinessCard;
  }

  async activeInactiveBusinessCard(
    payload: Partial<IActiveInactiveBusinessCard>,
    businessCardId: string,
    userid: ObjectId
  ): Promise<IActiveInactiveBusinessCard & { message: string }> {
    // Find existing business card
    const businessCard = await BusinessCardModel.findById(businessCardId);
    if (!businessCard) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Business card not found", {}, false);
    }

    if (businessCard.userId.toString() !== userid.toString()) {
      throw new ApiError(RESPONSE_CODE.UNAUTHORIZED, "You can't activate or deactivate this business card", {}, false);
    }


    // Ensure active field is boolean
    const isActive = payload.active ?? false;

    // Check if the active state is already the same as the requested state
    if (businessCard.active === isActive) {
      throw new ApiError(RESPONSE_CODE.CONFLICT, `Business card is already ${isActive ? 'active' : 'inactive'}`, {}, false);
    }

    // Update active status
    businessCard.active = isActive;
    await businessCard.save();

    return {
      ...businessCard.toObject(),
      message: `Business card successfully ${isActive ? 'activated' : 'deactivated'}`
    };
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

    async getBusinessCard(businessCardId: string): Promise<any> {
      // Retrieve the business card from the database
      const businessCard = await BusinessCardModel.findById(businessCardId).lean();
      if (!businessCard) {
        throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Business card not found');
      }

      if(businessCard.active === false) {
        throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Business card is Inactive');
      }
    
      // Update the profilePhoto field with the full URL
      const userIdString = businessCard.userId?.toString();
      const businessCardString= businessCard._id?.toString();
      businessCard.profilePhoto = this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.BUSINESSCARD,
        [userIdString, businessCard.profilePhoto]
      );
    
      // Fetch the digital card gallery
      const digitalCardGallery = await DigitalCardGalleryModel.find({
        digitalCardId: businessCard._id
      }).lean();
    
      // Fetch the digital card slider
      const digitalCardSlider = await DigitalCardSliderModel.findOne({
        digitalCardId: businessCard._id
      }).lean();
    
      // Format file paths for gallery photos
      digitalCardGallery.forEach(gallery => {
        gallery.photos = gallery.photos.map(photo => ({
          ...photo,
          filePath: this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.DIGITALCARDGALLERY,
            [businessCardString, photo.fileName]
          )
        }));
      });
    
      // Format file paths for slider photos
      if (digitalCardSlider) {
        digitalCardSlider.photos = digitalCardSlider.photos.map(photo => ({
          ...photo,
          filePath: this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.DIGITALCARDSLIDER,
            [businessCardString, photo.fileName]
          )
        }));
      }
    
      return {
        ...businessCard,
        digitalCardGallery,
        digitalCardSlider
      };
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

  
  async getUserDigitalCardList(userId: ObjectId | string) {
    const FeBaseURL = Config.FE_BASE_URL;
  
    // Convert userId to ObjectId if it's a string
    const convertedUserId =
      typeof userId === 'string' && ObjectId.isValid(userId)
        ? toObjectId(userId)
        : userId;
  
    const matchCondition = {
      userId: convertedUserId,
    };
  
    const digitalCardList = await BusinessCardModel.aggregate([
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
  

  async getPaginationUserDigitalGalleryList(
    queryParams: PaginationOptions,
    businessCardId: string
  ) {
    const parsedParams = parsePaginationParams(queryParams);
    const { skip, limit, sort } = generatePaginationOptions(parsedParams);

    const galleryExist = await DigitalCardGalleryModel.findOne({ digitalCardId: businessCardId })

    if (!galleryExist) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT, // Or another appropriate status code for conflicts
        " Digital Gallery Does Not Exists",
        {},
        false
      );
    }

    // Define the match condition
    const dynamicMatch = {
      digitalCardId: toObjectId(businessCardId)
    };

    // Fetch digital card list
    const digitalGalleryList = await DigitalCardGalleryModel.aggregate([
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
    const paginatedResponse = await generatePaginatedResponse(
      parsedParams,
      DigitalCardGalleryModel, // Pass the correct model here
      dynamicMatch
    );

    return {
      ...paginatedResponse,
      digitalGalleryList,
    };
  }

  async digitalCardGallery(
    payload: Partial<IDigitalCardGalleryBody>,
    businessCardId: string,
    files: any // Array of images
  ): Promise<any> {

    // Ensure files exist
    if (!files || files.length === 0) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "No Image Uploded",
        {},
        false
      );
    }

    // Process uploaded images
    const galleryPhotos = files.map((file: any) => ({
      fileName: file.filename,
    }));

    // Prepare the gallery data
    const newGallery = new DigitalCardGalleryModel({
      digitalCardId: businessCardId,
      galleryName: payload.galleryName,
      photos: galleryPhotos,
    });

    // Save to database
    await newGallery.save();

    return { success: true, message: "Gallery saved successfully", newGallery };

  }

  async updateDigitalCardGallery(
    payload: Partial<IUpdateDigitalCardGalleryBody>,
    businessCardId: string,
    files: any // Array of image files
  ): Promise<any> {

    // Validate that we have a gallery id to update.
    if (!payload.digitalCardGalleryId) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Digital card gallery id is required",
        {},
        false
      );
    }


    // Find the gallery document (and ensure it belongs to the businessCardId)
    const gallery = await DigitalCardGalleryModel.findOne({
      _id: payload.digitalCardGalleryId,
      digitalCardId: businessCardId,
    });

    if (!gallery) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Gallery Not Found",
        {},
        false
      );
    }

    // ******************************
    // 1. DELETE SPECIFIED PHOTOS
    // ******************************
    let deleteIds: string[] = [];
    if (payload.deleteGalleryPhotosId) {
      /**
       * The incoming string might look like:
       * "[[67a05d70e3dbc4df769c6363},{67a05d70e3dbc4df769c6362}]"
       * Remove square brackets and curly braces, then split by comma.
       */
      const cleaned = payload.deleteGalleryPhotosId.replace(/[\[\]\{\}]/g, "");
      deleteIds = cleaned
        .split(",")
        .map((id: string) => id.trim())
        .filter((id: string) => id); // Remove empty strings
    }

    // Get the photos to delete from the gallery document.
    const photosToDelete = gallery.photos.filter((photo: any) =>
      deleteIds.includes(photo._id.toString())
    );

    // Get the filenames of the photos that need to be deleted.
    const deleteFileNames = photosToDelete.map((photo: any) => photo.fileName);

    // Delete each file using FileHelper and the correct path:
    // The expected path is: uploads/digitalCardGallery/<userId>/<filename>
    if (deleteFileNames.length > 0) {
      const deletePromises = deleteFileNames.map((filename) => {
        const filePath = path.join("uploads", "digitalCardGallery", businessCardId, filename);
        return this.fileHelper.deleteFile(filePath);
      });
      await Promise.all(deletePromises);
    }

    // Remove the deleted photos from the gallery's photos array.
    gallery.photos = gallery.photos.filter(
      (photo: any) => !deleteIds.includes(photo._id.toString())
    );

    // ******************************
    // 2. ADD NEW UPLOADED FILES (IF ANY)
    // ******************************
    if (files && files.length > 0) {
      // Process each new file.
      // Ensure that the file object has the expected properties.
      const newPhotos = files.map((file: any) => ({
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
    await gallery.save();

    return {
      success: true,
      message: "Gallery updated successfully",
      gallery,
    };

  }

  async deleteDigitalCardGallery(
    digitalCardGalleryId: string
  ): Promise<any> {

    // Fetch the gallery document and populate the digitalCardId reference.
    // Assumes that the referenced BusinessCard document has a userId field.
    const gallery = await DigitalCardGalleryModel.findById(digitalCardGalleryId)

    if (!gallery) {

      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Gallery not found",
        {},
        false
      );
    }


    // Extract the business card object from the populated field.
    const businessCard = gallery.digitalCardId;
    console.log(businessCard, '  businessCard');

    // Ensure that the businessCard has a userId.
    if (!businessCard) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Business card id not found",
        {},
        false
      );
    }
    const userId = businessCard.toString();

    // Delete each photo file.
    // Construct the file path: uploads/digitalCardGallery/<userId>/<fileName>
    const deleteFilePromises = gallery.photos.map((photo: any) => {


      const filePath = path.join("uploads", "digitalCardGallery", userId, photo.fileName);
      console.log(filePath, 'filePath');

      return this.fileHelper.deleteFile(filePath);
    });

    // Wait for all file deletions to complete.
    await Promise.all(deleteFilePromises);

    // Delete the gallery document from the database.
    await DigitalCardGalleryModel.deleteOne({ _id: digitalCardGalleryId });

    return {
      success: true,
      message: "Gallery and its image files have been deleted successfully",
    };

  }

  async digitalCardSlider(
    businessCardId: string,
    files: any // Array of images
  ): Promise<any> {

    // Ensure files exist
    if (!files || files.length === 0) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "No Image Uploded",
        {},
        false
      );
    }

    const sliderExist = await DigitalCardSliderModel.findOne({ digitalCardId: businessCardId });

    if (sliderExist) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT, // Or another appropriate status code for conflicts
        "Slider already exists",
        {},
        false
      );
    }

    // Process uploaded images
    const sliderPhotos = files.map((file: any) => ({
      fileName: file.filename,
    }));

    // Prepare the gallery data
    const newGallery = new DigitalCardSliderModel({
      digitalCardId: businessCardId,
      photos: sliderPhotos,
    });

    // Save to database
    await newGallery.save();

    return { success: true, message: "Slider saved successfully", newGallery };

  }

  async updateDigitalCardSlider(
    payload: Partial<IUpdateSliderGalleryBody>,
    businessCardId: string,
    files: any // Array of image files
  ): Promise<any> {

    // Validate that we have a gallery id to update.
    if (!payload.digitalCardSliderId) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Digital card gallery id is required",
        {},
        false
      );
    }


    // Find the gallery document (and ensure it belongs to the businessCardId)
    const slider = await DigitalCardSliderModel.findOne({
      _id: payload.digitalCardSliderId,
      digitalCardId: businessCardId,
    });

    if (!slider) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Slider Not Found",
        {},
        false
      );
    }

    // ******************************
    // 1. DELETE SPECIFIED PHOTOS
    // ******************************
    let deleteIds: string[] = [];
    if (payload.deleteSliderPhotosId) {
      /**
       * The incoming string might look like:
       * "[[67a05d70e3dbc4df769c6363},{67a05d70e3dbc4df769c6362}]"
       * Remove square brackets and curly braces, then split by comma.
       */
      const cleaned = payload.deleteSliderPhotosId.replace(/[\[\]\{\}]/g, "");
      deleteIds = cleaned
        .split(",")
        .map((id: string) => id.trim())
        .filter((id: string) => id); // Remove empty strings
    }

    // Get the photos to delete from the gallery document.
    const photosToDelete = slider.photos.filter((photo: any) =>
      deleteIds.includes(photo._id.toString())
    );

    // Get the filenames of the photos that need to be deleted.
    const deleteFileNames = photosToDelete.map((photo: any) => photo.fileName);

    // Delete each file using FileHelper and the correct path:
    // The expected path is: uploads/digitalCardGallery/<userId>/<filename>
    if (deleteFileNames.length > 0) {
      const deletePromises = deleteFileNames.map((filename) => {
        const filePath = path.join("uploads", "digitalCardSlider", businessCardId, filename);
        // const filePath = `${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.DIGITALCARDSLIDER}/${filename}`;

        return this.fileHelper.deleteFile(filePath);
      });
      await Promise.all(deletePromises);
    }

    // Remove the deleted photos from the gallery's photos array.
    slider.photos = slider.photos.filter(
      (photo: any) => !deleteIds.includes(photo._id.toString())
    );

    // ******************************
    // 2. ADD NEW UPLOADED FILES (IF ANY)
    // ******************************
    if (files && files.length > 0) {
      // Process each new file.
      // Ensure that the file object has the expected properties.
      const newPhotos = files.map((file: any) => ({
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
    await slider.save();

    return {
      success: true,
      message: "Gallery updated successfully",
      slider,
    };

  }

  async getDigitalCardGalleryImages(digitalCardGalleryId: string): Promise<any> {
    // Retrieve the gallery from the database
    const gallery = await DigitalCardGalleryModel.findById(digitalCardGalleryId).lean();
    if (!gallery) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
    }

    // Ensure userId is converted to a string
    const digitalCardIdString = gallery.digitalCardId?.toString();

    // Map through photos array to generate full URL paths
    gallery.photos = gallery.photos.map(photo => ({
      ...photo,
      imageUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.DIGITALCARDGALLERY, [digitalCardIdString, photo.fileName])
    }));

    return gallery;
  }

  async getDigitalCardSliderImages(digitalCardId: string): Promise<any> {
    // Retrieve the gallery from the database
    const slider = await DigitalCardSliderModel.findOne({digitalCardId:digitalCardId}).lean();
    if (!slider) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Gallery not found');
    }

    // Ensure userId is converted to a string
    const digitalCardIdString = slider.digitalCardId?.toString();

    // Map through photos array to generate full URL paths
    slider.photos = slider.photos.map(photo => ({
      ...photo,
      imageUrl: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.DIGITALCARDSLIDER, [digitalCardIdString, photo.fileName])
    }));

    return slider;
  }

  async getDigitalCardGalleries(digitalCardId: string): Promise<any[]> {
    // Retrieve all galleries that match the digitalCardId
    const galleries = await DigitalCardGalleryModel.find({ digitalCardId }).lean();
  
    if (!galleries || galleries.length === 0) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'No galleries found');
    }
  
    // Map through each gallery
    return galleries.map(gallery => {
      const digitalCardIdString = gallery.digitalCardId?.toString();
  
      return {
        ...gallery,
        photos: gallery.photos.map(photo => ({
          ...photo,
          imageUrl: this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.DIGITALCARDGALLERY, 
            [digitalCardIdString, photo.fileName]
          )
        }))
      };
    });
  }
  

}
