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
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const responses_1 = require("../../utils/responses");
const constants_1 = require("../../utils/constants");
const sponsorshipService_1 = require("../../services/sponsorshipService");
const createSponsorship = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const CreatedBy = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    // if (!userId) {
    //     throw new Error("User ID is required.");
    // }
    const sponsorshipSuccess = yield sponsorshipService.createSponsorship(payload, file, CreatedBy);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Sponsorship submitted Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, sponsorshipSuccess);
}));
const updateSponsorship = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const payload = req.body;
    const sponsorshipId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(payload, " payload");
    console.log(sponsorshipId, " sponsorshipId");
    const sponsorshipUpdated = yield sponsorshipService.updateSponsorship(payload, sponsorshipId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Sponsorship Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, sponsorshipUpdated);
}));
const sponsorshipActiveInactive = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const payload = req.body;
    const sponsorshipId = payload.sponsorshipId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield sponsorshipService.activeInactiveSponsorship(sponsorshipId, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const approveSponsorship = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const payload = req.body;
    const sponsorship_Id = payload.sponsorshipId;
    const action = payload.action;
    const amount = payload.amount;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield sponsorshipService.sponsorshipApproval(sponsorship_Id, action, amount);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const getSponsorshipRequestList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const sponsorshipRequestList = yield sponsorshipService.getSponsorshipRequestList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sponsorship Request List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, sponsorshipRequestList);
}));
const getSponsorshipApprovedList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const sponsorshipApprovedtList = yield sponsorshipService.getSponsorshipApprovedList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sponsorship Approved List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, sponsorshipApprovedtList);
}));
exports.default = {
    createSponsorship,
    updateSponsorship,
    sponsorshipActiveInactive,
    approveSponsorship,
    getSponsorshipRequestList,
    getSponsorshipApprovedList,
};
