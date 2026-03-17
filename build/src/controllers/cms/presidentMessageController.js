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
const presidentMessageService_1 = require("../../services/cms/presidentMessageService");
const createPresidentMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentMessageService = new presidentMessageService_1.PresidentMessageService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const messageCreated = yield presidentMessageService.createPresidentMessage(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Message Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, messageCreated);
}));
const getPresidentMessageList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentMessageService = new presidentMessageService_1.PresidentMessageService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const subTelephoneList = yield presidentMessageService.getPresidentMessageList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'President Message List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subTelephoneList);
}));
const updatePresidentMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentMessageService = new presidentMessageService_1.PresidentMessageService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const presidentMessageId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    console.log(presidentMessageId, " presidentMessageId");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const presidentMessageUpdated = yield presidentMessageService.updatePresidentMessage(payload, presidentMessageId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'President Message Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, presidentMessageUpdated);
}));
const deletePresidentMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentMessageService = new presidentMessageService_1.PresidentMessageService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const presidentMessageId = req.params.id;
    console.log(presidentMessageId, " presidentMessageId");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deletePresidentMessageSuccess = yield presidentMessageService.deletePresidentMessage(presidentMessageId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, deletePresidentMessageSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createPresidentMessage,
    getPresidentMessageList,
    updatePresidentMessage,
    deletePresidentMessage,
};
