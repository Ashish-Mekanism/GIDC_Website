import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IActiveInactiveMember, IActiveInactiveSponsorship, ISponsorshipApprovalBody, ISponsorshipBody } from '../../types/requests';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SponsorshipService } from '../../services/sponsorshipService';

const createSponsorship= asyncHandler(
    async (req: CustomRequest<ISponsorshipBody>, res: Response) => {
        const sponsorshipService= new SponsorshipService
        const payload = req?.body;
        const CreatedBy= req?.user_id;
        const file= req?.file;
        
        // if (!userId) {
        //     throw new Error("User ID is required.");
        // }
        const sponsorshipSuccess = await sponsorshipService.createSponsorship(payload,file,CreatedBy)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Sponsorship submitted Success ',
            API_RESPONSE_STATUS.SUCCESS,
            sponsorshipSuccess
        );
    }
);

const updateSponsorship = asyncHandler(

    async (req: CustomRequest<ISponsorshipBody>, res: Response) => {
        const sponsorshipService= new SponsorshipService
        const payload = req.body;
       
        const sponsorshipId = req?.params.id
         const file = req?.file
        console.log(payload, " payload");
        console.log(sponsorshipId, " sponsorshipId");


        const sponsorshipUpdated = await sponsorshipService.updateSponsorship(payload, sponsorshipId,file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Sponsorship Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            sponsorshipUpdated
        );
    }
);

const sponsorshipActiveInactive = asyncHandler(
    async (req: CustomRequest<IActiveInactiveSponsorship>, res: Response) => {
        const sponsorshipService= new SponsorshipService
      const payload = req.body;
      const sponsorshipId = payload.sponsorshipId;
      const action = payload.action;
  
      console.log(payload,'paylooadd');
      
      const approvalStatus = await sponsorshipService.activeInactiveSponsorship(
        sponsorshipId,
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

  const approveSponsorship = asyncHandler(
    async (req: CustomRequest<ISponsorshipApprovalBody>, res: Response) => {
        const sponsorshipService= new SponsorshipService
      const payload = req.body;
      const sponsorship_Id = payload.sponsorshipId;
      const action = payload.action;
      const amount= payload.amount;
  
      console.log(payload,'paylooadd');
      
      const approvalStatus = await sponsorshipService.sponsorshipApproval(
        sponsorship_Id,
        action,
        amount,
      );
  
      SuccessResponseWithoutData(
        res,
        RESPONSE_CODE.SUCCESS,
        approvalStatus.message, // Use the message from the `approvalStatus` object
        API_RESPONSE_STATUS.SUCCESS
      );
    }
  );

  const getSponsorshipRequestList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const sponsorshipService= new SponsorshipService
    
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const sponsorshipRequestList = await sponsorshipService.getSponsorshipRequestList( )

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Sponsorship Request List Success',
            API_RESPONSE_STATUS.SUCCESS,
            sponsorshipRequestList



        );
    }
);

const getSponsorshipApprovedList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const sponsorshipService= new SponsorshipService
    
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const sponsorshipApprovedtList = await sponsorshipService.getSponsorshipApprovedList( )

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Sponsorship Approved List Success',
            API_RESPONSE_STATUS.SUCCESS,
            sponsorshipApprovedtList



        );
    }
);

export default{
    createSponsorship,
    updateSponsorship,
    sponsorshipActiveInactive,
    approveSponsorship,
    getSponsorshipRequestList,
    getSponsorshipApprovedList,
}