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
const adminPhotoGalleryService_1 = require("../../services/admin/adminPhotoGallery/adminPhotoGalleryService");
const adminPhotoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const adminPhotoGallerySuccess = yield adminPhotoGalleryService.createAdminPhotoGallery(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, ' Photo Gallery Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, adminPhotoGallerySuccess);
}));
const updateadminPhotoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminPhotoGalleryId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const updateAdminPhotoGallerySuccess = yield adminPhotoGalleryService.updateAdminPhotoGallery(payload, adminPhotoGalleryId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Photo Gallery Updated Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, updateAdminPhotoGallerySuccess);
}));
const deleteAdminPhotoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminPhotoGalleryId = req.params.id;
    console.log(adminPhotoGalleryId, " adminPhotoGalleryId");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deleteDigitalCardGallerySuccess = yield adminPhotoGalleryService.deleteAdminPhotoGallery(adminPhotoGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, deleteDigitalCardGallerySuccess.message, constants_1.API_RESPONSE_STATUS.SUCCESS, deleteDigitalCardGallerySuccess);
}));
const getPhotoGalleryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const photoGalleryList = yield adminPhotoGalleryService.getAdminPhotoGalleryList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, " Admin Photo Gallery List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, photoGalleryList);
}));
const getPhotoGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const adminPhotoGalleryId = req.params.id;
    console.log(userid, " userid");
    console.log(adminPhotoGalleryId, " adminPhotoGalleryId");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const photoGallery = yield adminPhotoGalleryService.getPhotoGalleryImages(adminPhotoGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Photo Gallery Success', constants_1.API_RESPONSE_STATUS.SUCCESS, photoGallery);
}));
exports.default = {
    adminPhotoGallery,
    updateadminPhotoGallery,
    deleteAdminPhotoGallery,
    getPhotoGalleryList,
    getPhotoGallery,
};
