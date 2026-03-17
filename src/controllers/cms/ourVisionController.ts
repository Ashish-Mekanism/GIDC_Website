import { CustomRequest } from '../../types/common';
import { IOurVisionBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData } from '../../utils/responses';
import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { OurVisionService } from '../../services/cms/ourVisionService';


const createOurVision = asyncHandler(
    async (req: CustomRequest<IOurVisionBody>, res: Response) => {
        const ourVisionService = new OurVisionService
        const payload = req?.body;
        const userid = req?.user_id;

        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const ourVisionCreated = await ourVisionService.createOurVision(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Our Vision Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            ourVisionCreated
        );
    }
);

const getOurVision = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const ourVisionService = new OurVisionService

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required .");
        }

        const getOurVisionSuccess = await ourVisionService.getOurVision()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Our Vision Success',
            API_RESPONSE_STATUS.SUCCESS,
            getOurVisionSuccess



        );
    }
);

const updateOurVision = asyncHandler(

    async (req: CustomRequest<IOurVisionBody>, res: Response) => {
        const ourVisionService = new OurVisionService
        const payload = req.body;
        const userid = req?.user_id
        const ourVisionId = req?.params.id



        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const ourVisionUpdated = await ourVisionService.updateOurVision(payload, ourVisionId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Our Vision Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            ourVisionUpdated
        );
    }
);
export default {
    createOurVision,
    updateOurVision,
    getOurVision,
}