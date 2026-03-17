
import { Response, Request } from 'express';
import { CustomRequest } from "../../../types/common";
import asyncHandler from "../../../utils/asyncHandler";
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import { AdminCareerOpportunityService } from '../../../services/admin/careerOpportunity/adminCareerOpportunityService';
import { IJobPostActiveInactive, IJobPostApprovalBody } from '../../../types/requests';


const getPostedPendingJobList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
      
    const adminCareerOpportunityService = new AdminCareerOpportunityService()
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const jobList = await adminCareerOpportunityService.getPostedPendingJobList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Job List Success',
            API_RESPONSE_STATUS.SUCCESS,
            jobList


        );
    }
);

const getPostedApprovedJobList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
      
    const adminCareerOpportunityService = new AdminCareerOpportunityService()
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const jobList = await adminCareerOpportunityService.getPostedApprovedJobList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Job List Success',
            API_RESPONSE_STATUS.SUCCESS,
            jobList


        );
    }
);

const jobApproveDecline = asyncHandler(
    async (req: CustomRequest<IJobPostApprovalBody>, res: Response) => {
        const adminCareerOpportunityService = new AdminCareerOpportunityService()
        const payload = req.body;
        const approved_by = req.user_id;
        
        console.log(payload, 'paylooadd');
        if (!approved_by) {
            throw new Error("User ID is required to become a member.");
        }

        const approvalStatus = await adminCareerOpportunityService.jobApproveDecline(
            payload,
            approved_by
        );

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            approvalStatus.message, // Use the message from the `approvalStatus` object
            API_RESPONSE_STATUS.SUCCESS
        );
    }
);

const activeInactiveJobPost = asyncHandler(
    async (req: CustomRequest<IJobPostActiveInactive>, res: Response) => {
        const adminCareerOpportunityService = new AdminCareerOpportunityService()
      const payload = req.body;
      const careerOpportunityId = payload.careerOpportunityId;
      const action = payload.action;
  
      console.log(payload,'paylooadd');
      
      const approvalStatus = await adminCareerOpportunityService.activeInactiveJobPost(
        careerOpportunityId,
        action
      );
  
      SuccessResponseWithoutData(
        res,
        RESPONSE_CODE.SUCCESS,
        approvalStatus.message, // Use the message from the `approvalStatus` object
        API_RESPONSE_STATUS.SUCCESS
      );
    }
  );
  const getDeletedJobList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminCareerOpportunityService = new AdminCareerOpportunityService()
        const userid = req?.user_id
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }
        const jobList = await adminCareerOpportunityService.getDeletedJobList()
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Deleted Job List Success',
            API_RESPONSE_STATUS.SUCCESS,
            jobList
        );
    }
);

export default {
    getPostedPendingJobList,
    getPostedApprovedJobList,
    jobApproveDecline,
    activeInactiveJobPost,
    getDeletedJobList,
};