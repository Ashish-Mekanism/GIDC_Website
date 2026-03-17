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
const AdminComplaintService_1 = require("../../../services/admin/complaint/AdminComplaintService");
const complaintFormService_1 = require("../../../services/user/complaintForm/complaintFormService");
const createComplaintByAdmin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintFormService = new complaintFormService_1.ComplaintFormService();
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        console.log("no user id");
        throw new Error("User ID is required.");
    }
    const ComplaintRegistered = yield complaintFormService.createComplaintByAdmin(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Complaint Register Success ", constants_1.API_RESPONSE_STATUS.SUCCESS, ComplaintRegistered);
}));
const getComplaintFormList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const serviceCategoryKey = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.key;
    const complaintStatus = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.status;
    let fromDate = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.fromDate;
    let toDate = (_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.toDate;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const complaintList = yield adminComplaintService.getComplaintList(serviceCategoryKey, complaintStatus, { fromDate, toDate });
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Complaint List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, complaintList);
}));
const assignContractor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const complaintId = req === null || req === void 0 ? void 0 : req.params.id;
    const contractorAssign = yield adminComplaintService.assignContractor(complaintId, payload);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, contractorAssign.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const updateComplaintStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const payload = req.body;
    const complaintId = payload.complaintId;
    const status = +payload.status;
    console.log(payload, "paylooadd");
    const updatedStatus = yield adminComplaintService.updateComplaintStatus(complaintId, status);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, updatedStatus.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const deleteComplaint = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const complaintId = req === null || req === void 0 ? void 0 : req.params.id;
    yield adminComplaintService.deleteComplaint(complaintId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Deleted Complaint Successfully", constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const getComplaintCompletedFormList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const complaintList = yield adminComplaintService.getComplaintCompletedList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Complaint Completed List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, complaintList);
}));
const getComplaintForm = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminComplaintService = new AdminComplaintService_1.AdminComplaintService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const ComplaintId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const complaintList = yield adminComplaintService.getComplaintForm(ComplaintId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Complaint Completed Details Success", constants_1.API_RESPONSE_STATUS.SUCCESS, complaintList);
}));
exports.default = {
    getComplaintFormList,
    updateComplaintStatus,
    assignContractor,
    getComplaintCompletedFormList,
    getComplaintForm,
    deleteComplaint,
    createComplaintByAdmin,
};
