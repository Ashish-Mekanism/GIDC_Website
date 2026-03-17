import { Response, Request } from 'express';
import { CustomRequest } from '../../../types/common';
import asyncHandler from '../../../utils/asyncHandler';
import { SuccessResponseWithData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import { AdminApplyJobService } from '../../../services/admin/applyJob/applyJobService';

const getAppliedJobSeekerList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminApplyJobService = new AdminApplyJobService();
    const userid = req?.user_id;
    console.log(userid, ' userid');

    const fromDate = req?.query?.fromDate as string;
    const toDate = req?.query?.toDate as string;

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const jobList = await adminApplyJobService.getAppliedJobSeekerList({
      fromDate,
      toDate,
    });

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Seeker List Success',
      API_RESPONSE_STATUS.SUCCESS,
      jobList
    );
  }
);

const getAppliedParticularJobSeekerList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminApplyJobService = new AdminApplyJobService();
    const userid = req?.user_id;
    const careerOpportunityId = req?.params.id;
    console.log(userid, ' userid');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const jobList =
      await adminApplyJobService.getAppliedParticularJobSeekerList(
        careerOpportunityId
      );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Seeker List Success',
      API_RESPONSE_STATUS.SUCCESS,
      jobList
    );
  }
);

export default {
  getAppliedJobSeekerList,
  getAppliedParticularJobSeekerList,
};
