"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCareerOpportunityService = void 0;
const CareerOpportunity_1 = __importDefault(require("../../../models/CareerOpportunity"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
class AdminCareerOpportunityService {
    getPostedPendingJobList() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobList = yield CareerOpportunity_1.default.find({ approveStatus: 0 });
            return jobList;
        });
    }
    getPostedApprovedJobList() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobList = yield CareerOpportunity_1.default.find({ approveStatus: 1 });
            return jobList;
        });
    }
    jobApproveDecline(payload, approved_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const { careerOpportunityId } = payload;
            const action = Number(payload.action);
            const jobId = (0, helper_1.toObjectId)(careerOpportunityId); // assuming you're using ObjectId conversion here
            const job = yield CareerOpportunity_1.default.findById(jobId);
            if (!job) {
                return {
                    success: false,
                    message: "Career opportunity not found",
                };
            }
            // Only allow APPROVED or DECLINED actions
            if (action !== constants_1.JOB_POSTING_STATUS.APPROVED &&
                action !== constants_1.JOB_POSTING_STATUS.DECLINED) {
                return {
                    success: false,
                    message: "Invalid action. Only approve or decline allowed.",
                };
            }
            // If already in that state
            if (job.approveStatus === action) {
                return {
                    success: false,
                    message: `Career opportunity is already ${action === constants_1.JOB_POSTING_STATUS.APPROVED ? "approved" : "declined"}.`,
                };
            }
            const updateData = {
                approveStatus: action,
            };
            if (approved_by) {
                updateData.approved_by = approved_by;
            }
            yield CareerOpportunity_1.default.findByIdAndUpdate(jobId, { $set: updateData });
            return {
                success: true,
                message: `Career opportunity has been ${action === constants_1.JOB_POSTING_STATUS.APPROVED ? "approved" : "declined"} successfully.`,
            };
        });
    }
    activeInactiveJobPost(careerOpportunityId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const careerOpportunityIdToObjectId = (0, helper_1.toObjectId)(careerOpportunityId);
            const job = yield CareerOpportunity_1.default.findById(careerOpportunityIdToObjectId);
            if (!job) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Job not found", {}, false);
            }
            console.log(action, "action received");
            // Determine new status based on the action
            const newStatus = action ? constants_1.JOB_STATUS.ACTIVE : constants_1.JOB_STATUS.INACTIVE;
            // If user is already in the desired state, return early
            if (job.active === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? "active" : "deactivated"}.`,
                };
            }
            // Update user status
            yield CareerOpportunity_1.default.findByIdAndUpdate(careerOpportunityId, { active: newStatus });
            return {
                success: true,
                message: `Job Description has been ${action ? "activated" : "deactivated"} successfully.`,
            };
        });
    }
    getCareerOpportunityList() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobList = yield CareerOpportunity_1.default.find({ approveStatus: 1, active: constants_1.JOB_STATUS.ACTIVE });
            return jobList;
        });
    }
    getDeletedJobList() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobList = yield CareerOpportunity_1.default.find({ isDeleted: true });
            return jobList;
        });
    }
}
exports.AdminCareerOpportunityService = AdminCareerOpportunityService;
