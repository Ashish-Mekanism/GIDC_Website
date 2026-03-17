
import { ObjectId } from "mongoose";
import { IOurMissionBody, IOurVisionBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import OurVision from "../../models/OurVision";
import { toObjectId } from "../../utils/helper";
import { IOurMission, IOurVision } from "../../types/models";
import OurMission from "../../models/OurMission";

export class OurMissionService{
    
        async createOurMission(payload: Partial<IOurMissionBody>, userId: ObjectId) {
    
            const existingOurMission = await OurMission.findOne();
    
            if (existingOurMission) {
                throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Our Mission' entry already exists. You cannot create another one.");
            }
    
            const {
                MissionDescription,
                Mission } = payload;
    
            // Prepare the new businessBulletin document
            const newOurMission = new OurMission({
                MissionDescription,
                Mission,
                CreatedBy: userId,
            });
    
            // Save the document
            await newOurMission.save();
    
            return newOurMission;
        }
    
        
        async updateOurMission(
            payload: Partial<IOurMissionBody>,
            ourMissionId: string,
        ): Promise<IOurMissionBody> {
            // Find existing business card
            const ourMission = await OurMission.findById(
                toObjectId(ourMissionId)
            );
            if (!ourMission) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Our Mission not found",
                    {},
                    false
                );
            }
    
            // Update payload
            const updatedPayload = {
                ...payload,
            };
    
            // Update business card in database
            const updatedOurMission = (await OurMission.findByIdAndUpdate(
                ourMissionId,
                updatedPayload,
                { new: true }
            ).lean()) as IOurMission;
    
    
            return updatedOurMission;
        }
    
        async getOurMission(): Promise<any> {
    
            // Fetch all Quick Links
            const ourMission = await OurMission.find().lean();
    
            if (!ourMission) {
                throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Our Mission Not Found.");
            }
    
            // Prepare the response
            const response = ourMission;
    
            return response;
    
        }
    }


