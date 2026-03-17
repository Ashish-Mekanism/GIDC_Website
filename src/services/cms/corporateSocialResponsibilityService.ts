import { ObjectId } from "mongoose";
import { ICorporateSocialResponsibilityBody, IOurVisionBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import { toObjectId } from "../../utils/helper";
import { ICorporateSocialResponsibility } from "../../types/models";
import CorporateSocialResponsibility from "../../models/CorporateSocialResponsibility";
export class CorporateSocialResponsibilityService{

        async createCorporateSocialResponsibility(payload: Partial<ICorporateSocialResponsibilityBody>, userId: ObjectId) {
    
            const existingCorporateSocialResponsibility = await CorporateSocialResponsibility.findOne();
    
            if (existingCorporateSocialResponsibility) {
                throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Corporate Social Responsibility' entry already exists. You cannot create another one.");
            }
    
            const {
                CorporateSocialResponsibility1,
                CorporateSocialResponsibility2 } = payload;
    
            // Prepare the new newCorporateSocialResponsibility document
            const newCorporateSocialResponsibility= new CorporateSocialResponsibility({
                CorporateSocialResponsibility1,
                CorporateSocialResponsibility2,
                CreatedBy: userId,
            });
    
            // Save the document
            await newCorporateSocialResponsibility.save();
    
            return newCorporateSocialResponsibility;
        }
    
        
        async updateCorporateSocialResponsibility(
            payload: Partial<ICorporateSocialResponsibilityBody>,
            corporateSocialResponsibilityId: string,
        ): Promise<ICorporateSocialResponsibilityBody> {
            // Find existing business card
            const corporateSocialResponsibility = await CorporateSocialResponsibility.findById(
                toObjectId(corporateSocialResponsibilityId)
            );
            if (!corporateSocialResponsibility) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Our Vision not found",
                    {},
                    false
                );
            }
    
            // Update payload
            const updatedPayload = {
                ...payload,
            };
    
            // Update business card in database
            const updatedCorporateSocialResponsibility = (await CorporateSocialResponsibility.findByIdAndUpdate(
                corporateSocialResponsibilityId,
                updatedPayload,
                { new: true }
            ).lean()) as ICorporateSocialResponsibility;
    
    
            return updatedCorporateSocialResponsibility;
        }
    
        async getCorporateSocialResponsibility(): Promise<any> {
    
            // Fetch all Quick Links
            const corporateSocialResponsibility = await CorporateSocialResponsibility.find().lean();
    
            if (!corporateSocialResponsibility) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Corporate Social Responsibility Not Found.");
            }
    
            // Prepare the response
            const response = corporateSocialResponsibility;
    
            return response;
    
        }
    }



 