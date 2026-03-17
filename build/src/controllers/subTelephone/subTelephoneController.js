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
const responses_1 = require("../../utils/responses");
const constants_1 = require("../../utils/constants");
const subTelephoneService_1 = require("../../services/admin/subTelephone/subTelephoneService");
const createSubTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTelephoneService = new subTelephoneService_1.SubTelephoneService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const subTelephoneCreated = yield subTelephoneService.createSubTelephone(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Sub Telephone Title Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subTelephoneCreated);
}));
const updateSubTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTelephoneService = new subTelephoneService_1.SubTelephoneService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const subTelephoneId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    console.log(subTelephoneId, " subTelephoneId");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const SubTelephoneUpdated = yield subTelephoneService.updateSubTelephone(payload, subTelephoneId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Sub Telephone Uspdated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, SubTelephoneUpdated);
}));
const getSubTelephoneList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTelephoneService = new subTelephoneService_1.SubTelephoneService;
    const TelephoneModelId = req === null || req === void 0 ? void 0 : req.params.id;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const subTelephoneList = yield subTelephoneService.getSubTelephoneList(TelephoneModelId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sub Telephone List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subTelephoneList);
}));
const deleteSubTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTelephoneService = new subTelephoneService_1.SubTelephoneService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const subTelephoneId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const subTelephoneSuccess = yield subTelephoneService.deleteSubTelephone(subTelephoneId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, subTelephoneSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createSubTelephone,
    updateSubTelephone,
    getSubTelephoneList,
    deleteSubTelephone,
};
