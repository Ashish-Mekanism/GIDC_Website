import { CustomRequest } from "../../types/common";
import {
    IMaximizingVisibilityBody,
    IRequiredDocumentsBody,
} from "../../types/requests";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { RequiredDocumentsService } from "../../services/cms/requiredDocumentsService";

const createRequiredDocuments = asyncHandler(
  async (req: CustomRequest<IRequiredDocumentsBody>, res: Response) => {
    const requiredDocumentsService = new RequiredDocumentsService;
    const payload = req?.body;
    const userid = req?.user_id;

    console.log(payload, "payload");
    console.log(userid, "userid");

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const maximizingVisibilityCreated = await requiredDocumentsService.createRequiredDocuments(
      payload,
      userid
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Required Documents Created Success",
      API_RESPONSE_STATUS.SUCCESS,
      maximizingVisibilityCreated
    );
  }
);

const getRequiredDocuments = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const requiredDocumentsService = new RequiredDocumentsService;

    const userid = req?.user_id;
    console.log(userid, " userid");

    if (!userid) {
      throw new Error("User ID is required .");
    }

    const getMaximizingVisibilitySuccess = await requiredDocumentsService.getRequiredDocuments();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Required Documents Success",
      API_RESPONSE_STATUS.SUCCESS,
      getMaximizingVisibilitySuccess
    );
  }
);

const updateRequiredDocuments = asyncHandler(
  async (req: CustomRequest<IRequiredDocumentsBody>, res: Response) => {
    const requiredDocumentsService = new RequiredDocumentsService;
    const payload = req.body;
    const userid = req?.user_id;
    const requiredDocumentsId = req?.params.id;

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const maximizingVisibilityUpdated = await requiredDocumentsService.updateRequiredDocuments(
      payload,
      requiredDocumentsId
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Required Documents Updated Success ",
      API_RESPONSE_STATUS.SUCCESS,
      maximizingVisibilityUpdated
    );
  }
);
export default {
    createRequiredDocuments,
    updateRequiredDocuments,
    getRequiredDocuments,
};
