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
const downloadAndCircularService_1 = require("../../services/admin/downloadAndCircular/downloadAndCircularService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const responses_1 = require("../../utils/responses");
const constants_1 = require("../../utils/constants");
const createCircular = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(file, 'file');
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const eventCreated = yield downloadAndCircularService.createCircular(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Circular Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventCreated);
}));
const updateCircular = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService();
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const circularId = req === null || req === void 0 ? void 0 : req.params.id;
    //    const file = req?.file
    console.log(payload, ' payload');
    console.log(circularId, ' circularId');
    if (!userid) {
        throw new Error('User ID is required to update a member.');
    }
    const ciruclarUpdated = yield downloadAndCircularService.updateCircular(payload, circularId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Circular Uspdated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, ciruclarUpdated);
}));
const getCircularList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const query = req.query;
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const circularList = yield downloadAndCircularService.getCircularList(query);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Circular List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, circularList);
}));
const getCircularDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const circularId = req.params.id;
    console.log(userid, ' userid');
    console.log(circularId, ' circularId');
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const circularDetails = yield downloadAndCircularService.getCircularDetails(circularId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Circular Details Success', constants_1.API_RESPONSE_STATUS.SUCCESS, circularDetails);
}));
const circularActiveInactive = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService();
    const payload = req.body;
    const downlaodAndCircular_Id = payload.downlaodAndCircularId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield downloadAndCircularService.activeInactiveCircular(downlaodAndCircular_Id, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createCircular,
    updateCircular,
    getCircularList,
    getCircularDetails,
    circularActiveInactive,
};
