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
exports.CareerOpportunityService = void 0;
const CareerOpportunity_1 = __importDefault(require("../../../models/CareerOpportunity"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
class CareerOpportunityService {
    createCareerOpportunity(payload, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a new career opportunity entry
            const careerOpportunity = new CareerOpportunity_1.default(Object.assign(Object.assign({}, payload), { userId: user_id, approveStatus: constants_1.JOB_POSTING_STATUS.PENDING, isDeleted: false, applicationDeadline: new Date(payload.applicationDeadline || "") }));
            // Save to the database
            yield careerOpportunity.save();
            return careerOpportunity;
        });
    }
    getPostedJobList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all career opportunities posted by the user
            const jobList = yield CareerOpportunity_1.default.find({ userId, isDeleted: false }).lean();
            if (!jobList || jobList.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "No job list found for this user.");
            }
            return jobList;
        });
    }
    updateCareerOpportunity(payload, id, careerOpportunityId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update the career opportunity entry
            const updatedCareerOpportunity = yield CareerOpportunity_1.default.findByIdAndUpdate(careerOpportunityId, Object.assign(Object.assign({}, payload), { applicationDeadline: new Date(payload.applicationDeadline || "") }), { new: true }).lean();
            if (!updatedCareerOpportunity) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Career opportunity not found.");
            }
            return updatedCareerOpportunity;
        });
    }
    deleteCareerOpportunity(careerOpportunityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const careerOpportunityIdToObjId = (0, helper_1.toObjectId)(careerOpportunityId);
            const deletedCareerOpportunity = yield CareerOpportunity_1.default.findByIdAndUpdate(careerOpportunityIdToObjId, { isDeleted: true }, { new: true }).lean();
            if (!deletedCareerOpportunity) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Career opportunity not found.");
            }
            return { message: "Career opportunity deleted successfully." };
        });
    }
}
exports.CareerOpportunityService = CareerOpportunityService;
