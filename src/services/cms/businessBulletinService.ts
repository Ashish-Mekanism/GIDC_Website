import { ObjectId } from "mongoose";
import { IBusinessBulletinBody } from "../../types/requests";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import BusinessBulletin from "../../models/BusinessBulletin";
import { toObjectId } from "../../utils/helper";
import { IBusinessBulletin } from "../../types/models";
import path from "path";

export class BusinessBulletinService{



    fileHelper = new FileHelper();
    fileService = new FileService();


    async createBusinessBulletin(payload: Partial<IBusinessBulletinBody>, userId: ObjectId, file?: Express.Multer.File) {
        const { Title } = payload;
    
        // Validate required fields
        if (!Title) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title");
        }
    
        // Prepare the new businessBulletin document
        const newBusinessBulletin = new BusinessBulletin({
            Title,
            CreatedBy: userId,
            Photo: file ? file.filename : "", // Set photo filename if file exists
        });
    
        // Save the document
        await newBusinessBulletin.save();
    
        return newBusinessBulletin;
    }
    
    async getBusinessBulletinList(): Promise<any> {

        // Fetch all Quick Links
        const businessBulletinList = await BusinessBulletin.find().lean();


        // Prepare the response
        const response = businessBulletinList.map(businessBulletin => ({
            _id: businessBulletin._id,
            Title: businessBulletin.Title,
            Photo:  this.fileService.getFilePathFromDatabase(FOLDER_NAMES.BUSINESSBULLETIN, [ businessBulletin.CreatedBy.toString(), businessBulletin.Photo]),
            createdBy: businessBulletin.CreatedBy,
        
        }));

        return response;
   
}

async updateBusinessBulletin(
    payload: Partial<IBusinessBulletinBody>,
    businessBulletinId: string,
    file: any
): Promise<IBusinessBulletinBody> {
    console.log(file, "Received file object");

    // Find existing business card
    const businessBulletinData = await BusinessBulletin.findById(
        toObjectId(businessBulletinId)
    );
    if (!businessBulletinData) {
        throw new ApiError(
            RESPONSE_CODE.NOT_FOUND,
            "Business Bulletin not found",
            {},
            false
        );
    }

    
    let oldFilePath = `uploads/businessBulletin/${businessBulletinData.CreatedBy.toString()}/${businessBulletinData.Photo}`;
    let newPhoto = file ? file.filename : businessBulletinData.Photo;

    console.log(oldFilePath, "oldFilePath");

    // Update payload
    const updatedPayload = {
        ...payload,
        Photo: newPhoto,
    };

    // Update business card in database
    const updatedBusinessBulletin = (await BusinessBulletin.findByIdAndUpdate(
        businessBulletinId,
        updatedPayload,
        { new: true }
    ).lean()) as IBusinessBulletin;

    // Delete old profile photo if a new one is uploaded
    if (file && businessBulletinData.Photo) {
        // Check if oldFilePath exists before deleting
        if (oldFilePath) {
            await this.fileHelper.deleteFile(oldFilePath);
        }
    }

    return updatedBusinessBulletin;
}

 async deleteBusinessBulletin(businessBulletinId: string): Promise<any> {
            // Fetch the document from the database
            const businessBulletin = await BusinessBulletin.findById(businessBulletinId);
        
            if (!businessBulletin) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Business Bulletin not found"
                );
            }
        
            // Extract user ID and photo filename
            const userId = businessBulletin.CreatedBy.toString();
            const photoFileName = businessBulletin.Photo;
        
            // Construct the file path for the photo
            const filePath = path.join("uploads", "businessBulletin", userId, photoFileName);
            await this.fileHelper.deleteFile(filePath);
           
            // Delete the document from the database
            await BusinessBulletin.deleteOne({ _id: businessBulletinId });
        
            return {
                success: true,
                message: "Business Bulletin have been deleted successfully",
            };
        }


}