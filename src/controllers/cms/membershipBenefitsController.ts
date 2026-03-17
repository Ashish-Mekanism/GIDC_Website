import { CustomRequest } from '../../types/common';
import { IMembershipBenefitsBody, IOurVisionBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData } from '../../utils/responses';
import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { OurVisionService } from '../../services/cms/ourVisionService';
import { MembershipBenefitsService } from '../../services/cms/membershipBenefitsService';


const createMebershipBenefits = asyncHandler(
    async (req: CustomRequest<IMembershipBenefitsBody>, res: Response) => {
        const membershipBenefitsService = new MembershipBenefitsService
        const payload = req?.body;
        const userid = req?.user_id;

        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const mebershipBenefitsCreated = await membershipBenefitsService.createMebershipBenefits(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Mebership Benefits Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            mebershipBenefitsCreated
        );
    }
);

const getMebershipBenefits = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const membershipBenefitsService = new MembershipBenefitsService

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required .");
        }

        const getMebershipBenefitsSuccess = await membershipBenefitsService.getMebershipBenefits()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Mebership Benefits Success',
            API_RESPONSE_STATUS.SUCCESS,
            getMebershipBenefitsSuccess



        );
    }
);

const updateMebershipBenefits = asyncHandler(

    async (req: CustomRequest<IMembershipBenefitsBody>, res: Response) => {
        const membershipBenefitsService = new MembershipBenefitsService
        const payload = req.body;
        const userid = req?.user_id
        const mebershipBenefitsId = req?.params.id



        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const mebershipBenefitsUpdated = await membershipBenefitsService.updateMebershipBenefits(payload, mebershipBenefitsId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Mebership Benefits Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            mebershipBenefitsUpdated
        );
    }
);
export default {
    createMebershipBenefits,
    getMebershipBenefits,
    updateMebershipBenefits,
}