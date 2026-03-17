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
const asyncHandler_1 = __importDefault(require("../../../utils/asyncHandler"));
const responses_1 = require("../../../utils/responses");
const constants_1 = require("../../../utils/constants");
const adminCareerOpportunityService_1 = require("../../../services/admin/careerOpportunity/adminCareerOpportunityService");
const getPostedPendingJobList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const jobList = yield adminCareerOpportunityService.getPostedPendingJobList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Job List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, jobList);
}));
const getPostedApprovedJobList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const jobList = yield adminCareerOpportunityService.getPostedApprovedJobList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Job List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, jobList);
}));
const jobApproveDecline = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService();
    const payload = req.body;
    const approved_by = req.user_id;
    console.log(payload, 'paylooadd');
    if (!approved_by) {
        throw new Error("User ID is required to become a member.");
    }
    const approvalStatus = yield adminCareerOpportunityService.jobApproveDecline(payload, approved_by);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const activeInactiveJobPost = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService();
    const payload = req.body;
    const careerOpportunityId = payload.careerOpportunityId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield adminCareerOpportunityService.activeInactiveJobPost(careerOpportunityId, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const getDeletedJobList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const jobList = yield adminCareerOpportunityService.getDeletedJobList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Deleted Job List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, jobList);
}));
exports.default = {
    getPostedPendingJobList,
    getPostedApprovedJobList,
    jobApproveDecline,
    activeInactiveJobPost,
    getDeletedJobList,
};
