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
exports.OurMissionService = void 0;
const constants_1 = require("../../utils/constants");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const helper_1 = require("../../utils/helper");
const OurMission_1 = __importDefault(require("../../models/OurMission"));
class OurMissionService {
    createOurMission(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingOurMission = yield OurMission_1.default.findOne();
            if (existingOurMission) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Our Mission' entry already exists. You cannot create another one.");
            }
            const { MissionDescription, Mission } = payload;
            // Prepare the new businessBulletin document
            const newOurMission = new OurMission_1.default({
                MissionDescription,
                Mission,
                CreatedBy: userId,
            });
            // Save the document
            yield newOurMission.save();
            return newOurMission;
        });
    }
    updateOurMission(payload, ourMissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const ourMission = yield OurMission_1.default.findById((0, helper_1.toObjectId)(ourMissionId));
            if (!ourMission) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Our Mission not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedOurMission = (yield OurMission_1.default.findByIdAndUpdate(ourMissionId, updatedPayload, { new: true }).lean());
            return updatedOurMission;
        });
    }
    getOurMission() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const ourMission = yield OurMission_1.default.find().lean();
            if (!ourMission) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Our Mission Not Found.");
            }
            // Prepare the response
            const response = ourMission;
            return response;
        });
    }
}
exports.OurMissionService = OurMissionService;
