import { ObjectId } from "mongoose";
import Committee from "../../models/Committee";
import { ICommitteeBody } from "../../types/requests";
import ApiError from "../../utils/ApiError";
import { RESPONSE_CODE } from "../../utils/constants";
import CommitteeMember from "../../models/CommitteeMember";
import path from "path";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";

export class CommitteeService{
    fileHelper = new FileHelper();
    fileService = new FileService();

    async createCommittee(
        payload: Partial<ICommitteeBody>,userid:ObjectId
      ): Promise<ICommitteeBody> {
       
        const categoryData = {
          ...payload,
          CreatedBy:userid,
          //Active:true,
         
        };

          const savedCommittee = await Committee.create(categoryData);
      
          // Return only required fields
          return savedCommittee;
       
      }

      async getCommitteeList() {
        const committeeList = await Committee.aggregate([
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
                    CommitteeName: 1,
                   // Active: 1,
                    CreatedBy: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
    
        const totalCount = await Committee.countDocuments();
    
        return { totalCount: totalCount, committeeList: committeeList };
    }
      
    async updateCommittee(
        payload: Partial<ICommitteeBody>, 
        committeeId: string
    ): Promise<ICommitteeBody | null> {
        // Find and update the telephone entry
        const updatedCommittee= await Committee.findByIdAndUpdate(
            committeeId, // Find by ID
            { $set: payload }, // Only update provided fields
            { new: true, runValidators: true } // Return updated doc & validate fields
        ).lean();
    
        // If no telephone found, throw error
        if (!updatedCommittee) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Committee not found");
        }
    
        return updatedCommittee;
    }
    

    async deleteCommittee(committeeId: string): Promise<any> {
        // Fetch the committee document
        const committee = await Committee.findById(committeeId);
    
        if (!committee) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Committee not found"
            );
        }
    
        // Fetch all committee members associated with the committee
        const committeeMembers = await CommitteeMember.find({ CommitteeModelId: committeeId });
    
        if (committeeMembers.length > 0) {
            // Iterate through each member to delete associated photos
            for (const member of committeeMembers) {
                const userId = member.CreatedBy.toString();
                const photoFileName = member.Photo;
                const filePath = path.join("uploads", "CommitteeMember", userId, photoFileName);
                
                await this.fileHelper.deleteFile(filePath);
            }
    
            // Delete all committee members associated with the committee
            await CommitteeMember.deleteMany({ CommitteeModelId: committeeId });
        }
    
        // Delete the committee document
        await Committee.deleteOne({ _id: committeeId });
    
        return {
            success: true,
            message: "Committee and associated members have been deleted successfully",
        };
    }
    
      



}