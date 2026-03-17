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
const asyncHandler_1 = __importDefault(require("../../../utils/asyncHandler"));
const constants_1 = require("../../../utils/constants");
const responses_1 = require("../../../utils/responses");
const adminBusinessCardService_1 = require("../../../services/admin/businessCard/adminBusinessCardService");
const businessCardService_1 = require("../../../services/user/businessCard/businessCardService");
const createBusinessCard = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminBusinessCardService = new adminBusinessCardService_1.AdminBusinessCardService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const businessCardCreated = yield adminBusinessCardService.createBusinessCardAdmin(payload, userid, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Created Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, businessCardCreated);
}));
const updateBusinessCard = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    const file = req === null || req === void 0 ? void 0 : req.file;
    console.log(file, " imagess");
    console.log(payload, " payload");
    console.log(businessCardId, " businessCardId");
    if (!userid) {
        throw new Error("User ID is required to update a member.");
    }
    const businessCardCreated = yield businessCardService.updateBusinessCard(payload, businessCardId, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Updated Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, businessCardCreated);
}));
const getBusinessCardList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminBusinessCardService = new adminBusinessCardService_1.AdminBusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const businessCardList = yield adminBusinessCardService.getBusinessCardList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Business Card List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, businessCardList);
}));
const getDigitalCardList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const reqQuery = req.query;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const UserId = req === null || req === void 0 ? void 0 : req.params.id;
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const getDigitalCardList = yield businessCardService.getUserDigitalCardList(UserId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Digital Card List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getDigitalCardList);
}));
const getBusinessCard = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    console.log(userid, " userid");
    console.log(businessCardId, " businessCardId");
    // if (!userid) {
    //     throw new Error("User ID is required to become a member.");
    // }
    const businessCard = yield businessCardService.getBusinessCard(businessCardId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Success', constants_1.API_RESPONSE_STATUS.SUCCESS, businessCard);
}));
const getDigitalGalleries = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const digitalCardId = req.params.id;
    console.log(userid, " userid");
    console.log(digitalCardId, " digitalCardId");
    const digitalCardGalleryImages = yield businessCardService.getDigitalCardGalleries(digitalCardId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Success', constants_1.API_RESPONSE_STATUS.SUCCESS, digitalCardGalleryImages);
}));
const getDigitalGalleryImages = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const digitalCardGalleryId = req.params.id;
    console.log(userid, " userid");
    console.log(digitalCardGalleryId, " digitalCardGalleryId");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const digitalCardGalleryImages = yield businessCardService.getDigitalCardGalleryImages(digitalCardGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Success', constants_1.API_RESPONSE_STATUS.SUCCESS, digitalCardGalleryImages);
}));
const digitalCardGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(businessCardId, " businessCardId");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const digitalCardGallerySuccess = yield businessCardService.digitalCardGallery(payload, businessCardId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Gallery Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, digitalCardGallerySuccess);
}));
const updateDigitalCardGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(businessCardId, " businessCardId");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const updateDigitalCardGallerySuccess = yield businessCardService.updateDigitalCardGallery(payload, businessCardId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Gallery Updated Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, updateDigitalCardGallerySuccess);
}));
const deleteDigitalCardGallery = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const digitalCardGalleryId = req.params.id;
    console.log(digitalCardGalleryId, " digitalCardGalleryId");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const deleteDigitalCardGallerySuccess = yield businessCardService.deleteDigitalCardGallery(digitalCardGalleryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Gallery Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, deleteDigitalCardGallerySuccess);
}));
const digitalCardSlider = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    console.log(files, " files");
    console.log(businessCardId, " businessCardId");
    console.log(userid, " userid");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const digitalCardSliderSuccess = yield businessCardService.digitalCardSlider(businessCardId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Slider Saved Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, digitalCardSliderSuccess);
}));
const updateDigitalSlider = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const files = req.files;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req.params.id;
    const payload = req.body;
    console.log(files, " files");
    console.log(businessCardId, " businessCardId");
    console.log(userid, " userid");
    console.log(payload, " payload");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const updateDigitalCardSliderSuccess = yield businessCardService.updateDigitalCardSlider(payload, businessCardId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Slider Updated Succes', constants_1.API_RESPONSE_STATUS.SUCCESS, updateDigitalCardSliderSuccess);
}));
const getDigitalSliderImages = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const digitalCardId = req.params.id;
    console.log(userid, " userid");
    console.log(digitalCardId, " digitalCardId");
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const digitalCardSliderImages = yield businessCardService.getDigitalCardSliderImages(digitalCardId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Business Card Success', constants_1.API_RESPONSE_STATUS.SUCCESS, digitalCardSliderImages);
}));
const getDigitalGalleryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessCardService = new businessCardService_1.BusinessCardService;
    const reqQuery = req.query;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const businessCardId = req === null || req === void 0 ? void 0 : req.params.id;
    console.log(userid, " userid");
    console.log(businessCardId, " businessCardId");
    console.log(reqQuery, " reqQuery");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const getDigitalGalleryList = yield businessCardService.getPaginationUserDigitalGalleryList(reqQuery, businessCardId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Digital Gallery List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getDigitalGalleryList);
}));
exports.default = {
    getBusinessCardList,
    getDigitalCardList,
    getBusinessCard,
    getDigitalGalleries,
    createBusinessCard,
    updateBusinessCard,
    getDigitalGalleryImages,
    digitalCardGallery,
    updateDigitalCardGallery,
    deleteDigitalCardGallery,
    updateDigitalSlider,
    digitalCardSlider,
    getDigitalSliderImages,
    getDigitalGalleryList,
};
