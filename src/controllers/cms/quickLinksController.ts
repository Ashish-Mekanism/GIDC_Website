import { QuickLinkService } from "../../services/cms/quickLinkService";
import { CustomRequest } from "../../types/common";
import { IQuickLinkBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../utils/responses";
import { Response } from 'express';


const createQuickLink = asyncHandler(
    async (req: CustomRequest<IQuickLinkBody>, res: Response) => {
        const quickLinkService = new QuickLinkService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const quickLinkCreated = await quickLinkService.createQuickLink(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Quick Link Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            quickLinkCreated
        );
    }
);

const updateQuickLink = asyncHandler(

    async (req: CustomRequest<IQuickLinkBody>, res: Response) => {
        const quickLinkService = new QuickLinkService
        const payload = req.body;
        const userid = req?.user_id
        const quickLinkId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");
        console.log(quickLinkId, " quickLinkId");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const quickLinkUpdated = await quickLinkService.updateQuickLink(payload, quickLinkId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Quick Link Uspdated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            quickLinkUpdated
        );
    }
);

const getQuickLinkList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {

        const quickLinkService = new QuickLinkService
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const quickLinkList = await quickLinkService.getQuickLinkList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Quick Link List Success',
            API_RESPONSE_STATUS.SUCCESS,
            quickLinkList
        );
    }
);

const deleteQuickLink= asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const quickLinkService = new QuickLinkService

        const userid = req?.user_id
        const quickLinkId = req.params.id

        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteQuickLinkSuccess = await quickLinkService.deleteQuickLink(quickLinkId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.CREATED,
            deleteQuickLinkSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
           


        );
    }
);

export default{
    createQuickLink,
    updateQuickLink,
    getQuickLinkList,
    deleteQuickLink,

}