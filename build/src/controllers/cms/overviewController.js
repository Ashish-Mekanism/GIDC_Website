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
const overviewService_1 = require("../../services/cms/overviewService");
const createOverview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    console.log(userid, 'userid');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const overviewCreated = yield overviewService.createOverview(payload, userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Overview Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, overviewCreated);
}));
const updateOverview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const overviewId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const overviewUpdated = yield overviewService.updateOverview(payload, overviewId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Overview Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, overviewUpdated);
}));
const getOverview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const getOverviewSuccess = yield overviewService.getOverview();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Overview Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getOverviewSuccess);
}));
const updateAboutUsImage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const aboutUsImagesSuccess = yield overviewService.updateAboutUsImages(payload, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'About Us Images Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, aboutUsImagesSuccess);
}));
const createAboutUsImages = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const aboutUsImagesSuccess = yield overviewService.createAboutUsImages(userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'About Us Images Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, aboutUsImagesSuccess);
}));
const getAboutUsImages = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    //const userid = req?.user_id
    // console.log(userid, " userid");
    // if (!userid) {
    //     throw new Error("User ID is required to become a member.");
    // }
    const aboutUsImagesSuccess = yield overviewService.getAboutUsImages();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'About Us Images Success', constants_1.API_RESPONSE_STATUS.SUCCESS, aboutUsImagesSuccess);
}));
exports.default = {
    updateOverview,
    getOverview,
    createOverview,
    createAboutUsImages,
    updateAboutUsImage,
    getAboutUsImages
};
