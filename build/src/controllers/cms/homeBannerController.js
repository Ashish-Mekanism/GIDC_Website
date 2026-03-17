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
const homeBannerService_1 = require("../../services/cms/homeBannerService");
const createHomeBanner = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const homeBannerService = new homeBannerService_1.HomeBannerService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required ");
    }
    const homeBannerSuccess = yield homeBannerService.createHomeBanner(userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Home Banner Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, homeBannerSuccess);
}));
const updateHomeBanner = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const homeBannerService = new homeBannerService_1.HomeBannerService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const homeBannerId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const updateForeignEmbassiesSuccess = yield homeBannerService.updateHomeBanner(payload, homeBannerId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Home Banner Updated Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, updateForeignEmbassiesSuccess);
}));
const getHomeBanner = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const homeBannerService = new homeBannerService_1.HomeBannerService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const foreignEmbassies = yield homeBannerService.getHomeBanner();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Home Banner Photo Success', constants_1.API_RESPONSE_STATUS.SUCCESS, foreignEmbassies);
}));
exports.default = {
    createHomeBanner,
    updateHomeBanner,
    getHomeBanner,
};
