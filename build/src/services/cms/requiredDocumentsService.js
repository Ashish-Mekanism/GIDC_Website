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
exports.RequiredDocumentsService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const RequiredDocuments_1 = __importDefault(require("../../models/RequiredDocuments"));
class RequiredDocumentsService {
    createRequiredDocuments(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingRequiredDocuments = yield RequiredDocuments_1.default.findOne();
            if (existingRequiredDocuments) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Required Documents' entry already exists. You cannot create another one.");
            }
            const { requiredDocuments } = payload;
            // Prepare the new businessBulletin document
            const newRequiredDocuments = new RequiredDocuments_1.default({
                requiredDocuments: requiredDocuments,
                CreatedBy: userId,
            });
            // Save the document
            yield newRequiredDocuments.save();
            return newRequiredDocuments;
        });
    }
    updateRequiredDocuments(payload, requiredDocumentsId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const requiredDocuments = yield RequiredDocuments_1.default.findById((0, helper_1.toObjectId)(requiredDocumentsId));
            if (!requiredDocuments) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Required Documents not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedRequiredDocuments = (yield RequiredDocuments_1.default.findByIdAndUpdate(requiredDocumentsId, updatedPayload, { new: true }).lean());
            return updatedRequiredDocuments;
        });
    }
    getRequiredDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const requiredDocuments = yield RequiredDocuments_1.default.find().lean();
            if (!requiredDocuments) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Required Documents Not Found.");
            }
            // Prepare the response
            const response = requiredDocuments;
            return response;
        });
    }
}
exports.RequiredDocumentsService = RequiredDocumentsService;
