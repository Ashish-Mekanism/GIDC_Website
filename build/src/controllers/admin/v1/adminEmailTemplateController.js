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
const responses_1 = require("../../../utils/responses");
const constants_1 = require("../../../utils/constants");
const emailTemplate_1 = require("../../../services/admin/emailTemplate");
// const deleteConfig = asyncHandler(
//   async (req: CustomRequest<Request>, res: Response) => {
//     const key = req?.params?.key;
//     await configService.deleteConfig(key);
//     SuccessResponseWithoutData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'Deleted Config',
//       API_RESPONSE_STATUS.SUCCESS
//     );
//   }
// );
// const getConfig = asyncHandler(
//   async (req: CustomRequest<Request>, res: Response) => {
//     const key = req?.params?.key;
//     const config = await configService.getConfig(key);
//     SuccessResponseWithData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'Get Config Success',
//       API_RESPONSE_STATUS.SUCCESS,
//       config
//     );
//   }
// );
// const getAllConfig = asyncHandler(
//   async (_req: CustomRequest<Request>, res: Response) => {
//     const configList = await configService.getAllConfig();
//     SuccessResponseWithData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'All Configs',
//       API_RESPONSE_STATUS.SUCCESS,
//       configList
//     );
//   }
// );
const getServiceRequestsEmailTemplates = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield emailTemplate_1.emailTemplateService.getServiceRequestEmailTemplates();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'All Service Request Templates', constants_1.API_RESPONSE_STATUS.SUCCESS, templates);
}));
const getEventsEmailTemplates = (0, asyncHandler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield emailTemplate_1.emailTemplateService.getEventEmailTemplates();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'All Events Email Templates', constants_1.API_RESPONSE_STATUS.SUCCESS, templates);
}));
const editEmailTemplate = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const key = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.key;
    const data = req === null || req === void 0 ? void 0 : req.body;
    const updatedTemplate = yield emailTemplate_1.emailTemplateService.editEmailTemplate(key, data);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Updated Email Template', constants_1.API_RESPONSE_STATUS.SUCCESS, updatedTemplate);
}));
exports.default = {
    getServiceRequestsEmailTemplates,
    getEventsEmailTemplates,
    editEmailTemplate,
};
