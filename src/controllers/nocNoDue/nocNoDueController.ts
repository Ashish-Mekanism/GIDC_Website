import { NoNocDueService } from "../../services/user/noc/nocNoDueService";
import { CustomRequest } from "../../types/common";
import { INocFormBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
const createNoc = asyncHandler(

    async (req: CustomRequest<INocFormBody>, res: Response) => {

        const noNocDueService= new NoNocDueService
        const payload = req.body;
        const userid = req?.user_id

        const files = req?.files

        if (!userid) {
            throw new Error("User ID is required.");
        }

         const NoNocDueformCreated = await noNocDueService.createNoNocDue(payload, userid, files)
     
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'NOC No Due Form Success ',
            API_RESPONSE_STATUS.SUCCESS,
            NoNocDueformCreated
        );
    }
);

export default{
    createNoc
}