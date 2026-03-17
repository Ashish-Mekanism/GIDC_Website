import { ComplaintFormService } from "../../services/user/complaintForm/complaintFormService";
import { CustomRequest } from "../../types/common";
import { IComplaint } from "../../types/models";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { IPaginationQuery } from "../../types/requests";
import { ParamsDictionary } from 'express-serve-static-core';
import { ServiceCategoryService } from "../../services/admin/serviceCategory/serviceCategoryService";
const createComplaint = asyncHandler(

    async (req: CustomRequest<IComplaint>, res: Response) => {
   const complaintFormService = new ComplaintFormService
        const payload = req.body;
        const userid = req?.user_id

       const files = req?.files
        console.log(payload, " payload");
        console.log(userid,'userid')
     

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

         const ComplaintRegistered = await complaintFormService.createComplaint(payload, userid,files )


        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Complaint Register Success ',
            API_RESPONSE_STATUS.SUCCESS,
            ComplaintRegistered
        );
    }
);



// const getServiceCategoryList = asyncHandler(
//     async (
//         req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
//         res: Response
//     ) => {
//         const serviceCategoryService = new ServiceCategoryService
//         const reqQuery = req.query

//         const getMmebersList = await serviceCategoryService.getPaginationServiceCategoryList(reqQuery)

//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.SUCCESS,
//             'Members List Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             getMmebersList

//         );
//     }
// );

const getServiceCategoryList = asyncHandler(
    async (
        req: CustomRequest<Request>, // Changed from IPaginationQuery
        res: Response
    ) => {
        const serviceCategoryService = new ServiceCategoryService();

        const serviceCategoryList = await serviceCategoryService.getServiceCategoryList();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Service Category List Success', // Fixed the message
            API_RESPONSE_STATUS.SUCCESS,
            serviceCategoryList
        );
    }
);
export default {
    createComplaint,
    getServiceCategoryList,
}