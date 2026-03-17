
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IActiveInactiveBusinessCard, IBusinessCardBody, ICareerOpportunityBody, IDigitalCardGalleryBody, IDigitalCardSliderBody, IPaginationQuery, IUpdateDigitalCardGalleryBody, IUpdateSliderGalleryBody } from '../../types/requests';
import exp from 'node:constants';
import { BusinessCardService } from '../../services/user/businessCard/businessCardService';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { ParamsDictionary } from 'express-serve-static-core';
import { Response, Request } from 'express';

const createBusinessCard = asyncHandler(

    async (req: CustomRequest<IBusinessCardBody>, res: Response) => {
        const businessCardService = new BusinessCardService
        const payload = req.body;
        const userid = req?.user_id

        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");


        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const businessCardCreated = await businessCardService.createBusinessCard(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Created Success ',
            API_RESPONSE_STATUS.SUCCESS,
            businessCardCreated
        );
    }
);

const updateBusinessCard = asyncHandler(

    async (req: CustomRequest<IBusinessCardBody>, res: Response) => {
        const businessCardService = new BusinessCardService
        const payload = req.body;
        const userid = req?.user_id
        const businessCardId = req.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");
        console.log(businessCardId, " businessCardId");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }


        const businessCardCreated = await businessCardService.updateBusinessCard(payload, businessCardId, file)


        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            businessCardCreated
        );
    }
);

const activeInactiveBusinessCard = asyncHandler(

    async (req: CustomRequest<IActiveInactiveBusinessCard>, res: Response) => {
        const businessCardService = new BusinessCardService
        const payload = req.body;
        const userid = req?.user_id
        const businessCardId = req.params.id

        console.log(payload, " payload");
        console.log(businessCardId, " businessCardId");
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const businessCardActiveInactive = await businessCardService.activeInactiveBusinessCard(payload, businessCardId, userid)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.CREATED,
            businessCardActiveInactive.message,
            API_RESPONSE_STATUS.SUCCESS,

        );
    }
);

const getBusinessCard = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService
        const userid = req?.user_id
        const businessCardId = req.params.id
        console.log(userid, " userid");
        console.log(businessCardId, " businessCardId");

        // if (!userid) {
        //     throw new Error("User ID is required to become a member.");
        // }

        const businessCard = await businessCardService.getBusinessCard(businessCardId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Success',
            API_RESPONSE_STATUS.SUCCESS,
            businessCard



        );
    }
);

const getDigitalCardList = asyncHandler(
    async (
        req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService
        const reqQuery = req.query
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const getDigitalCardList = await businessCardService.getUserDigitalCardList( userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Digital Card List Success',
            API_RESPONSE_STATUS.SUCCESS,
            getDigitalCardList



        );
    }
);

const getDigitalGalleryList = asyncHandler(
    async (
        req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService
        const reqQuery = req.query
        const userid = req?.user_id
        const businessCardId = req?.params.id

        console.log(userid, " userid");
        console.log(businessCardId, " businessCardId");
        console.log(reqQuery, " reqQuery");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const getDigitalGalleryList = await businessCardService.getPaginationUserDigitalGalleryList(reqQuery, businessCardId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Digital Gallery List Success',
            API_RESPONSE_STATUS.SUCCESS,
            getDigitalGalleryList
        );
    }
);

const getDigitalGalleryImages = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService

        const userid = req?.user_id
        const digitalCardGalleryId = req.params.id
        console.log(userid, " userid");
        console.log(digitalCardGalleryId, " digitalCardGalleryId");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const digitalCardGalleryImages = await businessCardService.getDigitalCardGalleryImages(digitalCardGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Success',
            API_RESPONSE_STATUS.SUCCESS,
            digitalCardGalleryImages



        );
    }
);

const digitalCardGallery = asyncHandler(

    async (req: CustomRequest<IDigitalCardGalleryBody>, res: Response) => {
        const businessCardService = new BusinessCardService
        const files = req.files
        const userid = req?.user_id
        const businessCardId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(businessCardId, " businessCardId");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const digitalCardGallerySuccess = await businessCardService.digitalCardGallery(payload, businessCardId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Gallery Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            digitalCardGallerySuccess
        );
    }
);

const updateDigitalCardGallery = asyncHandler(

    async (req: CustomRequest<IUpdateDigitalCardGalleryBody>, res: Response) => {
        const businessCardService = new BusinessCardService
        const files = req.files
        const userid = req?.user_id
        const businessCardId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(businessCardId, " businessCardId");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const updateDigitalCardGallerySuccess = await businessCardService.updateDigitalCardGallery(payload, businessCardId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Gallery Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateDigitalCardGallerySuccess
        );
    }
);

const deleteDigitalCardGallery = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const businessCardService = new BusinessCardService

        const userid = req?.user_id
        const digitalCardGalleryId = req.params.id


        console.log(digitalCardGalleryId, " digitalCardGalleryId");
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteDigitalCardGallerySuccess = await businessCardService.deleteDigitalCardGallery(digitalCardGalleryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Gallery Succes',
            API_RESPONSE_STATUS.SUCCESS,
            deleteDigitalCardGallerySuccess,


        );
    }
);

const digitalCardSlider = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const businessCardService = new BusinessCardService
        const files = req.files
        const userid = req?.user_id
        const businessCardId = req.params.id

        console.log(files, " files");
        console.log(businessCardId, " businessCardId");
        console.log(userid, " userid");


        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const digitalCardSliderSuccess = await businessCardService.digitalCardSlider(businessCardId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Slider Saved Succes',
            API_RESPONSE_STATUS.SUCCESS,
            digitalCardSliderSuccess
        );
    }
);

const updateDigitalSlider = asyncHandler(

    async (req: CustomRequest<IUpdateSliderGalleryBody>, res: Response) => {
        const businessCardService = new BusinessCardService
        const files = req.files
        const userid = req?.user_id
        const businessCardId = req.params.id
        const payload = req.body

        console.log(files, " files");
        console.log(businessCardId, " businessCardId");
        console.log(userid, " userid");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const updateDigitalCardSliderSuccess = await businessCardService.updateDigitalCardSlider(payload, businessCardId, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Slider Updated Succes',
            API_RESPONSE_STATUS.SUCCESS,
            updateDigitalCardSliderSuccess
        );
    }
);

const getDigitalSliderImages = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService

        const userid = req?.user_id
        const digitalCardId = req.params.id
        console.log(userid, " userid");
        console.log(digitalCardId, " digitalCardId");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const digitalCardSliderImages = await businessCardService.getDigitalCardSliderImages(digitalCardId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Success',
            API_RESPONSE_STATUS.SUCCESS,
            digitalCardSliderImages



        );
    }
);


const getDigitalGalleries = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessCardService = new BusinessCardService

        const userid = req?.user_id
        const digitalCardId = req.params.id
        console.log(userid, " userid");
        console.log(digitalCardId, " digitalCardId");


        const digitalCardGalleryImages = await businessCardService.getDigitalCardGalleries(digitalCardId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Business Card Success',
            API_RESPONSE_STATUS.SUCCESS,
            digitalCardGalleryImages



        );
    }
);



export default {
    createBusinessCard,
    updateBusinessCard,
    activeInactiveBusinessCard,
    getBusinessCard,
    getDigitalCardList,
    getDigitalGalleryList,
    getDigitalGalleryImages,
    digitalCardGallery,
    updateDigitalCardGallery,
    deleteDigitalCardGallery,
    digitalCardSlider,
    updateDigitalSlider,
    getDigitalSliderImages,
    getDigitalGalleries

}
