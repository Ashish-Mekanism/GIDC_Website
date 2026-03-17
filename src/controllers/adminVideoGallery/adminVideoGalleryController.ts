import { CustomRequest } from "../../types/common";
import { IAdminVideoGalleryBody, IUpdateAdminVideoGalleryBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response, Request } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { AdminVideoGalleryService } from "../../services/admin/adminVideoGallery/adminVideoGalleryService";



const adminVideoGallery = asyncHandler(

    async (req: CustomRequest<IAdminVideoGalleryBody>, res: Response) => {
        const adminVideoGalleryService = new AdminVideoGalleryService
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const userid = req?.user_id

        const payload = req.body
        console.log(files, " files");
        // console.log(userid, " userid");
        // console.log(payload, " payload");
        // const posterFile = files?.Poster?.[0]; // single poster image
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const adminVideoGallerySuccess = await adminVideoGalleryService.createAdminVideoGallery(payload, userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            ' Video Gallery Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            adminVideoGallerySuccess
        );
    }
);

const updateAdminVideoGallery = asyncHandler(

    async (req: CustomRequest<IUpdateAdminVideoGalleryBody>, res: Response) => {
        const adminVideoGalleryService = new AdminVideoGalleryService
        const files = req.files
        const userid = req?.user_id
        const adminVideoGalleryId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const updateAdminVideoGallerySuccess = await adminVideoGalleryService.updateAdminVideoGallery(payload, adminVideoGalleryId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Video Gallery Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateAdminVideoGallerySuccess
        );
    }
);

const deleteAdminVideoGallery = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const adminVideoGalleryService = new AdminVideoGalleryService

        const userid = req?.user_id
        const adminVideoGalleryId = req.params.id

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteDigitalCardGallerySuccess = await adminVideoGalleryService.deleteAdminVideoGallery(adminVideoGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            deleteDigitalCardGallerySuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
            deleteDigitalCardGallerySuccess,


        );
    }
);


const getVideoGalleryList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const adminVideoGalleryService = new AdminVideoGalleryService

        const videoGalleryList = await adminVideoGalleryService.getAdminVideoGalleryList();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            " Admin Video Gallery List Success",
            API_RESPONSE_STATUS.SUCCESS,
            videoGalleryList,
        );
    }
);


const getVideoGallery = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminVideoGalleryService = new AdminVideoGalleryService

        const userid = req?.user_id
        const adminVideoGalleryId = req.params.id
        console.log(userid, " userid");


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const videoGallery = await adminVideoGalleryService.getAdminGalleryVideos(adminVideoGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Video Gallery Success',
            API_RESPONSE_STATUS.SUCCESS,
            videoGallery



        );
    }
);

export default {
    adminVideoGallery,
    getVideoGalleryList,
    getVideoGallery,
    updateAdminVideoGallery,
    deleteAdminVideoGallery,
}