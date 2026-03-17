
import { ObjectId } from "mongoose";
import { IMembershipBenefitsBody, IOurMissionBody, IOurVisionBody } from "../../types/requests";
import { RESPONSE_CODE } from "../../utils/constants";
import ApiError from "../../utils/ApiError";
import { toObjectId } from "../../utils/helper";
import { IMembershipBenefits, IOurMission, IOurVision } from "../../types/models";
import OurMission from "../../models/OurMission";
import MembershipBenefits from "../../models/MembershipBenefits";


export class MembershipBenefitsService {


    async createMebershipBenefits(payload: Partial<IMembershipBenefitsBody>, userId: ObjectId) {

        const existingMembershipBenefits = await MembershipBenefits.findOne();

        if (existingMembershipBenefits) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A Mebership Benefits' entry already exists. You cannot create another one.");
        }

        const {
            MebershipBenefitsPoints, MembershipBenefitDescription,
            MembershipBenefitDescription2, MembershipBenefitDescription3 } = payload;

        // Prepare the new businessBulletin document
        const newMembershipBenefits = new MembershipBenefits({
            MebershipBenefitsPoints, MembershipBenefitDescription,
            MembershipBenefitDescription2, MembershipBenefitDescription3,
            CreatedBy: userId,
        });

        // Save the document
        await newMembershipBenefits.save();

        return newMembershipBenefits;
    }

    async updateMebershipBenefits(
        payload: Partial<IMembershipBenefitsBody>,
        mebershipBenefitsId: string,
    ): Promise<IMembershipBenefitsBody> {
        // Find existing business card
        const membershipBenefits = await MembershipBenefits.findById(
            toObjectId(mebershipBenefitsId)
        );
        if (!membershipBenefits) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Membership Benefits not found",
                {},
                false
            );
        }

        // Update payload
        const updatedPayload = {
            ...payload,
        };

        // Update business card in database
        const updatedMembershipBenefits = (await MembershipBenefits.findByIdAndUpdate(
            mebershipBenefitsId,
            updatedPayload,
            { new: true }
        ).lean()) as IMembershipBenefits;


        return updatedMembershipBenefits;
    }

    async getMebershipBenefits(): Promise<any> {

        // Fetch all Quick Links
        const membershipBenefits = await MembershipBenefits.find().lean();

        if (!membershipBenefits) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Membership Benefits Not Found.");
        }

        // Prepare the response
        const response = membershipBenefits;

        return response;

    }
}


