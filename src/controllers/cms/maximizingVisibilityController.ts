import { CustomRequest } from "../../types/common";
import {
    IMaximizingVisibilityBody,
  IOurMissionBody,
} from "../../types/requests";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { OurVisionService } from "../../services/cms/ourVisionService";
import { OurMissionService } from "../../services/cms/ourMissionService";
import { MaximizingVisibilityService } from "../../services/cms/maximizingVisibilityService";

const createMaximizingVisibility = asyncHandler(
  async (req: CustomRequest<IMaximizingVisibilityBody>, res: Response) => {
    const maximizingVisibilityService = new MaximizingVisibilityService();
    const payload = req?.body;
    const userid = req?.user_id;

    console.log(payload, "payload");
    console.log(userid, "userid");

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const maximizingVisibilityCreated = await maximizingVisibilityService.createMaximizingVisibility(
      payload,
      userid
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Maximizing Visibility Created Success",
      API_RESPONSE_STATUS.SUCCESS,
      maximizingVisibilityCreated
    );
  }
);

const getMaximizingVisibility = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const maximizingVisibilityService = new MaximizingVisibilityService();

    const userid = req?.user_id;
    console.log(userid, " userid");

    if (!userid) {
      throw new Error("User ID is required .");
    }

    const getMaximizingVisibilitySuccess = await maximizingVisibilityService.getMaximizingVisibility();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Maximizing Visibility Success",
      API_RESPONSE_STATUS.SUCCESS,
      getMaximizingVisibilitySuccess
    );
  }
);

const updateMaximizingVisibility = asyncHandler(
  async (req: CustomRequest<IMaximizingVisibilityBody>, res: Response) => {
    const maximizingVisibilityService = new MaximizingVisibilityService();
    const payload = req.body;
    const userid = req?.user_id;
    const maximizingVisibilityId = req?.params.id;

    if (!userid) {
      throw new Error("User ID is required to update a member.");
    }

    const maximizingVisibilityUpdated = await maximizingVisibilityService.updateMaximizingVisibility(
      payload,
      maximizingVisibilityId
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Maximizing Visibility Updated Success ",
      API_RESPONSE_STATUS.SUCCESS,
      maximizingVisibilityUpdated
    );
  }
);
export default {
    createMaximizingVisibility,
    updateMaximizingVisibility,
    getMaximizingVisibility,
};
