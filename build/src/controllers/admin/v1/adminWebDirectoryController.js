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
const adminWebDirectoryService_1 = require("../../../services/admin/webDirectory/adminWebDirectoryService");
const adminCreateWebDirectory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminWebDirectoryService = new adminWebDirectoryService_1.AdminWebDirectoryService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(payload, " payload");
    console.log(files, " imagess");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const webDirectoryCreatted = yield adminWebDirectoryService.adminCreateWebDirectory(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Web Directory Create Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryCreatted);
}));
const getAdminWebDirectoryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminWebDirectoryService = new adminWebDirectoryService_1.AdminWebDirectoryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const nocList = yield adminWebDirectoryService.getWebDirectoryList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Web Directory List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, nocList);
}));
const getWebDirectoryById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminWebDirectoryService = new adminWebDirectoryService_1.AdminWebDirectoryService;
    const webDirectoryId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!webDirectoryId) {
        throw new Error("User ID is required.");
    }
    // Get web directory by ID (no need to convert to ObjectId here)
    const webDirectoryDetails = yield adminWebDirectoryService.getWebDirectoryById(webDirectoryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Web Directory Detail Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryDetails);
}));
const updateWebDirectory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminWebDirectoryService = new adminWebDirectoryService_1.AdminWebDirectoryService;
    const payload = req.body;
    const userId = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    const webDirectoryId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userId) {
        throw new Error("User ID is required to update the directory.");
    }
    const webDirectoryUpdated = yield adminWebDirectoryService.updateWebDirectory(payload, webDirectoryId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Web Directory Update Success", constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryUpdated);
}));
const webDirectoryActiveInactive = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminWebDirectoryService = new adminWebDirectoryService_1.AdminWebDirectoryService;
    const payload = req.body;
    const webDirectoryId = payload.webDirectoryId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const Status = yield adminWebDirectoryService.activeInactiveWebDirectory(webDirectoryId, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, Status.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    adminCreateWebDirectory,
    getAdminWebDirectoryList,
    updateWebDirectory,
    getWebDirectoryById,
    webDirectoryActiveInactive,
};
