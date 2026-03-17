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
const businessBulletinService_1 = require("../../services/cms/businessBulletinService");
const createBusinessBulletin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessBulletinService = new businessBulletinService_1.BusinessBulletinService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req.file;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    console.log(file, 'file');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const businessBulletinCreated = yield businessBulletinService.createBusinessBulletin(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Bulletin Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, businessBulletinCreated);
}));
const getBusinessBulletinList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessBulletinService = new businessBulletinService_1.BusinessBulletinService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const businessBulletinList = yield businessBulletinService.getBusinessBulletinList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Business Bulletin List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, businessBulletinList);
}));
const updateBusinessBulletin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessBulletinService = new businessBulletinService_1.BusinessBulletinService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessBulletinId = req === null || req === void 0 ? void 0 : req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const businessBulletinUpdated = yield businessBulletinService.updateBusinessBulletin(payload, businessBulletinId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Bulletin Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, businessBulletinUpdated);
}));
const deleteBusinessBulletin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessBulletinService = new businessBulletinService_1.BusinessBulletinService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessBulletinId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deleteBusinessBulletinSuccess = yield businessBulletinService.deleteBusinessBulletin(businessBulletinId);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, deleteBusinessBulletinSuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createBusinessBulletin,
    getBusinessBulletinList,
    updateBusinessBulletin,
    deleteBusinessBulletin,
};
