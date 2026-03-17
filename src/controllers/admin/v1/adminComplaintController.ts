import { CustomRequest } from "../../../types/common";
import asyncHandler from "../../../utils/asyncHandler";
import { Response } from "express";
import {
  SuccessResponseWithData,
  SuccessResponseWithoutData,
} from "../../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../../utils/constants";
import { AdminComplaintService } from "../../../services/admin/complaint/AdminComplaintService";
import {
  IAssignContractor,
  IComplaintBody,
  IComplaintStatusBody,
} from "../../../types/requests";
import { IComplaint } from "../../../types/models";
import { ComplaintFormService } from "../../../services/user/complaintForm/complaintFormService";

const createComplaintByAdmin = asyncHandler(
  async (req: CustomRequest<IComplaintBody>, res: Response) => {
    const complaintFormService = new ComplaintFormService();
    const payload = req.body;
    const userid = req?.user_id;
    const files = req?.files;
    console.log(userid, " userid");
    console.log(payload, " payload");
    
    if (!userid) {
      console.log("no user id");
      throw new Error("User ID is required.");
    }
    const ComplaintRegistered =
      await complaintFormService.createComplaintByAdmin(payload, userid, files);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      "Complaint Register Success ",
      API_RESPONSE_STATUS.SUCCESS,
      ComplaintRegistered
    );
  }
);

const getComplaintFormList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const userid = req?.user_id;
    const serviceCategoryKey = req?.query?.key as string;
    const complaintStatus = req?.query?.status as string;
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    if (!userid) {
      throw new Error("User ID is required.");
    }

    const complaintList = await adminComplaintService.getComplaintList(
      serviceCategoryKey,
      complaintStatus,
      { fromDate, toDate }
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Complaint List Success",
      API_RESPONSE_STATUS.SUCCESS,
      complaintList
    );
  }
);

const assignContractor = asyncHandler(
  async (req: CustomRequest<IAssignContractor>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const payload = req?.body;
    const complaintId = req?.params.id;

    const contractorAssign = await adminComplaintService.assignContractor(
      complaintId,
      payload
    );

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      contractorAssign.message,
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const updateComplaintStatus = asyncHandler(
  async (req: CustomRequest<IComplaintStatusBody>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const payload = req.body;
    const complaintId = payload.complaintId;
    const status = +payload.status as number;

    console.log(payload, "paylooadd");

    const updatedStatus = await adminComplaintService.updateComplaintStatus(
      complaintId,
      status
    );

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      updatedStatus.message,
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);
const deleteComplaint = asyncHandler(
  async (req: CustomRequest<IComplaintStatusBody>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const complaintId = req?.params.id;
    await adminComplaintService.deleteComplaint(complaintId);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Deleted Complaint Successfully",
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const getComplaintCompletedFormList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const userid = req?.user_id;
    console.log(userid, " userid");

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const complaintList =
      await adminComplaintService.getComplaintCompletedList();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Complaint Completed List Success",
      API_RESPONSE_STATUS.SUCCESS,
      complaintList
    );
  }
);

const getComplaintForm = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminComplaintService = new AdminComplaintService();
    const userid = req?.user_id;
    const ComplaintId = req?.params.id;

    if (!userid) {
      throw new Error("User ID is required.");
    }

    const complaintList =
      await adminComplaintService.getComplaintForm(ComplaintId);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Complaint Completed Details Success",
      API_RESPONSE_STATUS.SUCCESS,
      complaintList
    );
  }
);

export default {
  getComplaintFormList,
  updateComplaintStatus,
  assignContractor,
  getComplaintCompletedFormList,
  getComplaintForm,
  deleteComplaint,
  createComplaintByAdmin,
};
