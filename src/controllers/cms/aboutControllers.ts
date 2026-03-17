import { CustomRequest } from '../../types/common';
import { IAboutBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';

import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { AboutService } from '../../services/cms/aboutService';

const createAbout = asyncHandler(
    async (req: CustomRequest<IAboutBody>, res: Response) => {
        const aboutService = new AboutService
        const payload = req?.body;
        const userid = req?.user_id;
    
        console.log(payload, 'payload');
        console.log(userid, 'userid');



        if (!userid) {
            throw new Error("User ID is required.");
        }

        const aboutCreated = await aboutService.createAbout(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'About Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            aboutCreated
        );
    }
);


const updateAbout = asyncHandler(

    async (req: CustomRequest<IAboutBody>, res: Response) => {
        const aboutService = new AboutService
        const payload = req.body;
        const userid = req?.user_id
        const aboutId = req?.params.id
    
       

        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const aboutUsUpdated = await aboutService.updateAbout(payload, aboutId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'About Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            aboutUsUpdated
        );
    }
); 

const getAbout = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const aboutService = new AboutService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const getAboutSuccess = await aboutService.getAbout()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'About Success',
            API_RESPONSE_STATUS.SUCCESS,
            getAboutSuccess



        );
    }
);


export default{
    updateAbout,
    getAbout,
    createAbout,

}