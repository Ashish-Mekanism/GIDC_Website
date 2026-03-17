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
exports.AboutService = void 0;
const About_1 = __importDefault(require("../../models/About"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const helper_1 = require("../../utils/helper");
class AboutService {
    createAbout(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Paragraph1, Paragraph2, Paragraph3 } = payload;
            const aboutExist = yield About_1.default.findOne();
            if (aboutExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'About' entry already exists. You cannot create another one.");
            }
            // Validate required fields
            // if (!Paragraph1 || !Paragraph2) {
            //     throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title and Description are mandatory.");
            // }
            // Prepare the new PresidentMessage document
            const newAbout = new About_1.default({
                Paragraph1,
                Paragraph2,
                Paragraph3,
                CreatedBy: userId,
            });
            // Save the document
            yield newAbout.save();
            return newAbout;
        });
    }
    updateAbout(payload, aboutId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const contactUsData = yield About_1.default.findById((0, helper_1.toObjectId)(aboutId));
            if (!contactUsData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "About not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedAbout = (yield About_1.default.findByIdAndUpdate(aboutId, updatedPayload, { new: true }).lean());
            return updatedAbout;
        });
    }
    getAbout() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const about = yield About_1.default.find().lean();
            if (!about) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'About' Not Found.");
            }
            // Prepare the response
            const response = about;
            return response;
        });
    }
}
exports.AboutService = AboutService;
