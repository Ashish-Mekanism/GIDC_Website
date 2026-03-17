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
const committeeMemberService_1 = require("../../services/cms/committeeMemberService");
const createCommitteeMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeMemberService = new committeeMemberService_1.CommitteeMemberService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const committeeMemberCreated = yield committeeMemberService.createCommitteeMember(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Committee Member Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, committeeMemberCreated);
}));
const updateCommitteeMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeMemberService = new committeeMemberService_1.CommitteeMemberService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const committeeMemberId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const CommitteeMemberUpdated = yield committeeMemberService.updateCommitteeMember(payload, committeeMemberId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Committee Member Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, CommitteeMemberUpdated);
}));
const getCommitteeMemberList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeMemberService = new committeeMemberService_1.CommitteeMemberService;
    const CommitteeModelId = req === null || req === void 0 ? void 0 : req.params.id;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const CommitteeModelList = yield committeeMemberService.getCommitteeMemberList(CommitteeModelId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Committee Model List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, CommitteeModelList);
}));
const deleteCommitteeMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeMemberService = new committeeMemberService_1.CommitteeMemberService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const committeeMemberId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const committeeMemberSuccess = yield committeeMemberService.deleteCommitteeMember(committeeMemberId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, committeeMemberSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createCommitteeMember,
    updateCommitteeMember,
    getCommitteeMemberList,
    deleteCommitteeMember,
};
