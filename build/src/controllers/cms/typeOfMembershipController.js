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
const typeOfMembershipService_1 = require("../../services/cms/typeOfMembershipService");
const createTypeOfMembership = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeOfMembershipService = new typeOfMembershipService_1.TypeOfMembershipService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const typeOfMembershipCreated = yield typeOfMembershipService.createTypeOfMembership(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Type Of Membership Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, typeOfMembershipCreated);
}));
const getTypeOfMembership = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeOfMembershipService = new typeOfMembershipService_1.TypeOfMembershipService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required .");
    }
    const getTypeOfMembershipSuccess = yield typeOfMembershipService.getTypeOfMembership();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Type Of Membership Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getTypeOfMembershipSuccess);
}));
const updateTypeOfMembership = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeOfMembershipService = new typeOfMembershipService_1.TypeOfMembershipService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const typeOfMembershipId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const ourVisionUpdated = yield typeOfMembershipService.updateTypeOfMembership(payload, typeOfMembershipId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Type Of MembershipId Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, ourVisionUpdated);
}));
const deleteTypeOfMembership = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeOfMembershipService = new typeOfMembershipService_1.TypeOfMembershipService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const typeOfMembershipId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const typeOfMembershipSuccess = yield typeOfMembershipService.deleteTypeOfMembership(typeOfMembershipId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, typeOfMembershipSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createTypeOfMembership,
    updateTypeOfMembership,
    getTypeOfMembership,
    deleteTypeOfMembership,
};
