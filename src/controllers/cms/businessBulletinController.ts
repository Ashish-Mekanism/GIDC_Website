import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IBusinessBulletinBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { BusinessBulletinService } from '../../services/cms/businessBulletinService';



const createBusinessBulletin = asyncHandler(
    async (req: CustomRequest<IBusinessBulletinBody>, res: Response) => {
        const businessBulletinService = new BusinessBulletinService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const businessBulletinCreated = await businessBulletinService.createBusinessBulletin(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Bulletin Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            businessBulletinCreated
        );
    }
);


const getBusinessBulletinList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessBulletinService = new BusinessBulletinService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const businessBulletinList = await businessBulletinService.getBusinessBulletinList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Business Bulletin List Success',
            API_RESPONSE_STATUS.SUCCESS,
            businessBulletinList



        );
    }
);

const updateBusinessBulletin = asyncHandler(

    async (req: CustomRequest<IBusinessBulletinBody>, res: Response) => {
        const businessBulletinService = new BusinessBulletinService
        const payload = req.body;
        const userid = req?.user_id
        const businessBulletinId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");
       

        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const businessBulletinUpdated = await businessBulletinService.updateBusinessBulletin(payload, businessBulletinId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Bulletin Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            businessBulletinUpdated
        );
    }
);

const deleteBusinessBulletin = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const businessBulletinService = new BusinessBulletinService

        const userid = req?.user_id
        const businessBulletinId = req.params.id


        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteBusinessBulletinSuccess = await businessBulletinService.deleteBusinessBulletin(businessBulletinId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            deleteBusinessBulletinSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default{

    createBusinessBulletin,
    getBusinessBulletinList,
    updateBusinessBulletin,
    deleteBusinessBulletin,

}