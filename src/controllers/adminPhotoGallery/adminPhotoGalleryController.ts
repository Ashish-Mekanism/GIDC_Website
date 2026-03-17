import { CustomRequest } from "../../types/common";
import { IAdminPhotoGalleryBody, IUpdateAdminPhotoGalleryBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response, Request } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { AdminPhotoGalleryService } from "../../services/admin/adminPhotoGallery/adminPhotoGalleryService";



const adminPhotoGallery = asyncHandler(

    async (req: CustomRequest<IAdminPhotoGalleryBody>, res: Response) => {
const adminPhotoGalleryService= new AdminPhotoGalleryService
        const files = req.files
        const userid = req?.user_id
     
        const payload = req.body
        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

       const adminPhotoGallerySuccess = await adminPhotoGalleryService.createAdminPhotoGallery(payload, userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            ' Photo Gallery Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            adminPhotoGallerySuccess
        );
    }
);

const updateadminPhotoGallery = asyncHandler(

    async (req: CustomRequest<IUpdateAdminPhotoGalleryBody>, res: Response) => {
        const adminPhotoGalleryService= new AdminPhotoGalleryService
        const files = req.files
        const userid = req?.user_id
        const adminPhotoGalleryId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const updateAdminPhotoGallerySuccess = await adminPhotoGalleryService.updateAdminPhotoGallery(payload, adminPhotoGalleryId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Photo Gallery Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateAdminPhotoGallerySuccess
        );
    }
);

const deleteAdminPhotoGallery = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const adminPhotoGalleryService = new AdminPhotoGalleryService

        const userid = req?.user_id
        const adminPhotoGalleryId = req.params.id


        console.log(adminPhotoGalleryId, " adminPhotoGalleryId");
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteDigitalCardGallerySuccess = await adminPhotoGalleryService.deleteAdminPhotoGallery(adminPhotoGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            deleteDigitalCardGallerySuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
            deleteDigitalCardGallerySuccess,


        );
    }
);


const getPhotoGalleryList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const adminPhotoGalleryService = new AdminPhotoGalleryService
      
      const photoGalleryList = await adminPhotoGalleryService.getAdminPhotoGalleryList();
  
      SuccessResponseWithData(
        res,
        RESPONSE_CODE.SUCCESS,
        " Admin Photo Gallery List Success",
        API_RESPONSE_STATUS.SUCCESS,
        photoGalleryList ,
      );
    }
  );


  const getPhotoGallery = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminPhotoGalleryService = new AdminPhotoGalleryService

        const userid = req?.user_id
        const adminPhotoGalleryId = req.params.id
        console.log(userid, " userid");
        console.log(adminPhotoGalleryId, " adminPhotoGalleryId");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const photoGallery = await adminPhotoGalleryService.getPhotoGalleryImages(adminPhotoGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Photo Gallery Success',
            API_RESPONSE_STATUS.SUCCESS,
            photoGallery



        );
    }
);

 export default {
    adminPhotoGallery,
    updateadminPhotoGallery,
    deleteAdminPhotoGallery,
    getPhotoGalleryList,
    getPhotoGallery,
}