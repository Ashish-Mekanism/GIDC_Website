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
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const committeeService_1 = require("../../services/cms/committeeService");
const createCommittee = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeService = new committeeService_1.CommitteeService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const CommitteeCreated = yield committeeService.createCommittee(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Committee Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, CommitteeCreated);
}));
const updateCommittee = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeService = new committeeService_1.CommitteeService;
    const CommitteeId = req === null || req === void 0 ? void 0 : req.params.id;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const committeeUpdated = yield committeeService.updateCommittee(payload, CommitteeId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Committee Updated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, committeeUpdated);
}));
const getCommitteeList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeService = new committeeService_1.CommitteeService;
    const committeeList = yield committeeService.getCommitteeList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "CommitteeList List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, committeeList);
}));
const deleteCommittee = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeService = new committeeService_1.CommitteeService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const CommitteeId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const committeeSuccess = yield committeeService.deleteCommittee(CommitteeId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, committeeSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createCommittee,
    updateCommittee,
    getCommitteeList,
    deleteCommittee
};
