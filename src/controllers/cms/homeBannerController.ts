import { CustomRequest } from "../../types/common";
import { IHomeBannerBody, IUpdateHomeBannerBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response, Request } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { AdminPhotoGalleryService } from "../../services/admin/adminPhotoGallery/adminPhotoGalleryService";
import { ForeignEmbassiesService } from "../../services/cms/foreignEmbassiesService";
import { HomeBannerService } from "../../services/cms/homeBannerService";



const createHomeBanner = asyncHandler(

    async (req: CustomRequest<IHomeBannerBody>, res: Response) => {
        const homeBannerService = new HomeBannerService
        const files = req.files
        const userid = req?.user_id

        const payload = req.body
        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required ");
        }

        const homeBannerSuccess = await homeBannerService.createHomeBanner(userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Home Banner Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            homeBannerSuccess
        );
    }
);

const updateHomeBanner = asyncHandler(

    async (req: CustomRequest<IUpdateHomeBannerBody>, res: Response) => {
        const homeBannerService = new HomeBannerService
        const files = req.files
        const userid = req?.user_id
        const homeBannerId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const updateForeignEmbassiesSuccess = await homeBannerService.updateHomeBanner(payload, homeBannerId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Home Banner Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateForeignEmbassiesSuccess
        );
    }
);


const getHomeBanner = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const homeBannerService = new HomeBannerService

        const userid = req?.user_id



        if (!userid) {
            throw new Error("User ID is required.");
        }

        const foreignEmbassies = await homeBannerService.getHomeBanner()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Home Banner Photo Success',
            API_RESPONSE_STATUS.SUCCESS,
            foreignEmbassies



        );
    }
);

export default {
    createHomeBanner,
    updateHomeBanner,
    getHomeBanner,

}