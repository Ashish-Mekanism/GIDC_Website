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
exports.MembershipFormRepository = void 0;
const MembersRegistrastionForm_1 = __importDefault(require("../models/MembersRegistrastionForm"));
class MembershipFormRepository {
    findUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id) {
                throw new Error("User ID is required.");
            }
            return yield MembersRegistrastionForm_1.default.findOne({ userId: user_id });
        });
    }
    findGstNo(gstNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MembersRegistrastionForm_1.default.findOne({ gstNo });
        });
    }
    findAmcTenementNo(amcTenementNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MembersRegistrastionForm_1.default.findOne({ amcTenementNo });
        });
    }
    findudyogAadharNo(udyogAadharNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MembersRegistrastionForm_1.default.findOne({ udyogAadharNo });
        });
    }
    findtorrentServiceNo(torrentServiceNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MembersRegistrastionForm_1.default.findOne({ torrentServiceNo });
        });
    }
    //   async createNewMember(payload: Partial<IBecomeAMemberBody>, user_id: ObjectId): Promise<Partial<IBecomeAMemberBody>> {
    // console.log(payload,"payload");
    //     //const { memberName, plotShedNo, roadNo, companyType, email, phone, mobile, website, productName, companyCategory, gstNo, amcTenementNo, udyogAadharNo } = payload
    //     // const UserId= toObjectId(user_id)
    //     return {
    //       ...payload,
    //       userId: user_id,
    //     };
    //   }
    updateUserByUserId(user_id, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user_id) {
                throw new Error("User ID is required.");
            }
            const user = yield MembersRegistrastionForm_1.default.findOneAndUpdate({
                userId: user_id
            }, { $set: updatedFields }, { new: true });
            return user;
        });
    }
}
exports.MembershipFormRepository = MembershipFormRepository;
