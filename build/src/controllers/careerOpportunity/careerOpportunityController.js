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
const careerOpportunityService_1 = require("../../services/user/careerOpportunity/careerOpportunityService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const responses_1 = require("../../utils/responses");
const constants_1 = require("../../utils/constants");
const applyJobService_1 = require("../../services/admin/applyJob/applyJobService");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const careerOpportunity = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const careerOpportunityService = new careerOpportunityService_1.CareerOpportunityService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const careerOpportunityCreated = yield careerOpportunityService.createCareerOpportunity(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Career Opportunity Created Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, careerOpportunityCreated);
}));
const getPostedJobList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const careerOpportunityService = new careerOpportunityService_1.CareerOpportunityService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const jobList = yield careerOpportunityService.getPostedJobList(userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Job List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, jobList);
}));
const updateCareerOpportunity = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const careerOpportunityService = new careerOpportunityService_1.CareerOpportunityService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const careerOpportunityId = req.params.id;
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const careerOpportunityCreated = yield careerOpportunityService.updateCareerOpportunity(payload, userid, careerOpportunityId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Career Opportunity Created Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, careerOpportunityCreated);
}));
const getAppliedParticularJobSeekerList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminApplyJobService = new applyJobService_1.AdminApplyJobService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const careerOpportunityId = req === null || req === void 0 ? void 0 : req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const jobList = yield adminApplyJobService.getAppliedParticularJobSeekerList(careerOpportunityId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Seeker List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, jobList);
}));
const deleteCareerOpportunity = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const careerOpportunityService = new careerOpportunityService_1.CareerOpportunityService();
    const userId = req === null || req === void 0 ? void 0 : req.user_id;
    const careerOpportunityId = req.params.id;
    if (!userId) {
        throw new Error("User ID is required.");
    }
    if (!careerOpportunityId) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Career opportunity ID is required.");
    }
    const result = yield careerOpportunityService.deleteCareerOpportunity(careerOpportunityId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, result.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    careerOpportunity,
    getPostedJobList,
    updateCareerOpportunity,
    getAppliedParticularJobSeekerList,
    deleteCareerOpportunity
};
