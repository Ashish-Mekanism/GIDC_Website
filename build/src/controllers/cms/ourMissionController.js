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
const ourMissionService_1 = require("../../services/cms/ourMissionService");
const createOurMission = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ourMissionService = new ourMissionService_1.OurMissionService();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, "payload");
    console.log(userid, "userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const ourMissionCreated = yield ourMissionService.createOurMission(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Our Mission Created Success", constants_1.API_RESPONSE_STATUS.SUCCESS, ourMissionCreated);
}));
const getOurMission = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ourMissionService = new ourMissionService_1.OurMissionService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required .");
    }
    const getOurMissionSuccess = yield ourMissionService.getOurMission();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Our Mission Success", constants_1.API_RESPONSE_STATUS.SUCCESS, getOurMissionSuccess);
}));
const updateOurMission = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ourMissionService = new ourMissionService_1.OurMissionService();
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const ourMissionId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const ourMissionUpdated = yield ourMissionService.updateOurMission(payload, ourMissionId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Our Mission Updated Success ", constants_1.API_RESPONSE_STATUS.SUCCESS, ourMissionUpdated);
}));
exports.default = {
    createOurMission,
    updateOurMission,
    getOurMission,
};
