import { ObjectId } from "mongoose";
import { IOurVisionBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import OurVision from "../../models/OurVision";
import { toObjectId } from "../../utils/helper";
import { IOurVision } from "../../types/models";

export class OurVisionService{



    async createOurVision(payload: Partial<IOurVisionBody>, userId: ObjectId) {

        const existingOurVision = await OurVision.findOne();

        if (existingOurVision) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Our Vision' entry already exists. You cannot create another one.");
        }

        const {
            VisionDescription,
            Vision } = payload;

        // Prepare the new businessBulletin document
        const newOurVision = new OurVision({
            VisionDescription,
            Vision,
            CreatedBy: userId,
        });

        // Save the document
        await newOurVision.save();

        return newOurVision;
    }

    
    async updateOurVision(
        payload: Partial<IOurVisionBody>,
        ourVisionId: string,
    ): Promise<IOurVisionBody> {
        // Find existing business card
        const ourVision = await OurVision.findById(
            toObjectId(ourVisionId)
        );
        if (!ourVision) {
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
        const updatedOurVision = (await OurVision.findByIdAndUpdate(
            ourVisionId,
            updatedPayload,
            { new: true }
        ).lean()) as IOurVision;


        return updatedOurVision;
    }

    async getOurVision(): Promise<any> {

        // Fetch all Quick Links
        const ourVision = await OurVision.find().lean();

        if (!ourVision) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Our Vision Not Found.");
        }

        // Prepare the response
        const response = ourVision;

        return response;

    }
}