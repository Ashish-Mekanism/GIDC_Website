import { CustomRequest } from '../../types/common';
import { IAboutUsImagesBody, IOverviewBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData } from '../../utils/responses';
import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { OverviewService } from '../../services/cms/overviewService';

const createOverview = asyncHandler(
    async (req: CustomRequest<IOverviewBody>, res: Response) => {
        const overviewService = new OverviewService
        const payload = req?.body;
        const userid = req?.user_id;

        console.log(payload, 'payload');
        console.log(userid, 'userid');



        if (!userid) {
            throw new Error("User ID is required.");
        }

        const overviewCreated = await overviewService.createOverview(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Overview Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            overviewCreated
        );
    }
);


const updateOverview = asyncHandler(

    async (req: CustomRequest<IOverviewBody>, res: Response) => {
        const overviewService = new OverviewService
        const payload = req.body;
        const userid = req?.user_id
        const overviewId = req?.params.id



        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const overviewUpdated = await overviewService.updateOverview(payload, overviewId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Overview Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            overviewUpdated
        );
    }
);

const getOverview = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const overviewService = new OverviewService

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const getOverviewSuccess = await overviewService.getOverview()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Overview Success',
            API_RESPONSE_STATUS.SUCCESS,
            getOverviewSuccess



        );
    }
);


const updateAboutUsImage = asyncHandler(

    async (req: CustomRequest<IAboutUsImagesBody>, res: Response) => {
    const overviewService = new OverviewService
        const files = req.files
        const userid = req?.user_id
     
        const payload = req.body
        console.log(files, " files");
        console.log(userid, " userid");
    
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

       const aboutUsImagesSuccess = await overviewService.updateAboutUsImages( payload, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'About Us Images Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            aboutUsImagesSuccess
        );
    }
);


const createAboutUsImages = asyncHandler(

    async (req: CustomRequest<IAboutUsImagesBody>, res: Response) => {
    const overviewService = new OverviewService
        const files = req.files
        const userid = req?.user_id
     
        const payload = req.body
        console.log(files, " files");
        console.log(userid, " userid");
    
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

       const aboutUsImagesSuccess = await overviewService.createAboutUsImages(userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'About Us Images Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            aboutUsImagesSuccess
        );
    }
);

const getAboutUsImages = asyncHandler(

    async (req: CustomRequest<Request>, res: Response) => {
        const overviewService = new OverviewService
        //const userid = req?.user_id
        // console.log(userid, " userid");
        // if (!userid) {
        //     throw new Error("User ID is required to become a member.");
        // }
         const aboutUsImagesSuccess = await overviewService.getAboutUsImages()
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'About Us Images Success',
            API_RESPONSE_STATUS.SUCCESS,
            aboutUsImagesSuccess
        );
    }
);





export default {
    updateOverview,
    getOverview,
    createOverview,
    createAboutUsImages,
    updateAboutUsImage,
    getAboutUsImages

}