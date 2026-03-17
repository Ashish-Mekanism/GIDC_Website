import { ServiceCategoryService } from "../../services/admin/serviceCategory/serviceCategoryService";
import { CustomRequest } from "../../types/common";
import { IServiceCategoryBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from 'express';


const createServiceCategory = asyncHandler(
    async (req: CustomRequest<IServiceCategoryBody>, res: Response) => {
        const serviceCategoryService = new ServiceCategoryService
        const payload = req.body;
        const userid = req?.user_id
        console.log(payload, 'payload');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const serviceCategoryCreated = await serviceCategoryService.createServiceCategory(payload)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Service Category Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            serviceCategoryCreated
        );
    }
);

const updateServiceCategory = asyncHandler(
    async (req: CustomRequest<IServiceCategoryBody>, res: Response) => {
        const serviceCategoryService = new ServiceCategoryService
        const payload = req.body;
        const userid = req?.user_id
        const serviceCategoryId = req.params.id;

        if (!userid) {
            throw new Error("User ID is required.");
        }

        if (!serviceCategoryId) {
            throw new Error("Service Category Id required.");
        }

        const serviceCategoryUpdated = await serviceCategoryService.updateServiceCategory(serviceCategoryId, payload)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Service Category Updated Success',
            API_RESPONSE_STATUS.SUCCESS,
            serviceCategoryUpdated
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
    updateServiceCategory,
    getServiceCategoryList,
    createServiceCategory,
}