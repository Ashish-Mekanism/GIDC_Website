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
exports.AdminContactUsService = void 0;
const AdminContactUs_1 = __importDefault(require("../../models/AdminContactUs"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const helper_1 = require("../../utils/helper");
class AdminContactUsService {
    createContactUs(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingContact = yield AdminContactUs_1.default.findOne();
            if (existingContact) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "A 'Contact Us' entry already exists. You cannot create another one.");
            }
            const { Address, PhoneNumber, Email, Linkedin, Facebook, Twitter, } = payload;
            // Prepare the new businessBulletin document
            const newBusinessBulletin = new AdminContactUs_1.default({
                Address,
                PhoneNumber,
                Email,
                Linkedin,
                Facebook,
                Twitter,
                CreatedBy: userId,
            });
            // Save the document
            yield newBusinessBulletin.save();
            return newBusinessBulletin;
        });
    }
    getContactUs() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const adminContactUs = yield AdminContactUs_1.default.find().lean();
            if (!adminContactUs) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "A 'Contact Us' Not Found.");
            }
            // Prepare the response
            const response = adminContactUs;
            return response;
        });
    }
    updateContactUs(payload, contactUsId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find existing business card
            const contactUsData = yield AdminContactUs_1.default.findById((0, helper_1.toObjectId)(contactUsId));
            if (!contactUsData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Contact Us not found", {}, false);
            }
            // Update payload
            const updatedPayload = Object.assign({}, payload);
            // Update business card in database
            const updatedContactUs = (yield AdminContactUs_1.default.findByIdAndUpdate(contactUsId, updatedPayload, { new: true }).lean());
            return updatedContactUs;
        });
    }
}
exports.AdminContactUsService = AdminContactUsService;
