import { CareerOpportunityService } from "../../services/user/careerOpportunity/careerOpportunityService";
import { CustomRequest } from "../../types/common";
import { ICareerOpportunityBody, IDeleteCareerOpportunityBody, IUpdateCareerOpportunityBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response, Request } from 'express';
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { AdminApplyJobService } from "../../services/admin/applyJob/applyJobService";
import ApiError from "../../utils/ApiError";



const careerOpportunity = asyncHandler(

    async (req: CustomRequest<ICareerOpportunityBody>, res: Response) => {
       const careerOpportunityService= new CareerOpportunityService
        const payload = req.body;
        const userid = req?.user_id;

        console.log(payload, " payload");


        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }



        const careerOpportunityCreated = await careerOpportunityService.createCareerOpportunity(payload, userid)


        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Career Opportunity Created Success ',
            API_RESPONSE_STATUS.SUCCESS,
            careerOpportunityCreated
        );
    }
);

const getPostedJobList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const careerOpportunityService= new CareerOpportunityService
    
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const jobList = await careerOpportunityService.getPostedJobList(userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Job List Success',
            API_RESPONSE_STATUS.SUCCESS,
            jobList


        );
    }
);

const updateCareerOpportunity = asyncHandler(
    async (
        req: CustomRequest<IUpdateCareerOpportunityBody>,
        res: Response
    ) => {
        const careerOpportunityService= new CareerOpportunityService
        const payload = req.body;
        const userid = req?.user_id;
        const careerOpportunityId = req.params.id

        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const careerOpportunityCreated = await careerOpportunityService.updateCareerOpportunity(payload, userid,careerOpportunityId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Career Opportunity Created Success ',
            API_RESPONSE_STATUS.SUCCESS,
            careerOpportunityCreated
        );
    }
);

const getAppliedParticularJobSeekerList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
      
       const adminApplyJobService = new AdminApplyJobService()
        const userid = req?.user_id
        const careerOpportunityId= req?.params.id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const jobList = await adminApplyJobService.getAppliedParticularJobSeekerList(careerOpportunityId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Seeker List Success',
            API_RESPONSE_STATUS.SUCCESS,
            jobList


        );
    }
);

const deleteCareerOpportunity = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const careerOpportunityService = new CareerOpportunityService();
        const userId = req?.user_id;
        const  careerOpportunityId  = req.params.id;

        if (!userId) {
            throw new Error("User ID is required.");
        }

        if (!careerOpportunityId) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Career opportunity ID is required.");
        }

        const result = await careerOpportunityService.deleteCareerOpportunity(careerOpportunityId);

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            result.message,
            API_RESPONSE_STATUS.SUCCESS
        );
    }
);




export default{
    careerOpportunity,
    getPostedJobList,
    updateCareerOpportunity,
    getAppliedParticularJobSeekerList,
    deleteCareerOpportunity

}