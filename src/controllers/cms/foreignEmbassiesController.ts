import { CustomRequest } from "../../types/common";
import { IAdminPhotoGalleryBody, IForeignEmbassiesBody, IUpdateAdminPhotoGalleryBody, IUpdateForeignEmbassiesBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response, Request } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { AdminPhotoGalleryService } from "../../services/admin/adminPhotoGallery/adminPhotoGalleryService";
import { ForeignEmbassiesService } from "../../services/cms/foreignEmbassiesService";



const createForeignEmbassies = asyncHandler(

    async (req: CustomRequest<IForeignEmbassiesBody>, res: Response) => {
const foreignEmbassiesService= new ForeignEmbassiesService
        const files = req.files
        const userid = req?.user_id
     
        const payload = req.body
        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

       const foreignEmbassiesSuccess = await foreignEmbassiesService.createForeignEmbassies(userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Foreign Embassies Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            foreignEmbassiesSuccess
        );
    }
);

const updateForeignEmbassies = asyncHandler(

    async (req: CustomRequest<IUpdateForeignEmbassiesBody>, res: Response) => {
        const foreignEmbassiesService= new ForeignEmbassiesService
        const files = req.files
        const userid = req?.user_id
        const foreignEmbassiesId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const updateForeignEmbassiesSuccess = await foreignEmbassiesService.updateForeignEmbassies(payload, foreignEmbassiesId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Foreign Embassies Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateForeignEmbassiesSuccess
        );
    }
);


  const getForeignEmbassies= asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const foreignEmbassiesService= new ForeignEmbassiesService

        const userid = req?.user_id
    


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const foreignEmbassies = await foreignEmbassiesService.getForeignEmbassies()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Foreign Embassies Photo Success',
            API_RESPONSE_STATUS.SUCCESS,
            foreignEmbassies



        );
    }
);

 export default {
    createForeignEmbassies,
    getForeignEmbassies,
    updateForeignEmbassies,
}