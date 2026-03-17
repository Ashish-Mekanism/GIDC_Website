import { Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler';
import { CustomRequest } from '../../../types/common';
import { SuccessResponseWithData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import { AdminNocDueService } from '../../../services/admin/noc/adminNocDueService';
import { IAddNocFormUserContributionBody, IUpdateNocFormBody } from '../../../types/requests';

const getNocList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {

            const adminNocDueService= new AdminNocDueService
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const nocList = await adminNocDueService.getNocList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Noc List Success',
            API_RESPONSE_STATUS.SUCCESS,
            nocList
        );
    }
);

const getNocDetails = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
    
        const adminNocDueService= new AdminNocDueService

        const userid = req?.user_id
        const nocId = req.params.id
    

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const circularDetails = await adminNocDueService.getNocDetails(nocId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'NOC Details Success',
            API_RESPONSE_STATUS.SUCCESS,
            circularDetails



        );
    }
);

// const updateNoc = asyncHandler(
//     async (
//         req: CustomRequest<IUpdateNocFormBody>,
//         res: Response
//     ) => {
//         const adminNocDueService= new AdminNocDueService

//         const userid = req?.user_id
//         const nocId = req.params.id
//         const payload = req.body

//         if (!userid) {
//             throw new Error("User ID is required.");
//         }

//         const circularDetails = await adminNocDueService.updateNoc(nocId,payload)

//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.CREATED,
//             'NOC Details Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             circularDetails
//         );
//     }
// );


const updateNoc = asyncHandler(
  async (req: CustomRequest<IUpdateNocFormBody>, res: Response) => {
    const adminNocDueService = new AdminNocDueService();

    const nocId = req.params.id;
    const payload = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
console.log(payload,"payload ");

    if (!nocId) {
      throw new Error("NOC ID is required.");
    }

    const updatedNoc = await adminNocDueService.updateNoc(nocId, payload, files);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "NOC details updated successfully",
      API_RESPONSE_STATUS.SUCCESS,
      updatedNoc
    );
  }
);
const addNocUserContribution = asyncHandler(
    async (
        req: CustomRequest<IAddNocFormUserContributionBody>,
        res: Response
    ) => {      
        const adminNocDueService= new AdminNocDueService

        const userid = req?.user_id
    
        const payload = req.body

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const circularDetails = await adminNocDueService.addNocUserContribution(payload)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'NOC Details Success',
            API_RESPONSE_STATUS.SUCCESS,
            circularDetails
        );
    }
)


const getNocUserContributionList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {

            const adminNocDueService= new AdminNocDueService
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const nocList = await adminNocDueService.getNocUserContributionList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'User Contribution List Success',
            API_RESPONSE_STATUS.SUCCESS,
            nocList
        );
    }
);
const deleteNoc = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
            const adminNocDueService= new AdminNocDueService
            const id = req.params.id

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const nocList = await adminNocDueService.deleteNoc(id)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'NOC Deleted Successfully',
            API_RESPONSE_STATUS.SUCCESS,
            nocList
        )
    }
);

export default{
    getNocList,
    getNocDetails,
    updateNoc,
    addNocUserContribution,getNocUserContributionList,deleteNoc
}