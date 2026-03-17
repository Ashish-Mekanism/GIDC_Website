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
const getInTouchService_1 = require("../../services/getInTouchService");
const responses_1 = require("../../utils/responses");
const getIntouch = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getInTouchService = new getInTouchService_1.GetInTouchService;
    const payload = req.body;
    const GetInTouchSucess = yield getInTouchService.getInTouch(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Get In Touch Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, GetInTouchSucess);
}));
//Admin side Api
const getInTouchList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getInTouchService = new getInTouchService_1.GetInTouchService;
    const GetInTouchSucess = yield getInTouchService.getInTouchList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Get In Touch List Success ', constants_1.API_RESPONSE_STATUS.SUCCESS, GetInTouchSucess);
}));
exports.default = {
    getIntouch,
    getInTouchList
};
