import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IPresidentMessageBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { PresidentMessageService } from '../../services/cms/presidentMessageService';


const createPresidentMessage = asyncHandler(
    async (req: CustomRequest<IPresidentMessageBody>, res: Response) => {
        const presidentMessageService = new PresidentMessageService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const messageCreated = await presidentMessageService.createPresidentMessage(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Message Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            messageCreated
        );
    }
);

const getPresidentMessageList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const presidentMessageService = new PresidentMessageService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const subTelephoneList = await presidentMessageService.getPresidentMessageList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'President Message List Success',
            API_RESPONSE_STATUS.SUCCESS,
            subTelephoneList



        );
    }
);

const updatePresidentMessage = asyncHandler(

    async (req: CustomRequest<IPresidentMessageBody>, res: Response) => {
        const presidentMessageService = new PresidentMessageService
        const payload = req.body;
        const userid = req?.user_id
        const presidentMessageId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");
        console.log(presidentMessageId, " presidentMessageId");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const presidentMessageUpdated = await presidentMessageService.updatePresidentMessage(payload, presidentMessageId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'President Message Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            presidentMessageUpdated
        );
    }
);

const deletePresidentMessage = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const presidentMessageService = new PresidentMessageService

        const userid = req?.user_id
        const presidentMessageId = req.params.id


        console.log(presidentMessageId, " presidentMessageId");
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deletePresidentMessageSuccess = await presidentMessageService.deletePresidentMessage(presidentMessageId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            deletePresidentMessageSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default{

    createPresidentMessage,
    getPresidentMessageList,
    updatePresidentMessage,
    deletePresidentMessage,

}