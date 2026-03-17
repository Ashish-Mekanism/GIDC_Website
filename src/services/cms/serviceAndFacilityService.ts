import { ObjectId } from "mongoose";
import { IIndustriesBody, IServiceAndFacilityBody } from "../../types/requests";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import Industries from "../../models/Industries";
import { toObjectId } from "../../utils/helper";
import { IIndustries, IServiceAndFacility } from "../../types/models";
import path from "path";
import ServiceAndFacility from "../../models/ServiceAndFacility";
export class ServiceAndFacilityService{


    fileHelper = new FileHelper();
    fileService = new FileService();


    async createServiceAndFacility(payload: Partial<IServiceAndFacilityBody>, userId: ObjectId, file?: Express.Multer.File) {
        const { ServiceDescription,ServiceName} = payload;
    
        // Validate required fields
        if (!ServiceName|| !ServiceDescription) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Service Name  and Service Description is mandatory.");
        }
    
        // Prepare the new PresidentMessage document
        const newServiceAndFacility = new ServiceAndFacility({
            ServiceName,
            ServiceDescription,
            CreatedBy: userId,
            Photo: file ? file.filename : "", // Set photo filename if file exists
        });
    
        // Save the document
        await newServiceAndFacility.save();
    
        return newServiceAndFacility;
    }

    async getServiceAndFacilityList(): Promise<any> {

            // Fetch all Quick Links
            const serviceAndFacilityList = await ServiceAndFacility.find().lean();
    

            // Prepare the response
            const response = serviceAndFacilityList.map(serviceAndFacility => ({
                _id: serviceAndFacility._id,
                ServiceName: serviceAndFacility.ServiceName,
                ServiceDescription:serviceAndFacility.ServiceDescription,
                Photo:  this.fileService.getFilePathFromDatabase(FOLDER_NAMES.SERVICEANDFACILITY, [ serviceAndFacility.CreatedBy.toString(), serviceAndFacility.Photo]),
                createdBy: serviceAndFacility.CreatedBy,
            
            }));
    
            return response;
       
    }
      
      async updateServiceAndFacility(
            payload: Partial<IServiceAndFacilityBody>,
            serviceAndFacilityListId: string,
            file: any
        ): Promise<IServiceAndFacilityBody> {
            console.log(file, "Received file object");
    
            // Find existing business card
            const  serviceAndFacilityData = await ServiceAndFacility.findById(
                toObjectId(serviceAndFacilityListId)
            );
            if (!serviceAndFacilityData) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Industry not found",
                    {},
                    false
                );
            }
    
            
            let oldFilePath = `uploads/ServiceAndFacility/${serviceAndFacilityData.CreatedBy.toString()}/${serviceAndFacilityData.Photo}`;
            let newPhoto = file ? file.filename : serviceAndFacilityData.Photo;
    
            console.log(oldFilePath, "oldFilePath");
    
            // Update payload
            const updatedPayload = {
                ...payload,
                Photo: newPhoto,
            };
    
            // Update business card in database
            const updatedServiceAndFacility = (await ServiceAndFacility.findByIdAndUpdate(
                serviceAndFacilityListId,
                updatedPayload,
                { new: true }
            ).lean()) as IServiceAndFacility;
    
            // Delete old profile photo if a new one is uploaded
            if (file && updatedServiceAndFacility.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    await this.fileHelper.deleteFile(oldFilePath);
                }
            }
    
            return updatedServiceAndFacility;
        }


        async deleteServiceAndFacility(serviceAndFacilityListId: string): Promise<any> {
            // Fetch the document from the database
            const serviceAndFacility = await ServiceAndFacility.findById(serviceAndFacilityListId);
        
            if (!serviceAndFacility) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Service And Facility not found"
                );
            }
        
            // Extract user ID and photo filename
            const userId = serviceAndFacility.CreatedBy.toString();
            const photoFileName = serviceAndFacility.Photo;
        
            // Construct the file path for the photo
            const filePath = path.join("uploads", "ServiceAndFacility", userId, photoFileName);
            await this.fileHelper.deleteFile(filePath);
           
            // Delete the document from the database
            await ServiceAndFacility.deleteOne({ _id: serviceAndFacilityListId });
        
            return {
                success: true,
                message: "Service And Facility have been deleted successfully",
            };
        }

}

