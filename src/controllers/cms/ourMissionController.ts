import { CustomRequest } from "../../types/common";
import {
  IOurMissionBody,

} from "../../types/requests";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { OurVisionService } from "../../services/cms/ourVisionService";
import { OurMissionService } from "../../services/cms/ourMissionService";

const createOurMission = asyncHandler(
  async (req: CustomRequest<IOurMissionBody>, res: Response) => {
    const ourMissionService = new OurMissionService();
    const payload = req?.body;
    const userid = req?.user_id;

    console.log(payload, "payload");
    console.log(userid, "userid");

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const ourMissionCreated = await ourMissionService.createOurMission(
      payload,
      userid
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Our Mission Created Success",
      API_RESPONSE_STATUS.SUCCESS,
      ourMissionCreated
    );
  }
);

const getOurMission = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const ourMissionService = new OurMissionService();

    const userid = req?.user_id;
    console.log(userid, " userid");

    if (!userid) {
      throw new Error("User ID is required .");
    }

    const getOurMissionSuccess = await ourMissionService.getOurMission();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Our Mission Success",
      API_RESPONSE_STATUS.SUCCESS,
      getOurMissionSuccess
    );
  }
);

const updateOurMission = asyncHandler(
  async (req: CustomRequest<IOurMissionBody>, res: Response) => {
    const ourMissionService = new OurMissionService();
    const payload = req.body;
    const userid = req?.user_id;
    const ourMissionId = req?.params.id;

    if (!userid) {
      throw new Error("User ID is required to update a member.");
    }

    const ourMissionUpdated = await ourMissionService.updateOurMission(
      payload,
      ourMissionId
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Our Mission Updated Success ",
      API_RESPONSE_STATUS.SUCCESS,
      ourMissionUpdated
    );
  }
);
export default {
  createOurMission,
  updateOurMission,
  getOurMission,
};
