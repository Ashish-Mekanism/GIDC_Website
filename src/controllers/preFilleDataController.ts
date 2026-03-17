import { CustomRequest } from "../types/common";
import asyncHandler from "../utils/asyncHandler";
import { Response } from 'express';
import { SuccessResponseWithData } from "../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../utils/constants";
import { PreFilledDataService } from "../services/preFilledDataService";

const getPreFilledData = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const preFilledDataService= new PreFilledDataService
    
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const eventList = await preFilledDataService.getPreFilledData(userid )

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Pre Filled Data Success',
            API_RESPONSE_STATUS.SUCCESS,
            eventList


        );
    }
);

 export  default{

getPreFilledData

}