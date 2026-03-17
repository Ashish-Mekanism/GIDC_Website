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
exports.AdminBusinessCardService = void 0;
const BusinessCard_1 = __importDefault(require("../../../models/BusinessCard"));
const MembersRegistrastionForm_1 = __importDefault(require("../../../models/MembersRegistrastionForm"));
const User_1 = __importDefault(require("../../../models/User"));
class AdminBusinessCardService {
    getBusinessCardList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all business cards
            const businessCards = yield BusinessCard_1.default.find();
            if (!businessCards.length) {
                return { message: "No business cards found." };
            }
            // Group business cards by userId
            const userIds = [...new Set(businessCards.map(card => card.userId.toString()))];
            // Fetch user details
            const users = yield User_1.default.find({ _id: { $in: userIds } });
            const userMap = new Map(users.map(user => [user._id.toString(), user.email]));
            // Fetch membership details
            const memberships = yield MembersRegistrastionForm_1.default.find({ userId: { $in: userIds } });
            const membershipMap = new Map(memberships.map(mem => [mem.userId.toString(), mem.membership_Id]));
            // Prepare the response
            return userIds.map(userId => {
                const businessCard = businessCards.find(card => card.userId.toString() === userId);
                return {
                    businessCardId: businessCard === null || businessCard === void 0 ? void 0 : businessCard._id,
                    userEmail: userMap.get(userId) || null,
                    userId: businessCard === null || businessCard === void 0 ? void 0 : businessCard.userId,
                    membershipId: membershipMap.get(userId) || null
                };
            });
        });
    }
    createBusinessCardAdmin(payload, user_id, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileImage = file ? file.filename : null;
            const updatedPayload = Object.assign(Object.assign({}, payload), { userId: user_id, created_by: user_id, profilePhoto: profileImage, active: true });
            console.log(updatedPayload, "updatedPayload");
            return yield BusinessCard_1.default.create(updatedPayload);
        });
    }
}
exports.AdminBusinessCardService = AdminBusinessCardService;
