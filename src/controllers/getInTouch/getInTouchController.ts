import { CustomRequest } from "../../types/common";
import { IGetInTouch } from "../../types/models";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { GetInTouchService } from "../../services/getInTouchService";
import { SuccessResponseWithData } from "../../utils/responses";
import { IGetInTouchBody } from "../../types/requests";

const getIntouch= asyncHandler(
    
    async (req: CustomRequest<IGetInTouchBody>, res: Response) => {
        const getInTouchService= new GetInTouchService
        const payload = req.body;
        const GetInTouchSucess = await getInTouchService.getInTouch(payload)
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Get In Touch Success ',
            API_RESPONSE_STATUS.SUCCESS,
            GetInTouchSucess
        );
    }
);

//Admin side Api
const getInTouchList= asyncHandler(
        
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
            const getInTouchService= new GetInTouchService
           
            const GetInTouchSucess = await getInTouchService.getInTouchList()
            SuccessResponseWithData(
                res,
                RESPONSE_CODE.CREATED,
                'Get In Touch List Success ',
                API_RESPONSE_STATUS.SUCCESS,
                GetInTouchSucess
            );
        }
    );

export default{
    getIntouch,
    getInTouchList
}