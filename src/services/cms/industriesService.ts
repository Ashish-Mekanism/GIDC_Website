import { ObjectId } from "mongoose";
import { IIndustriesBody } from "../../types/requests";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import Industries from "../../models/Industries";
import { toObjectId } from "../../utils/helper";
import { IIndustries } from "../../types/models";
import path from "path";

export class IndustriesService{

    fileHelper = new FileHelper();
    fileService = new FileService();


    async createIndustry(payload: Partial<IIndustriesBody>, userId: ObjectId, file?: Express.Multer.File) {
        const { IndustriesName} = payload;
    
        // Validate required fields
        if (!IndustriesName) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Industries Name is mandatory.");
        }
    
        // Prepare the new PresidentMessage document
        const newIndustry = new Industries({
            IndustriesName,
            CreatedBy: userId,
            Photo: file ? file.filename : "", // Set photo filename if file exists
        });
    
        // Save the document
        await newIndustry.save();
    
        return newIndustry;
    }

    async getIndustriesList(): Promise<any> {

            // Fetch all Quick Links
            const industriesList = await Industries.find().lean();
    

            // Prepare the response
            const response = industriesList.map(industries => ({
                _id: industries._id,
                IndustriesName: industries.IndustriesName,
                Photo:  this.fileService.getFilePathFromDatabase(FOLDER_NAMES.INDUSTRIES, [ industries.CreatedBy.toString(), industries.Photo]),
                createdBy: industries.CreatedBy,
            
            }));
    
            return response;
       
    }
      
      async updateIndustry(
            payload: Partial<IIndustriesBody>,
            industryId: string,
            file: any
        ): Promise<IIndustriesBody> {
            console.log(file, "Received file object");
    
            // Find existing business card
            const  industryData = await Industries.findById(
                toObjectId(industryId)
            );
            if (!industryData) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Industry not found",
                    {},
                    false
                );
            }
    
            
            let oldFilePath = `uploads/industries/${industryData.CreatedBy.toString()}/${industryData.Photo}`;
            let newPhoto = file ? file.filename : industryData.Photo;
    
            console.log(oldFilePath, "oldFilePath");
    
            // Update payload
            const updatedPayload = {
                ...payload,
                Photo: newPhoto,
            };
    
            // Update business card in database
            const updatedindustry = (await Industries.findByIdAndUpdate(
                industryId,
                updatedPayload,
                { new: true }
            ).lean()) as IIndustries;
    
            // Delete old profile photo if a new one is uploaded
            if (file && industryData.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    await this.fileHelper.deleteFile(oldFilePath);
                }
            }
    
            return updatedindustry;
        }


        async deleteIndustry(industryId: string): Promise<any> {
            // Fetch the document from the database
            const industries = await Industries.findById(industryId);
        
            if (!industries) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Industries not found"
                );
            }
        
            // Extract user ID and photo filename
            const userId = industries.CreatedBy.toString();
            const photoFileName = industries.Photo;
        
            // Construct the file path for the photo
            const filePath = path.join("uploads", "industries", userId, photoFileName);
            await this.fileHelper.deleteFile(filePath);
           
            // Delete the document from the database
            await Industries.deleteOne({ _id: industryId });
        
            return {
                success: true,
                message: "Industry and associated photo have been deleted successfully",
            };
        }

}