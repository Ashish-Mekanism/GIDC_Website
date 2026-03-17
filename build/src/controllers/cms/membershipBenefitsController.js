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
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const membershipBenefitsService_1 = require("../../services/cms/membershipBenefitsService");
const createMebershipBenefits = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipBenefitsService = new membershipBenefitsService_1.MembershipBenefitsService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const mebershipBenefitsCreated = yield membershipBenefitsService.createMebershipBenefits(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Mebership Benefits Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, mebershipBenefitsCreated);
}));
const getMebershipBenefits = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipBenefitsService = new membershipBenefitsService_1.MembershipBenefitsService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required .");
    }
    const getMebershipBenefitsSuccess = yield membershipBenefitsService.getMebershipBenefits();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Mebership Benefits Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getMebershipBenefitsSuccess);
}));
const updateMebershipBenefits = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipBenefitsService = new membershipBenefitsService_1.MembershipBenefitsService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const mebershipBenefitsId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const mebershipBenefitsUpdated = yield membershipBenefitsService.updateMebershipBenefits(payload, mebershipBenefitsId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Mebership Benefits Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, mebershipBenefitsUpdated);
}));
exports.default = {
    createMebershipBenefits,
    getMebershipBenefits,
    updateMebershipBenefits,
};
