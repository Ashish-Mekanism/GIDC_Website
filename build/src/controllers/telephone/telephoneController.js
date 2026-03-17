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
const telephoneService_1 = require("../../services/admin/telephone/telephoneService");
const createTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telephoneService = new telephoneService_1.TelephoneService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const telephoneTitleCreated = yield telephoneService.createTelephoneTitle(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Telephone Title Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, telephoneTitleCreated);
}));
const updateTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telephoneService = new telephoneService_1.TelephoneService;
    const telephoneId = req === null || req === void 0 ? void 0 : req.params.id;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const telephoneTitleUpdated = yield telephoneService.updateTelephoneTitle(payload, telephoneId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Telephone Title Updated Successfully', constants_1.API_RESPONSE_STATUS.SUCCESS, telephoneTitleUpdated);
}));
const getTelephoneList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telephoneService = new telephoneService_1.TelephoneService;
    const telephoneList = yield telephoneService.getAllTelephoneList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Telephone List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, telephoneList);
}));
const deleteTelephone = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const telephoneService = new telephoneService_1.TelephoneService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const telephoneId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const telephoneSuccess = yield telephoneService.deleteTelephone(telephoneId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, telephoneSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createTelephone,
    getTelephoneList,
    updateTelephone,
    deleteTelephone,
};
