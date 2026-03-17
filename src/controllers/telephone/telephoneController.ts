import { CustomRequest } from "../../types/common";
import { ITelephoneBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../utils/responses";
import { TelephoneService } from "../../services/admin/telephone/telephoneService";

const createTelephone = asyncHandler(
    async (req: CustomRequest<ITelephoneBody>, res: Response) => {
     const telephoneService= new TelephoneService
        const payload = req?.body;
        const userid = req?.user_id
        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const telephoneTitleCreated = await telephoneService.createTelephoneTitle(payload,userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Telephone Title Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            telephoneTitleCreated
        );
    }
);


const updateTelephone = asyncHandler(
  async (req: CustomRequest<ITelephoneBody>, res: Response) => {
   const telephoneService= new TelephoneService
   const telephoneId=req?.params.id;
      const payload = req?.body;
      const userid = req?.user_id
      console.log(payload, 'payload');
      console.log(userid, 'userid');

      if (!userid) {
          throw new Error("User ID is required.");
      }

      const telephoneTitleUpdated = await telephoneService.updateTelephoneTitle(payload,telephoneId)

      SuccessResponseWithData(
          res,
          RESPONSE_CODE.CREATED,
          'Telephone Title Updated Successfully',
          API_RESPONSE_STATUS.SUCCESS,
          telephoneTitleUpdated
      );
  }
);

const getTelephoneList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const telephoneService= new TelephoneService
      
      const telephoneList = await telephoneService.getAllTelephoneList();
  
      SuccessResponseWithData(
        res,
        RESPONSE_CODE.SUCCESS,
        "Telephone List Success",
        API_RESPONSE_STATUS.SUCCESS,
        telephoneList ,
      );
    }
  );

  const deleteTelephone = asyncHandler(

    async (req: CustomRequest, res: Response) => {
      const telephoneService= new TelephoneService

        const userid = req?.user_id
        const telephoneId = req.params.id
        
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }

        const telephoneSuccess = await telephoneService.deleteTelephone(telephoneId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            telephoneSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default {
    createTelephone,
    getTelephoneList,
    updateTelephone,
    deleteTelephone,
}