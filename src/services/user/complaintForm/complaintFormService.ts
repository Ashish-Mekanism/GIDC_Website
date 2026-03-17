import { ObjectId } from "mongoose";
import { IComplaint } from "../../../types/models";
import { MembershipFormRepository } from "../../../repository/membershipFormRepository";
import ApiError from "../../../utils/ApiError";
import {
  COMPLAINT_STATUS,
  RESPONSE_CODE,
  ServiceRequestEmailKeys,
} from "../../../utils/constants";
import ComplaintModel from "../../../models/Complaint";
import User from "../../../models/User";

import MembershipModel from "../../../models/MembersRegistrastionForm";
import ServiceCategory from "../../../models/ServiceCategory";
import { SendEmailTemplateMail } from "../../emailService";
import { toObjectId } from "../../../utils/helper";
import { IComplaintBody } from "../../../types/requests";

export class ComplaintFormService {
  membershipFormRepository = new MembershipFormRepository();
  sendEmailTemplateMail = new SendEmailTemplateMail();

  async createComplaint(
    payload: Partial<IComplaint>,
    user_id: ObjectId,
    files: any
  ): Promise<IComplaint> {
    const photoFilenames =
      files && files.length > 0
        ? files.map((file: { filename: any }) => file.filename)
        : [];

    //Check userid exist
    const UserExist = await User.findById(user_id);
    if (!UserExist) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        "User does not exist",
        {},
        false
      );
    }

    if (!payload?.waterConnectionNo) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        "Water Connection Number is required",
        {},
        false
      );
    }
    const membershipExist = await MembershipModel.findOne({ userId: user_id });
    const serviceCategory = await ServiceCategory.findById(
      payload.serviceCategory
    );

    const updatedPayload = {
      ...payload,
      userId: user_id,
      complaint_photo: photoFilenames,
      status: COMPLAINT_STATUS.PENDING,
      membershipNo: membershipExist?.membership_Id,
      ServiceCategoryName: serviceCategory?.ServiceCategoryName,
      isCreatedByAdmin: false,
    };

    const complaint = new ComplaintModel(updatedPayload);

    const raisedComplaint = await complaint.save();

    await this.sendEmailTemplateMail.sendServiceRequestEmailToUser(
      raisedComplaint?._id?.toString(),
      ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER
    );
    await this.sendEmailTemplateMail.sendServiceRequestEmailToAdminAndContractors(
      raisedComplaint?._id?.toString()
    );
    return raisedComplaint;
  }

  async createComplaintByAdmin(
    payload: Partial<IComplaintBody>,
    adminId: ObjectId,
    files: any
  ): Promise<IComplaintBody> {
  
    const photoFilenames =
      files && files.length > 0
        ? files.map((file: { filename: any }) => file.filename)
        : [];

    if (!payload?.waterConnectionNo) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        "Water Connection Number is required",
        {},
        false
      );
    }
    // const membershipExist = await MembershipModel.findOne({ userId: user_id });
    const serviceCategory = await ServiceCategory.findById(
      payload.serviceCategory
    );

    const updatedPayload = {
      ...payload,
      complaint_photo: photoFilenames,
      status: COMPLAINT_STATUS.PENDING,
      membershipNo: payload?.membershipNo,
      ServiceCategoryName: serviceCategory?.ServiceCategoryName,
      isCreatedByAdmin: true,
      isExported:true,
      createdByAdminId: adminId,
    };
    console.log(updatedPayload,'updatedPayload')

    const complaint = new ComplaintModel(updatedPayload);

    const raisedComplaint = await complaint.save();

    await this.sendEmailTemplateMail.sendServiceRequestEmailToUser(
      raisedComplaint?._id?.toString(),
      ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER
    );
    await this.sendEmailTemplateMail.sendServiceRequestEmailToAdminAndContractors(
      raisedComplaint?._id?.toString()
    );
    return raisedComplaint;
  }
}
