import { CustomRequest } from '../../types/common';
import { ICorporateSocialResponsibilityBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData } from '../../utils/responses';
import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CorporateSocialResponsibilityService } from '../../services/cms/corporateSocialResponsibilityService';



const createCorporateSocialResponsibility = asyncHandler(
    async (req: CustomRequest<ICorporateSocialResponsibilityBody>, res: Response) => {
        const corporateSocialResponsibilityService = new CorporateSocialResponsibilityService
        const payload = req?.body;
        const userid = req?.user_id;

        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const corporateSocialResponsibilityCreated = await corporateSocialResponsibilityService.createCorporateSocialResponsibility(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Corporate Social Responsibility Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            corporateSocialResponsibilityCreated
        );
    }
);

const getCorporateSocialResponsibility = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const corporateSocialResponsibilityService = new CorporateSocialResponsibilityService

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required .");
        }

        const getCorporateSocialResponsibilitySuccess = await corporateSocialResponsibilityService.getCorporateSocialResponsibility()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Corporate Social Responsibility Success',
            API_RESPONSE_STATUS.SUCCESS,
            getCorporateSocialResponsibilitySuccess



        );
    }
);

const updateCorporateSocialResponsibility = asyncHandler(

    async (req: CustomRequest<ICorporateSocialResponsibilityBody>, res: Response) => {
        const corporateSocialResponsibilityService = new CorporateSocialResponsibilityService
        const payload = req.body;
        const userid = req?.user_id
        const corporateSocialResponsibilityId = req?.params.id



        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const corporateSocialResponsibilityUpdated = await corporateSocialResponsibilityService.updateCorporateSocialResponsibility(payload, corporateSocialResponsibilityId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Our Vision Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            corporateSocialResponsibilityUpdated
        );
    }
);
export default {
    createCorporateSocialResponsibility,
    updateCorporateSocialResponsibility,
    getCorporateSocialResponsibility,
}