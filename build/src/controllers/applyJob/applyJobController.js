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
const applyJobService_1 = require("../../services/user/applyJob/applyJobService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const applyJob = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applyJobService = new applyJobService_1.ApplyJobService();
    const payload = req.body;
    const file = req.file;
    console.log(payload, " payload");
    const careerOpportunityCreated = yield applyJobService.applyJob(payload, file);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Job Appiled Successfully ', constants_1.API_RESPONSE_STATUS.SUCCESS, careerOpportunityCreated);
}));
exports.default = {
    applyJob
};
