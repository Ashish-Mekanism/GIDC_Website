import { CustomRequest } from "../../types/common";
import { IBecomeAMemberBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { API_RESPONSE_STATUS, MEMBER_APPROVAL_STATUS, MULTER_FIELD_NAMES, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { MembershipFormService } from "../../services/user/membershipForm/membershipFormService";
import { ObjectId } from "mongoose";
import User from "../../models/User";


const becomeAMember = asyncHandler(

    async (req: CustomRequest<IBecomeAMemberBody>, res: Response) => {
        const membershipFormService = new MembershipFormService
        const payload = req.body;
        const userid = req?.user_id

        const files = req?.files
  
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const MembershipRegistrationformCreated = await membershipFormService.becomeAMember(payload, userid, files)
        const user = await User.findById(userid)

        if (user) {
            user.approval_status = MEMBER_APPROVAL_STATUS.PENDING;
            await user.save(); // Save the changes 
        }
        
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Membership Register Success ',
            API_RESPONSE_STATUS.SUCCESS,
            MembershipRegistrationformCreated
        );
    }
);


const updateMembershipForm = asyncHandler(

    async (req: CustomRequest<IBecomeAMemberBody>, res: Response) => {
        const membershipFormService = new MembershipFormService
        const payload = req.body;
        const userid = req?.user_id

        const files = req?.files
       console.log(payload,"payloadpayload");

        if (!userid) {
            throw new Error("User ID is required.");
        }
        const MembershipRegistrationformUpdated = await membershipFormService.updateMembershipForm(payload, userid, files)
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Membership Form Updated Successfully',
            API_RESPONSE_STATUS.SUCCESS,
            MembershipRegistrationformUpdated
        );
    }
);

const getMemberDetails = asyncHandler(async (req: CustomRequest, res: Response) => {
    const membershipFormService = new MembershipFormService
    const UserId = req.user_id;
    console.log(UserId, "userid");

    if (!UserId) {
        throw new Error("User ID is required.");
    }

    const GetMemberDetails = await membershipFormService.getMemberDetails(UserId)
    SuccessResponseWithData(
        res,
        RESPONSE_CODE.CREATED,
        'Member Details Success',
        API_RESPONSE_STATUS.SUCCESS,
        GetMemberDetails
    );
}
)

export default {
    becomeAMember,
    getMemberDetails,
    updateMembershipForm,
}