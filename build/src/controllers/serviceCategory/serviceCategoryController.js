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
const serviceCategoryService_1 = require("../../services/admin/serviceCategory/serviceCategoryService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const createServiceCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceCategoryService = new serviceCategoryService_1.ServiceCategoryService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    if (!userid) {
        throw new Error("User ID is required.");
    }
    const serviceCategoryCreated = yield serviceCategoryService.createServiceCategory(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Service Category Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceCategoryCreated);
}));
const updateServiceCategory = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceCategoryService = new serviceCategoryService_1.ServiceCategoryService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const serviceCategoryId = req.params.id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    if (!serviceCategoryId) {
        throw new Error("Service Category Id required.");
    }
    const serviceCategoryUpdated = yield serviceCategoryService.updateServiceCategory(serviceCategoryId, payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Service Category Updated Success', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceCategoryUpdated);
}));
// const getServiceCategoryList = asyncHandler(
//     async (
//         req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
//         res: Response
//     ) => {
//         const serviceCategoryService = new ServiceCategoryService
//         const reqQuery = req.query
//         const getMmebersList = await serviceCategoryService.getPaginationServiceCategoryList(reqQuery)
//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.SUCCESS,
//             'Members List Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             getMmebersList
//         );
//     }
// );
const getServiceCategoryList = (0, asyncHandler_1.default)((req, // Changed from IPaginationQuery
res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceCategoryService = new serviceCategoryService_1.ServiceCategoryService();
    const serviceCategoryList = yield serviceCategoryService.getServiceCategoryList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Service Category List Success', // Fixed the message
    constants_1.API_RESPONSE_STATUS.SUCCESS, serviceCategoryList);
}));
exports.default = {
    updateServiceCategory,
    getServiceCategoryList,
    createServiceCategory,
};
