import { ApplyJobService } from "../../services/user/applyJob/applyJobService";
import { CustomRequest } from "../../types/common";
import { IApplyJobBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response, Request } from 'express';

const applyJob = asyncHandler(

    async (req: CustomRequest<IApplyJobBody>, res: Response) => {
        const applyJobService = new ApplyJobService()
        const payload = req.body;

        const file = req.file;

        console.log(payload, " payload");

        const careerOpportunityCreated = await applyJobService.applyJob(payload, file)


        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Job Appiled Successfully ',
            API_RESPONSE_STATUS.SUCCESS,
            careerOpportunityCreated
        );
    }
);

export default {
    applyJob
}