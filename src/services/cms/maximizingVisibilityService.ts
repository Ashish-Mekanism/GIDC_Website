
import { ObjectId } from "mongoose";
import { IMaximizingVisibilityBody, IOurMissionBody, IOurVisionBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import OurVision from "../../models/OurVision";
import { toObjectId } from "../../utils/helper";
import { IMaximizingVisibility, IOurMission, IOurVision } from "../../types/models";
import OurMission from "../../models/OurMission";
import MaximizingVisibility from "../../models/MaximizingVisibility";

export class MaximizingVisibilityService{


    
        async createMaximizingVisibility(payload: Partial<IMaximizingVisibilityBody>, userId: ObjectId) {
    
            const existingMaximizingVisibility= await MaximizingVisibility.findOne();
    
            if (existingMaximizingVisibility) {
                throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Maximizing Visibility' entry already exists. You cannot create another one.");
            }
    console.log(payload,'maximizingVisibility');
    
            const {
                maximizingVisibility } = payload;
    
            // Prepare the new businessBulletin document
            const newMaximizingVisibility = new MaximizingVisibility({
                maximizingVisibility:maximizingVisibility,
                CreatedBy: userId,
            });
    
            // Save the document
            await newMaximizingVisibility.save();
    
            return newMaximizingVisibility;
        }
    
        
        async  updateMaximizingVisibility(
            payload: Partial<IMaximizingVisibilityBody>,
            maximizingVisibilityId: string,
        ): Promise<IMaximizingVisibilityBody> {
            // Find existing business card
            const maximizingVisibility = await MaximizingVisibility.findById(
                toObjectId(maximizingVisibilityId)
            );
            if (!maximizingVisibility) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Maximizing Visibility not found",
                    {},
                    false
                );
            }
    
            // Update payload
            const updatedPayload = {
                ...payload,
            };
    
            // Update business card in database
            const updatedMaximizingVisibility = (await MaximizingVisibility.findByIdAndUpdate(
                maximizingVisibilityId,
                updatedPayload,
                { new: true }
            ).lean()) as IMaximizingVisibility;
    
    
            return updatedMaximizingVisibility;
        }
    
        async getMaximizingVisibility(): Promise<any> {
    
            // Fetch all Quick Links
            const maximizingVisibility = await MaximizingVisibility.find().lean();
    
            if (!maximizingVisibility) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Maximizing Visibility Not Found.");
            }
    
            // Prepare the response
            const response = maximizingVisibility;
    
            return response;
    
        }
    }


