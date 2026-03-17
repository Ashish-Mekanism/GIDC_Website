import { CustomRequest } from "../../types/common";
import { ICommitteeBody, ITelephoneBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../utils/responses";
import { CommitteeService } from "../../services/cms/committeeService";


const createCommittee = asyncHandler(
    async (req: CustomRequest<ICommitteeBody>, res: Response) => {
     const committeeService= new CommitteeService
        const payload = req?.body;
        const userid = req?.user_id
        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const CommitteeCreated = await committeeService.createCommittee(payload,userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Committee Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            CommitteeCreated
        );
    }
);


const updateCommittee = asyncHandler(
  async (req: CustomRequest<ICommitteeBody>, res: Response) => {
   const committeeService= new CommitteeService
   const CommitteeId=req?.params.id;
      const payload = req?.body;
      const userid = req?.user_id
      console.log(payload, 'payload');
      console.log(userid, 'userid');

      if (!userid) {
          throw new Error("User ID is required.");
      }

      const committeeUpdated = await committeeService.updateCommittee(payload,CommitteeId)

      SuccessResponseWithData(
          res,
          RESPONSE_CODE.CREATED,
          'Committee Updated Successfully',
          API_RESPONSE_STATUS.SUCCESS,
          committeeUpdated
      );
  }
);

const getCommitteeList= asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const committeeService= new CommitteeService
      
      const committeeList = await committeeService.getCommitteeList();
  
      SuccessResponseWithData(
        res,
        RESPONSE_CODE.SUCCESS,
        "CommitteeList List Success",
        API_RESPONSE_STATUS.SUCCESS,
        committeeList ,
      );
    }
  );

const deleteCommittee = asyncHandler(

    async (req: CustomRequest, res: Response) => {
      const committeeService= new CommitteeService

        const userid = req?.user_id
        const CommitteeId = req.params.id
        
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }

        const committeeSuccess = await committeeService.deleteCommittee(CommitteeId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            committeeSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);


export default {
    createCommittee,
    updateCommittee,
    getCommitteeList,
    deleteCommittee
}