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
exports.MaximizingVisibilityService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const MaximizingVisibility_1 = __importDefault(require("../../models/MaximizingVisibility"));
class MaximizingVisibilityService {
    createMaximizingVisibility(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingMaximizingVisibility = yield MaximizingVisibility_1.default.findOne();
            if (existingMaximizingVisibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Maximizing Visibility' entry already exists. You cannot create another one.");
            }
            console.log(payload, 'maximizingVisibility');
            const { maximizingVisibility } = payload;
            // Prepare the new businessBulletin document
            const newMaximizingVisibility = new MaximizingVisibility_1.default({
                maximizingVisibility: maximizingVisibility,
                CreatedBy: userId,
            });
            // Save the document
            yield newMaximizingVisibility.save();
            return newMaximizingVisibility;
        });
    }
    updateMaximizingVisibility(payload, maximizingVisibilityId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const maximizingVisibility = yield MaximizingVisibility_1.default.findById((0, helper_1.toObjectId)(maximizingVisibilityId));
            if (!maximizingVisibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Maximizing Visibility not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedMaximizingVisibility = (yield MaximizingVisibility_1.default.findByIdAndUpdate(maximizingVisibilityId, updatedPayload, { new: true }).lean());
            return updatedMaximizingVisibility;
        });
    }
    getMaximizingVisibility() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const maximizingVisibility = yield MaximizingVisibility_1.default.find().lean();
            if (!maximizingVisibility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Maximizing Visibility Not Found.");
            }
            // Prepare the response
            const response = maximizingVisibility;
            return response;
        });
    }
}
exports.MaximizingVisibilityService = MaximizingVisibilityService;
