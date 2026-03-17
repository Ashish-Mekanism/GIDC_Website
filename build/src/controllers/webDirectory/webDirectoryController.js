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
const webDirectortyService_1 = require("../../services/user/webDirectory/webDirectortyService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const createWebDirectory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webDirectortyService = new webDirectortyService_1.WebDirectoryService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    console.log(payload, " payload");
    console.log(files, " imagess");
    if (!userid) {
        throw new Error("User ID is required to become a member.");
    }
    const webDirectoryCreatted = yield webDirectortyService.createWebDirectory(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Web Directory Create Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryCreatted);
}));
//OPEN API
const getWebDirectory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webDirectortyService = new webDirectortyService_1.WebDirectoryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const webDirectoryId = req === null || req === void 0 ? void 0 : req.params.id;
    const webDirectoryDetails = yield webDirectortyService.getWebDirectory(webDirectoryId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Web Directory Detail Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryDetails);
}));
//WITH AUTH 
const getWebDirectoryWithAuth = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webDirectortyService = new webDirectortyService_1.WebDirectoryService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    //  const webDirectoryId= req?.params.id
    if (!userid) {
        throw new Error("User ID is required to update the directory.");
    }
    const webDirectoryDetails = yield webDirectortyService.getWebDirectory(userid);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Web Directory Detail Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryDetails);
}));
const updateWebDirectory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webDirectoryService = new webDirectortyService_1.WebDirectoryService();
    const payload = req.body;
    const userId = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    const webDirectoryId = req === null || req === void 0 ? void 0 : req.params.id;
    if (!userId) {
        throw new Error("User ID is required to update the directory.");
    }
    const webDirectoryUpdated = yield webDirectoryService.updateWebDirectory(payload, webDirectoryId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, "Web Directory Update Success", constants_1.API_RESPONSE_STATUS.SUCCESS, webDirectoryUpdated);
}));
exports.default = {
    createWebDirectory,
    getWebDirectory,
    updateWebDirectory,
    getWebDirectoryWithAuth,
};
