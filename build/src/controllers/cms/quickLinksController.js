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
const quickLinkService_1 = require("../../services/cms/quickLinkService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const createQuickLink = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quickLinkService = new quickLinkService_1.QuickLinkService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const quickLinkCreated = yield quickLinkService.createQuickLink(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Quick Link Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, quickLinkCreated);
}));
const updateQuickLink = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quickLinkService = new quickLinkService_1.QuickLinkService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const quickLinkId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    console.log(quickLinkId, " quickLinkId");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const quickLinkUpdated = yield quickLinkService.updateQuickLink(payload, quickLinkId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Quick Link Uspdated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, quickLinkUpdated);
}));
const getQuickLinkList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quickLinkService = new quickLinkService_1.QuickLinkService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const quickLinkList = yield quickLinkService.getQuickLinkList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Quick Link List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, quickLinkList);
}));
const deleteQuickLink = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quickLinkService = new quickLinkService_1.QuickLinkService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const quickLinkId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deleteQuickLinkSuccess = yield quickLinkService.deleteQuickLink(quickLinkId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.CREATED, deleteQuickLinkSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createQuickLink,
    updateQuickLink,
    getQuickLinkList,
    deleteQuickLink,
};
