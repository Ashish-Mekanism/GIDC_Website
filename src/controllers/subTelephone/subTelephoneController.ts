import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { ISubTelephoneBody } from '../../types/requests';
import { CustomRequest } from '../../types/common';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SubTelephoneService } from '../../services/admin/subTelephone/subTelephoneService';

const createSubTelephone = asyncHandler(
    async (req: CustomRequest<ISubTelephoneBody>, res: Response) => {
        const subTelephoneService = new SubTelephoneService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const subTelephoneCreated = await subTelephoneService.createSubTelephone(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Sub Telephone Title Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            subTelephoneCreated
        );
    }
);


const updateSubTelephone = asyncHandler(

    async (req: CustomRequest<ISubTelephoneBody>, res: Response) => {
        const subTelephoneService = new SubTelephoneService
        const payload = req.body;
        const userid = req?.user_id
        const subTelephoneId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");
        console.log(subTelephoneId, " subTelephoneId");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }
        const SubTelephoneUpdated = await subTelephoneService.updateSubTelephone(payload, subTelephoneId, file)
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Sub Telephone Uspdated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            SubTelephoneUpdated
        );
    }
);

const getSubTelephoneList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const subTelephoneService = new SubTelephoneService
        const TelephoneModelId = req?.params.id;
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const subTelephoneList = await subTelephoneService.getSubTelephoneList(TelephoneModelId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Sub Telephone List Success',
            API_RESPONSE_STATUS.SUCCESS,
            subTelephoneList

        );
    }
);


const deleteSubTelephone = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const subTelephoneService = new SubTelephoneService

        const userid = req?.user_id
        const subTelephoneId = req.params.id
        
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }

        const subTelephoneSuccess = await subTelephoneService.deleteSubTelephone(subTelephoneId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            subTelephoneSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);
export default {
    createSubTelephone,
    updateSubTelephone,
    getSubTelephoneList,
    deleteSubTelephone,
}