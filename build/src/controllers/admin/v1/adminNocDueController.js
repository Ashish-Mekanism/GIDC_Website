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
const adminNocDueService_1 = require("../../../services/admin/noc/adminNocDueService");
const getNocList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const nocList = yield adminNocDueService.getNocList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Noc List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, nocList);
}));
const getNocDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const nocId = req.params.id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const circularDetails = yield adminNocDueService.getNocDetails(nocId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'NOC Details Success', constants_1.API_RESPONSE_STATUS.SUCCESS, circularDetails);
}));
// const updateNoc = asyncHandler(
//     async (
//         req: CustomRequest<IUpdateNocFormBody>,
//         res: Response
//     ) => {
//         const adminNocDueService= new AdminNocDueService
//         const userid = req?.user_id
//         const nocId = req.params.id
//         const payload = req.body
//         if (!userid) {
//             throw new Error("User ID is required.");
//         }
//         const circularDetails = await adminNocDueService.updateNoc(nocId,payload)
//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.CREATED,
//             'NOC Details Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             circularDetails
//         );
//     }
// );
const updateNoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService();
    const nocId = req.params.id;
    const payload = req.body;
    const files = req.files;
    console.log(payload, "payload ");
    if (!nocId) {
        throw new Error("NOC ID is required.");
    }
    const updatedNoc = yield adminNocDueService.updateNoc(nocId, payload, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "NOC details updated successfully", constants_1.API_RESPONSE_STATUS.SUCCESS, updatedNoc);
}));
const addNocUserContribution = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const circularDetails = yield adminNocDueService.addNocUserContribution(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'NOC Details Success', constants_1.API_RESPONSE_STATUS.SUCCESS, circularDetails);
}));
const getNocUserContributionList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const nocList = yield adminNocDueService.getNocUserContributionList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'User Contribution List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, nocList);
}));
const deleteNoc = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminNocDueService = new adminNocDueService_1.AdminNocDueService;
    const id = req.params.id;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const nocList = yield adminNocDueService.deleteNoc(id);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'NOC Deleted Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, nocList);
}));
exports.default = {
    getNocList,
    getNocDetails,
    updateNoc,
    addNocUserContribution, getNocUserContributionList, deleteNoc
};
