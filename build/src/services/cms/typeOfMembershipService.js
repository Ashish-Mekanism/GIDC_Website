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
exports.TypeOfMembershipService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const TypeOfMembership_1 = __importDefault(require("../../models/TypeOfMembership"));
class TypeOfMembershipService {
    createTypeOfMembership(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingTypeOfMembership = yield TypeOfMembership_1.default.findOne();
            const { Title, Description1, Description2, MembershipPoints, } = payload;
            // Prepare the new businessBulletin document
            const newTypeOfMembership = new TypeOfMembership_1.default({
                Title,
                Description1,
                Description2,
                MembershipPoints,
                CreatedBy: userId,
            });
            // Save the document
            yield newTypeOfMembership.save();
            return newTypeOfMembership;
        });
    }
    updateTypeOfMembership(payload, typeOfMembershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const typeOfMembership = yield TypeOfMembership_1.default.findById((0, helper_1.toObjectId)(typeOfMembershipId));
            if (!typeOfMembership) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Type Of Membership not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedTypeOfMembership = (yield TypeOfMembership_1.default.findByIdAndUpdate(typeOfMembershipId, updatedPayload, { new: true }).lean());
            return updatedTypeOfMembership;
        });
    }
    getTypeOfMembership() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const typeOfMembership = yield TypeOfMembership_1.default.find().lean();
            if (!typeOfMembership) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A Type Of Membership Not Found.");
            }
            // Prepare the response
            const response = typeOfMembership;
            return response;
        });
    }
    deleteTypeOfMembership(typeOfMembershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const typeOfMembership = yield TypeOfMembership_1.default.findById(typeOfMembershipId);
            if (!typeOfMembership) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Type Of Membership not found");
            }
            // Delete the document from the database
            yield TypeOfMembership_1.default.deleteOne({ _id: typeOfMembershipId });
            return {
                success: true,
                message: "Type Of Membership have been deleted successfully",
            };
        });
    }
}
exports.TypeOfMembershipService = TypeOfMembershipService;
