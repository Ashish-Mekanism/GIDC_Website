import { ObjectId } from "mongoose";
import {  ITypeOfMembershipBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import { toObjectId } from "../../utils/helper";
import {ITypeOfMembership } from "../../types/models";
import TypeOfMembership from "../../models/TypeOfMembership";

export class TypeOfMembershipService{

    
        async createTypeOfMembership(payload: Partial<ITypeOfMembershipBody>, userId: ObjectId) {
    
            const existingTypeOfMembership = await TypeOfMembership.findOne();
    
        
            const {
                Title,
                Description1,
                Description2,
                MembershipPoints,} = payload;
    
            // Prepare the new businessBulletin document
            const newTypeOfMembership= new TypeOfMembership({
                Title,
                Description1,
                Description2,
                MembershipPoints,
                CreatedBy: userId,
            });
    
            // Save the document
            await newTypeOfMembership.save();
    
            return newTypeOfMembership;
        }
           
        async updateTypeOfMembership(
            payload: Partial<ITypeOfMembershipBody>,
            typeOfMembershipId: string,
        ): Promise<ITypeOfMembershipBody> {
            // Find existing business card
            const typeOfMembership = await TypeOfMembership.findById(
                toObjectId(typeOfMembershipId)
            );
            if (!typeOfMembership) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Type Of Membership not found",
                    {},
                    false
                );
            }
    
            // Update payload
            const updatedPayload = {
                ...payload,
            };
    
            // Update business card in database
            const updatedTypeOfMembership= (await TypeOfMembership.findByIdAndUpdate(
                typeOfMembershipId,
                updatedPayload,
                { new: true }
            ).lean()) as ITypeOfMembership;
    
    
            return updatedTypeOfMembership;
        }
    
        async getTypeOfMembership(): Promise<any> {
    
            // Fetch all Quick Links
            const typeOfMembership = await TypeOfMembership.find().lean();
    
            if (!typeOfMembership) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A Type Of Membership Not Found.");
            }
    
            // Prepare the response
            const response = typeOfMembership;
    
            return response;
    
        }

          async deleteTypeOfMembership(typeOfMembershipId: string): Promise<any> {
                            // Fetch the document from the database
                            const typeOfMembership = await TypeOfMembership.findById(typeOfMembershipId);
                        
                            if (!typeOfMembership) {
                                throw new ApiError(
                                    RESPONSE_CODE.NOT_FOUND,
                                    "Type Of Membership not found"
                                );
                            }
                        
                            // Delete the document from the database
                            await TypeOfMembership.deleteOne({ _id: typeOfMembershipId });
                        
                            return {
                                success: true,
                                message: "Type Of Membership have been deleted successfully",
                            };
                        }
    }

