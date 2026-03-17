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
exports.MembershipBenefitsService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const MembershipBenefits_1 = __importDefault(require("../../models/MembershipBenefits"));
class MembershipBenefitsService {
    createMebershipBenefits(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingMembershipBenefits = yield MembershipBenefits_1.default.findOne();
            if (existingMembershipBenefits) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A Mebership Benefits' entry already exists. You cannot create another one.");
            }
            const { MebershipBenefitsPoints, MembershipBenefitDescription, MembershipBenefitDescription2, MembershipBenefitDescription3 } = payload;
            // Prepare the new businessBulletin document
            const newMembershipBenefits = new MembershipBenefits_1.default({
                MebershipBenefitsPoints, MembershipBenefitDescription,
                MembershipBenefitDescription2, MembershipBenefitDescription3,
                CreatedBy: userId,
            });
            // Save the document
            yield newMembershipBenefits.save();
            return newMembershipBenefits;
        });
    }
    updateMebershipBenefits(payload, mebershipBenefitsId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const membershipBenefits = yield MembershipBenefits_1.default.findById((0, helper_1.toObjectId)(mebershipBenefitsId));
            if (!membershipBenefits) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Membership Benefits not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedMembershipBenefits = (yield MembershipBenefits_1.default.findByIdAndUpdate(mebershipBenefitsId, updatedPayload, { new: true }).lean());
            return updatedMembershipBenefits;
        });
    }
    getMebershipBenefits() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const membershipBenefits = yield MembershipBenefits_1.default.find().lean();
            if (!membershipBenefits) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Membership Benefits Not Found.");
            }
            // Prepare the response
            const response = membershipBenefits;
            return response;
        });
    }
}
exports.MembershipBenefitsService = MembershipBenefitsService;
