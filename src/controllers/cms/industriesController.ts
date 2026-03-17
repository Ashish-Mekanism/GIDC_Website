import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IIndustriesBody} from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { IndustriesService } from '../../services/cms/industriesService';


const createIndustry = asyncHandler(
    async (req: CustomRequest<IIndustriesBody>, res: Response) => {
        const industriesService = new IndustriesService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const industryCreated = await industriesService.createIndustry(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Industry Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            industryCreated
        );
    }
);

const getIndustriesList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const industriesService = new IndustriesService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const industriesList = await industriesService.getIndustriesList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Industrie List Success',
            API_RESPONSE_STATUS.SUCCESS,
            industriesList



        );
    }
);

const updateIndustry = asyncHandler(

    async (req: CustomRequest<IIndustriesBody>, res: Response) => {
        const industriesService = new IndustriesService
        const payload = req.body;
        const userid = req?.user_id
        const industryId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const industryUpdated = await industriesService.updateIndustry(payload, industryId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Industry Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            industryUpdated
        );
    }
);

const deleteIndustry = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const industriesService = new IndustriesService

        const userid = req?.user_id
        const industryId = req.params.id


      
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const deleteIndustrySuccess = await industriesService.deleteIndustry(industryId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            deleteIndustrySuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default{

    createIndustry,
    getIndustriesList,
    updateIndustry,
    deleteIndustry,

}