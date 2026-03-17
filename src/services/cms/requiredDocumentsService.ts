import { ObjectId } from "mongoose";
import { IMaximizingVisibilityBody, IOurMissionBody, IOurVisionBody, IRequiredDocumentsBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import { toObjectId } from "../../utils/helper";
import { IMaximizingVisibility, IOurMission, IOurVision, IRequiredDocuments } from "../../types/models";
import RequiredDocuments from "../../models/RequiredDocuments";


export class RequiredDocumentsService{

    
        async createRequiredDocuments(payload: Partial<IRequiredDocumentsBody>, userId: ObjectId) {
    
            const existingRequiredDocuments= await RequiredDocuments.findOne();
    
            if (existingRequiredDocuments) {
                throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Required Documents' entry already exists. You cannot create another one.");
            }

            const {
                requiredDocuments } = payload;
    
            // Prepare the new businessBulletin document
            const newRequiredDocuments = new RequiredDocuments({
                requiredDocuments:requiredDocuments,
                CreatedBy: userId,
            });
    
            // Save the document
            await newRequiredDocuments.save();
    
            return newRequiredDocuments;
        }
    
        
        async  updateRequiredDocuments(
            payload: Partial<IRequiredDocumentsBody>,
            requiredDocumentsId: string,
        ): Promise<IRequiredDocumentsBody> {
            // Find existing business card
            const requiredDocuments = await RequiredDocuments.findById(
                toObjectId(requiredDocumentsId)
            );
            if (!requiredDocuments) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Required Documents not found",
                    {},
                    false
                );
            }
    
            // Update payload
            const updatedPayload = {
                ...payload,
            };
    
            // Update business card in database
            const updatedRequiredDocuments= (await RequiredDocuments.findByIdAndUpdate(
                requiredDocumentsId,
                updatedPayload,
                { new: true }
            ).lean()) as IRequiredDocuments;
    
    
            return updatedRequiredDocuments;
        }
    
        async getRequiredDocuments(): Promise<any> {
    
            // Fetch all Quick Links
            const requiredDocuments = await RequiredDocuments.find().lean();
    
            if (!requiredDocuments) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Required Documents Not Found.");
            }
    
            // Prepare the response
            const response = requiredDocuments;
    
            return response;
    
        }
    }

