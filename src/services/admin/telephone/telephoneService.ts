import { ObjectId } from "mongoose";
import Telephone from "../../../models/Telephone";
import { ITelephoneBody } from "../../../types/requests";
import ApiError from "../../../utils/ApiError";
import { RESPONSE_CODE } from "../../../utils/constants";
import SubTelephone from "../../../models/SubTelephone";
import path from "path";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";

export class TelephoneService{

     fileHelper = new FileHelper();
        fileService = new FileService();

    async createTelephoneTitle(
        payload: Partial<ITelephoneBody>,userid:ObjectId
      ): Promise<ITelephoneBody> {
       
        const categoryData = {
          ...payload,
          CreatedBy:userid,
          Active:true,
         
        };

          const savedTelephone = await Telephone.create(categoryData);
      
          // Return only required fields
          return savedTelephone;
       
      }

      async getAllTelephoneList() {
        const telephoneList = await Telephone.aggregate([
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
                    _id: 1,
                    Title: 1,
                    Active: 1,
                    CreatedBy: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
    
        const totalCount = await Telephone.countDocuments();
    
        return { totalCount: totalCount, telephoneList: telephoneList };
    }
    
    
    async updateTelephoneTitle(
        payload: Partial<ITelephoneBody>, 
        telephoneId: string
    ): Promise<ITelephoneBody | null> {
        // Find and update the telephone entry
        const updatedTelephone = await Telephone.findByIdAndUpdate(
            telephoneId, // Find by ID
            { $set: payload }, // Only update provided fields
            { new: true, runValidators: true } // Return updated doc & validate fields
        ).lean();
    
        // If no telephone found, throw error
        if (!updatedTelephone) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Telephone not found");
        }
    
        return updatedTelephone;
    }
    
    async deleteTelephone(telephoneId: string): Promise<any> {
        // Fetch the telephone document
        const telephone = await Telephone.findById(telephoneId);
    
        if (!telephone) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Telephone not found"
            );
        }
    
        // Fetch all sub telephone associated with the telephone
        const subTelephone = await SubTelephone.find({ TelephoneModelId: telephoneId });
    
        if (subTelephone.length > 0) {
            // Iterate through each subtelephone to delete associated photos
            for (const telephone of subTelephone) {
                const userId = telephone.CreatedBy.toString();
                const photoFileName = telephone.Photo;
                const filePath = path.join("uploads", "telephone", userId, photoFileName);
                
                await this.fileHelper.deleteFile(filePath);
            }
    
            // Delete all sub telephone associated with the telephone
            await SubTelephone.deleteMany({ TelephoneModelId: telephoneId });
        }
    
        // Delete the telephone document
        await Telephone.deleteOne({ _id: telephoneId });
    
        return {
            success: true,
            message: "Telephone have been deleted successfully",
        };
    } 



}