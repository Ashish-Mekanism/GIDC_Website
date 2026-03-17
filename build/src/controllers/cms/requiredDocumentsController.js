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
const requiredDocumentsService_1 = require("../../services/cms/requiredDocumentsService");
const createRequiredDocuments = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredDocumentsService = new requiredDocumentsService_1.RequiredDocumentsService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, "payload");
    console.log(userid, "userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const maximizingVisibilityCreated = yield requiredDocumentsService.createRequiredDocuments(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Required Documents Created Success", constants_1.API_RESPONSE_STATUS.SUCCESS, maximizingVisibilityCreated);
}));
const getRequiredDocuments = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredDocumentsService = new requiredDocumentsService_1.RequiredDocumentsService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required .");
    }
    const getMaximizingVisibilitySuccess = yield requiredDocumentsService.getRequiredDocuments();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Required Documents Success", constants_1.API_RESPONSE_STATUS.SUCCESS, getMaximizingVisibilitySuccess);
}));
const updateRequiredDocuments = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredDocumentsService = new requiredDocumentsService_1.RequiredDocumentsService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const requiredDocumentsId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const maximizingVisibilityUpdated = yield requiredDocumentsService.updateRequiredDocuments(payload, requiredDocumentsId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Required Documents Updated Success ", constants_1.API_RESPONSE_STATUS.SUCCESS, maximizingVisibilityUpdated);
}));
exports.default = {
    createRequiredDocuments,
    updateRequiredDocuments,
    getRequiredDocuments,
};
