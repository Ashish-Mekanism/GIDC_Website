import { Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler';
import { CustomRequest } from '../../../types/common';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import { AdminWebDirectoryService } from '../../../services/admin/webDirectory/adminWebDirectoryService';
import { IActiveInactiveWebDirectory, IUpdateWebDirectoryBody, IWebDirectoryBody } from '../../../types/requests';
import { WebDirectoryService } from '../../../services/user/webDirectory/webDirectortyService';
import { toObjectId } from '../../../utils/helper';


const adminCreateWebDirectory =  asyncHandler(

    async(req: CustomRequest<IWebDirectoryBody>, res: Response) => {
        const adminWebDirectoryService = new AdminWebDirectoryService
        const payload = req.body;
        const userid = req?.user_id

        const files = req?.files
        console.log(payload, " payload");
        console.log(files, " imagess");


        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const webDirectoryCreatted = await adminWebDirectoryService.adminCreateWebDirectory(payload, userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Web Directory Create Success ',
            API_RESPONSE_STATUS.SUCCESS,
            webDirectoryCreatted
        );
    }
);


const getAdminWebDirectoryList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {

        const adminWebDirectoryService = new AdminWebDirectoryService
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const nocList = await adminWebDirectoryService.getWebDirectoryList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Web Directory List Success',
            API_RESPONSE_STATUS.SUCCESS,
            nocList
        );
    }
);

const getWebDirectoryById = asyncHandler(
    async(req: CustomRequest, res: Response) => {
    
        const adminWebDirectoryService = new AdminWebDirectoryService
        const webDirectoryId = req?.params.id;
        
        if (!webDirectoryId) {
            throw new Error("User ID is required.");
        }

        // Get web directory by ID (no need to convert to ObjectId here)
        const webDirectoryDetails = await adminWebDirectoryService.getWebDirectoryById(webDirectoryId);

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Web Directory Detail Success ',
            API_RESPONSE_STATUS.SUCCESS,
            webDirectoryDetails
        );
    }
);

const updateWebDirectory = asyncHandler(
    async (req: CustomRequest<IUpdateWebDirectoryBody>, res: Response) => {
        const adminWebDirectoryService = new AdminWebDirectoryService
  
      const payload = req.body 
  
      const userId = req?.user_id;
      const files = req?.files;
      const webDirectoryId = req?.params.id;

      if (!userId) {
        throw new Error("User ID is required to update the directory.");
      }
  
      const webDirectoryUpdated = await adminWebDirectoryService.updateWebDirectory(
        payload ,
        webDirectoryId,
        files
      );
  
      SuccessResponseWithData(
        res,
        RESPONSE_CODE.CREATED,
        "Web Directory Update Success",
        API_RESPONSE_STATUS.SUCCESS,
        webDirectoryUpdated
      );
    }
  );

  const webDirectoryActiveInactive = asyncHandler(
    async (req: CustomRequest<IActiveInactiveWebDirectory>, res: Response) => {
        const adminWebDirectoryService = new AdminWebDirectoryService
      const payload = req.body;
      const webDirectoryId = payload.webDirectoryId;
      const action = payload.action;
  
      console.log(payload,'paylooadd');
      
      const Status = await adminWebDirectoryService.activeInactiveWebDirectory(
        webDirectoryId,
        action
      );
  
      SuccessResponseWithoutData(
        res,
        RESPONSE_CODE.SUCCESS,
        Status.message, // Use the message from the `approvalStatus` object
        API_RESPONSE_STATUS.SUCCESS
      );
    }
  );
export default {
    adminCreateWebDirectory,
    getAdminWebDirectoryList,
    updateWebDirectory,
    getWebDirectoryById,
    webDirectoryActiveInactive,
}