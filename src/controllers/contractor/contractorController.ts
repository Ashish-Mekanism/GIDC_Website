import ServiceCategory from "../../models/ServiceCategory";
import { ContractorService } from "../../services/admin/contractor/contractorService";
import { ServiceCategoryService } from "../../services/admin/serviceCategory/serviceCategoryService";
import { CustomRequest } from "../../types/common";
import { IContractorBody, IPaginationQuery, IServiceCategoryBody } from "../../types/requests";
import ApiError from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

const createContractor = asyncHandler(
  async (req: CustomRequest<IContractorBody>, res: Response) => {
const contractorService= new ContractorService
        const payload = req.body;
        const userid = req?.user_id
        console.log(payload,'payload');
        
        if (!userid) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "User ID is required.",
                {},
                false
            );
        
        }

        // if (!payload.ServiceId) {
        //     throw new ApiError(
        //         RESPONSE_CODE.NOT_FOUND,
        //         "ServiceId is required.",
        //         {},
        //         false
        //     );
           
        //   }
      
          // Directly check if the serviceId exists and is active in the database
          const serviceCategory = await ServiceCategory.findOne({ _id: payload.ServiceIds, active: true });
      
          if (!serviceCategory) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Invalid ServiceId: Service category not found or inactive.",
                {},
                false
            );
          }
         const ContractorCreated = await contractorService.createContractor(payload)
     
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Contractor Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            ContractorCreated
        );
    }
);

const updateContractor = asyncHandler(
    async (req: CustomRequest<IContractorBody>, res: Response) => {
        const contractorService= new ContractorService
          const payload = req.body;
          const userid = req?.user_id
          const ControlerId= req.params.id;
  
          if (!userid) {
              throw new Error("User ID is required.");
          }
  
          if (!ControlerId) {
            throw new Error("Service Category Id required.");
        }

           const ContractorUpdated = await contractorService.updateContractor(ControlerId,payload)
       
          SuccessResponseWithData(
              res,
              RESPONSE_CODE.CREATED,
              ' Contractor Updated Success',
              API_RESPONSE_STATUS.SUCCESS,
              ContractorUpdated
          );
      }
  );

//   const getContractorList = asyncHandler(
//     async (
//         req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
//         res: Response
//     ) => {
//         const contractorService= new ContractorService
//         const reqQuery = req.query

//         const getMmebersList = await contractorService.getPaginationContractorList(reqQuery)

//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.SUCCESS,
//             'Contractor List Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             getMmebersList

//         );
//     }
// );


const getContractorList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
      const contractorService = new ContractorService();
      
      const contractorList = await contractorService.getAllContractors();
  
      SuccessResponseWithData(
        res,
        RESPONSE_CODE.SUCCESS,
        "Contractor List Success",
        API_RESPONSE_STATUS.SUCCESS,
         contractorList ,
      );
    }
  );
  
export default{
    getContractorList,
    createContractor,
    updateContractor,
   
}