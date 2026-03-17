import { WebDirectoryService } from "../../services/user/webDirectory/webDirectortyService";
import { CustomRequest } from "../../types/common";
import { IUpdateWebDirectoryBody, IWebDirectoryBody } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";

const createWebDirectory =  asyncHandler(

    async(req: CustomRequest<IWebDirectoryBody>, res: Response) => {
        const webDirectortyService= new WebDirectoryService
        const payload = req.body;
        const userid = req?.user_id

        const files = req?.files
        console.log(payload, " payload");
        console.log(files, " imagess");


        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const webDirectoryCreatted = await webDirectortyService.createWebDirectory(payload, userid, files)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Web Directory Create Success ',
            API_RESPONSE_STATUS.SUCCESS,
            webDirectoryCreatted
        );
    }
);
//OPEN API
const getWebDirectory =  asyncHandler(

    async(req: CustomRequest, res: Response) => {
        const webDirectortyService= new WebDirectoryService
        
        const userid = req?.user_id
      const webDirectoryId= req?.params.id
   
  
        const webDirectoryDetails = await webDirectortyService.getWebDirectory(webDirectoryId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Web Directory Detail Success ',
            API_RESPONSE_STATUS.SUCCESS,
            webDirectoryDetails
        );
    }
);

//WITH AUTH 
const getWebDirectoryWithAuth =  asyncHandler(

  async(req: CustomRequest, res: Response) => {
      const webDirectortyService= new WebDirectoryService
      
      const userid = req?.user_id
  //  const webDirectoryId= req?.params.id
 
  if (!userid) {
    throw new Error("User ID is required to update the directory.");
  }

      const webDirectoryDetails = await webDirectortyService.getWebDirectory(userid)

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
      const webDirectoryService = new WebDirectoryService();
  
      const payload = req.body 
  
      const userId = req?.user_id;
      const files = req?.files;
      const webDirectoryId = req?.params.id;

      if (!userId) {
        throw new Error("User ID is required to update the directory.");
      }
  
      const webDirectoryUpdated = await webDirectoryService.updateWebDirectory(
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
  
  








export default{
    createWebDirectory,
    getWebDirectory,
    updateWebDirectory,
    getWebDirectoryWithAuth,
}
