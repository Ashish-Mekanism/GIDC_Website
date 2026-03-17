import { ObjectId } from "mongoose";
import CareerOpportunityModel from "../../../models/CareerOpportunity";
import { JOB_POSTING_STATUS, JOB_STATUS, RESPONSE_CODE } from "../../../utils/constants";
import { toObjectId } from "../../../utils/helper";
import ApiError from "../../../utils/ApiError";

export class AdminCareerOpportunityService {

    async getPostedPendingJobList() {
        const jobList = await CareerOpportunityModel.find({ approveStatus: 0 });
        return jobList;
    }

    async getPostedApprovedJobList() {
        const jobList = await CareerOpportunityModel.find({ approveStatus: 1 });
        return jobList;
    }

    async jobApproveDecline(payload: any, approved_by: ObjectId) {
        const { careerOpportunityId } = payload;
        const action = Number(payload.action);
        const jobId = toObjectId(careerOpportunityId); // assuming you're using ObjectId conversion here

        const job = await CareerOpportunityModel.findById(jobId);
        if (!job) {
            return {
                success: false,
                message: "Career opportunity not found",
            };
        }

        // Only allow APPROVED or DECLINED actions
        if (
            action !== JOB_POSTING_STATUS.APPROVED &&
            action !== JOB_POSTING_STATUS.DECLINED
        ) {
            return {
                success: false,
                message: "Invalid action. Only approve or decline allowed.",
            };
        }

        // If already in that state
        if (job.approveStatus === action) {
            return {
                success: false,
                message: `Career opportunity is already ${action === JOB_POSTING_STATUS.APPROVED ? "approved" : "declined"
                    }.`,
            };
        }

        const updateData: any = {
            approveStatus: action,
        };

        if (approved_by) {
            updateData.approved_by = approved_by;
        }

        await CareerOpportunityModel.findByIdAndUpdate(jobId, { $set: updateData });

        return {
            success: true,
            message: `Career opportunity has been ${action === JOB_POSTING_STATUS.APPROVED ? "approved" : "declined"
                } successfully.`,
        };
    }

    async activeInactiveJobPost(careerOpportunityId: string, action: boolean) {

        const careerOpportunityIdToObjectId = toObjectId(careerOpportunityId);
        const job = await CareerOpportunityModel.findById(careerOpportunityIdToObjectId);

        if (!job) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Job not found",
                {},
                false
            );
        }

        console.log(action, "action received");

        // Determine new status based on the action
        const newStatus = action ? JOB_STATUS.ACTIVE : JOB_STATUS.INACTIVE;

        // If user is already in the desired state, return early
        if (job.active === newStatus) {
            return {
                success: false,
                message: `User account is already ${action ? "active" : "deactivated"}.`,
            };
        }

        // Update user status
        await CareerOpportunityModel.findByIdAndUpdate(careerOpportunityId, { active: newStatus });

        return {
            success: true,
            message: `Job Description has been ${action ? "activated" : "deactivated"} successfully.`,
        };

    }

    async getCareerOpportunityList() {
        const jobList = await CareerOpportunityModel.find({ approveStatus: 1 , active: JOB_STATUS.ACTIVE })
        return jobList;
    }

    async getDeletedJobList(){
        const jobList = await CareerOpportunityModel.find({ isDeleted:true });
        return jobList;
    }



}