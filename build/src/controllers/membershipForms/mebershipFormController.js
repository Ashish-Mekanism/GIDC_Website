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
const membershipFormService_1 = require("../../services/user/membershipForm/membershipFormService");
const User_1 = __importDefault(require("../../models/User"));
const becomeAMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const MembershipRegistrationformCreated = yield membershipFormService.becomeAMember(payload, userid, files);
    const user = yield User_1.default.findById(userid);
    if (user) {
        user.approval_status = constants_1.MEMBER_APPROVAL_STATUS.PENDING;
        yield user.save(); // Save the changes 
    }
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Membership Register Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, MembershipRegistrationformCreated);
}));
const updateMembershipForm = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(payload, "payloadpayload");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const MembershipRegistrationformUpdated = yield membershipFormService.updateMembershipForm(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Membership Form Updated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, MembershipRegistrationformUpdated);
}));
const getMemberDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    const UserId = req.user_id;
    console.log(UserId, "userid");
    if (!UserId) {
        throw new Error("User ID is required.");
    }
    const GetMemberDetails = yield membershipFormService.getMemberDetails(UserId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Member Details Success', constants_1.API_RESPONSE_STATUS.SUCCESS, GetMemberDetails);
}));
exports.default = {
    becomeAMember,
    getMemberDetails,
    updateMembershipForm,
};
