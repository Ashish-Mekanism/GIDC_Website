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
exports.CorporateSocialResponsibilityService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const CorporateSocialResponsibility_1 = __importDefault(require("../../models/CorporateSocialResponsibility"));
class CorporateSocialResponsibilityService {
    createCorporateSocialResponsibility(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCorporateSocialResponsibility = yield CorporateSocialResponsibility_1.default.findOne();
            if (existingCorporateSocialResponsibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Corporate Social Responsibility' entry already exists. You cannot create another one.");
            }
            const { CorporateSocialResponsibility1, CorporateSocialResponsibility2 } = payload;
            // Prepare the new newCorporateSocialResponsibility document
            const newCorporateSocialResponsibility = new CorporateSocialResponsibility_1.default({
                CorporateSocialResponsibility1,
                CorporateSocialResponsibility2,
                CreatedBy: userId,
            });
            // Save the document
            yield newCorporateSocialResponsibility.save();
            return newCorporateSocialResponsibility;
        });
    }
    updateCorporateSocialResponsibility(payload, corporateSocialResponsibilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const corporateSocialResponsibility = yield CorporateSocialResponsibility_1.default.findById((0, helper_1.toObjectId)(corporateSocialResponsibilityId));
            if (!corporateSocialResponsibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Our Vision not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedCorporateSocialResponsibility = (yield CorporateSocialResponsibility_1.default.findByIdAndUpdate(corporateSocialResponsibilityId, updatedPayload, { new: true }).lean());
            return updatedCorporateSocialResponsibility;
        });
    }
    getCorporateSocialResponsibility() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const corporateSocialResponsibility = yield CorporateSocialResponsibility_1.default.find().lean();
            if (!corporateSocialResponsibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Corporate Social Responsibility Not Found.");
            }
            // Prepare the response
            const response = corporateSocialResponsibility;
            return response;
        });
    }
}
exports.CorporateSocialResponsibilityService = CorporateSocialResponsibilityService;
