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
const ServiceCategory_1 = __importDefault(require("../../models/ServiceCategory"));
const contractorService_1 = require("../../services/admin/contractor/contractorService");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const createContractor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractorService = new contractorService_1.ContractorService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(payload, 'payload');
    if (!userid) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "User ID is required.", {}, false);
    }
    // if (!payload.ServiceId) {
    //     throw new ApiError(
    //         RESPONSE_CODE.NOT_FOUND,
    //         "ServiceId is required.",
    //         {},
    //         false
    //     );
    //   }
    // Directly check if the serviceId exists and is active in the database
    const serviceCategory = yield ServiceCategory_1.default.findOne({ _id: payload.ServiceIds, active: true });
    if (!serviceCategory) {
        throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Invalid ServiceId: Service category not found or inactive.", {}, false);
    }
    const ContractorCreated = yield contractorService.createContractor(payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Contractor Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, ContractorCreated);
}));
const updateContractor = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractorService = new contractorService_1.ContractorService;
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const ControlerId = req.params.id;
    if (!userid) {
        throw new Error("User ID is required.");
    }
    if (!ControlerId) {
        throw new Error("Service Category Id required.");
    }
    const ContractorUpdated = yield contractorService.updateContractor(ControlerId, payload);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, ' Contractor Updated Success', constants_1.API_RESPONSE_STATUS.SUCCESS, ContractorUpdated);
}));
//   const getContractorList = asyncHandler(
//     async (
//         req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
//         res: Response
//     ) => {
//         const contractorService= new ContractorService
//         const reqQuery = req.query
//         const getMmebersList = await contractorService.getPaginationContractorList(reqQuery)
//         SuccessResponseWithData(
//             res,
//             RESPONSE_CODE.SUCCESS,
//             'Contractor List Success',
//             API_RESPONSE_STATUS.SUCCESS,
//             getMmebersList
//         );
//     }
// );
const getContractorList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractorService = new contractorService_1.ContractorService();
    const contractorList = yield contractorService.getAllContractors();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Contractor List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, contractorList);
}));
exports.default = {
    getContractorList,
    createContractor,
    updateContractor,
};
