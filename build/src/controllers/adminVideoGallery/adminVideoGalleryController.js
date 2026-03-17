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
const adminVideoGalleryService_1 = require("../../services/admin/adminVideoGallery/adminVideoGalleryService");
const adminVideoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    console.log(files, " files");
    // console.log(userid, " userid");
    // console.log(payload, " payload");
    // const posterFile = files?.Poster?.[0]; // single poster image
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const adminVideoGallerySuccess = yield adminVideoGalleryService.createAdminVideoGallery(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, ' Video Gallery Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, adminVideoGallerySuccess);
}));
const updateAdminVideoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminVideoGalleryId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const updateAdminVideoGallerySuccess = yield adminVideoGalleryService.updateAdminVideoGallery(payload, adminVideoGalleryId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Video Gallery Updated Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, updateAdminVideoGallerySuccess);
}));
const deleteAdminVideoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminVideoGalleryId = req.params.id;
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deleteDigitalCardGallerySuccess = yield adminVideoGalleryService.deleteAdminVideoGallery(adminVideoGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, deleteDigitalCardGallerySuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS, deleteDigitalCardGallerySuccess);
}));
const getVideoGalleryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const videoGalleryList = yield adminVideoGalleryService.getAdminVideoGalleryList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, " Admin Video Gallery List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, videoGalleryList);
}));
const getVideoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminVideoGalleryId = req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const videoGallery = yield adminVideoGalleryService.getAdminGalleryVideos(adminVideoGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Video Gallery Success', constants_1.API_RESPONSE_STATUS.SUCCESS, videoGallery);
}));
exports.default = {
    adminVideoGallery,
    getVideoGalleryList,
    getVideoGallery,
    updateAdminVideoGallery,
    deleteAdminVideoGallery,
};
