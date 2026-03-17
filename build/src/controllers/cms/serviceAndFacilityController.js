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
const serviceAndFacilityService_1 = require("../../services/cms/serviceAndFacilityService");
const createServiceAndFacility = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceAndFacilityService = new serviceAndFacilityService_1.ServiceAndFacilityService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const serviceAndFacilityCreated = yield serviceAndFacilityService.createServiceAndFacility(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Service And Facility Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceAndFacilityCreated);
}));
const getServiceAndFacilityList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceAndFacilityService = new serviceAndFacilityService_1.ServiceAndFacilityService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const serviceAndFacilityList = yield serviceAndFacilityService.getServiceAndFacilityList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Service And Facility  List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceAndFacilityList);
}));
const updateServiceAndFacility = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceAndFacilityService = new serviceAndFacilityService_1.ServiceAndFacilityService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const serviceAndFacilityListId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const serviceAndFacilityUpdated = yield serviceAndFacilityService.updateServiceAndFacility(payload, serviceAndFacilityListId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Service And Facility  Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceAndFacilityUpdated);
}));
const deleteServiceAndFacility = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceAndFacilityService = new serviceAndFacilityService_1.ServiceAndFacilityService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const industryId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const serviceAndFacilitySuccess = yield serviceAndFacilityService.deleteServiceAndFacility(industryId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, serviceAndFacilitySuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createServiceAndFacility,
    updateServiceAndFacility,
    getServiceAndFacilityList,
    deleteServiceAndFacility,
};
