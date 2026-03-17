import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IAdminContactUsBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData } from '../../utils/responses';
import { AdminContactUsService } from '../../services/cms/contactUsService';



const createAdminContactUs = asyncHandler(
    async (req: CustomRequest<IAdminContactUsBody>, res: Response) => {
        const adminContactUsService = new AdminContactUsService

        const payload = req?.body;
        const userid = req?.user_id;
        
        console.log(payload, 'payload');
        console.log(userid, 'userid');
    

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const contactUsCreated = await adminContactUsService.createContactUs(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Contact Us Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            contactUsCreated
        );
    }
);

const getContactUs = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminContactUsService = new AdminContactUsService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const getContactUsSuccess = await adminContactUsService.getContactUs()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Contact Us Success',
            API_RESPONSE_STATUS.SUCCESS,
            getContactUsSuccess



        );
    }
);

const updateAdminContactUs = asyncHandler(

    async (req: CustomRequest<IAdminContactUsBody>, res: Response) => {
        const adminContactUsService = new AdminContactUsService
        const payload = req.body;
        const userid = req?.user_id
        const contactUsId = req?.params.id
        console.log(payload, " payload");
       

        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const contactUsUpdated = await adminContactUsService.updateContactUs(payload, contactUsId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Contact Us Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            contactUsUpdated
        );
    }
);

export default{
    createAdminContactUs,
    getContactUs,
    updateAdminContactUs,
}