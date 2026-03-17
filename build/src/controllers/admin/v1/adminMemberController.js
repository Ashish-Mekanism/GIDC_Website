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
const adminMembershipService_1 = require("../../../services/admin/members/adminMembershipService");
const asyncHandler_1 = __importDefault(require("../../../utils/asyncHandler"));
const responses_1 = require("../../../utils/responses");
const constants_1 = require("../../../utils/constants");
const membershipFormService_1 = require("../../../services/user/membershipForm/membershipFormService");
const helper_1 = require("../../../utils/helper");
const User_1 = __importDefault(require("../../../models/User"));
//ADMIN************ADMIN//
const createAMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    // const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { createdBy: req.user_id });
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(payload, " payload");
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
const getMembersApprovedList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membersService = new adminMembershipService_1.MembersService;
    const reqQuery = req.query;
    const getMmebersList = yield membersService.getAllMembersApprovedList(reqQuery);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Members Approved List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getMmebersList);
}));
const getMembersRequestList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membersService = new adminMembershipService_1.MembersService;
    //const reqQuery = req.query
    const getMmebersList = yield membersService.getAllMembersRequestList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Members Request List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getMmebersList);
}));
const getMemberDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService();
    const UserId = req === null || req === void 0 ? void 0 : req.params.id;
    const UserIdToObjectId = (0, helper_1.toObjectId)(UserId);
    console.log(UserId, "userid");
    if (!UserIdToObjectId) {
        throw new Error("User ID is required.");
    }
    const GetMemberDetails = yield membershipFormService.getMemberDetails(UserIdToObjectId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Member Details Success', constants_1.API_RESPONSE_STATUS.SUCCESS, GetMemberDetails);
}));
const updateMembershipForm = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.params.id;
    const UserIdToObjectId = (0, helper_1.toObjectId)(userid);
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(UserIdToObjectId, "UserIdToObjectId");
    console.log(payload, "payload");
    if (!UserIdToObjectId) {
        throw new Error("User ID is required.");
    }
    const MembershipRegistrationformUpdated = yield membershipFormService.updateMembershipForm(payload, UserIdToObjectId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Membership Form Updated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, MembershipRegistrationformUpdated);
}));
const memberActiveInactive = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membersService = new adminMembershipService_1.MembersService();
    const payload = req.body;
    const user_id = payload.userId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield membersService.activeInactiveMember(user_id, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const approveMember = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membersService = new adminMembershipService_1.MembersService();
    const payload = req.body;
    const approved_by = req.user_id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(payload, 'paylooadd');
    if (!approved_by) {
        throw new Error("User ID is required to become a member.");
    }
    const approvalStatus = yield membersService.memberApproval(payload, file, approved_by);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    getMembersApprovedList,
    getMemberDetails,
    updateMembershipForm,
    memberActiveInactive,
    approveMember,
    createAMember,
    getMembersRequestList,
};
