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
const contactUsService_1 = require("../../services/cms/contactUsService");
const createAdminContactUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminContactUsService = new contactUsService_1.AdminContactUsService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const contactUsCreated = yield adminContactUsService.createContactUs(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Contact Us Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, contactUsCreated);
}));
const getContactUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminContactUsService = new contactUsService_1.AdminContactUsService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const getContactUsSuccess = yield adminContactUsService.getContactUs();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Contact Us Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getContactUsSuccess);
}));
const updateAdminContactUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminContactUsService = new contactUsService_1.AdminContactUsService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const contactUsId = req === null || req === void 0 ? void 0 : req.params.id;
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const contactUsUpdated = yield adminContactUsService.updateContactUs(payload, contactUsId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Contact Us Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, contactUsUpdated);
}));
exports.default = {
    createAdminContactUs,
    getContactUs,
    updateAdminContactUs,
};
