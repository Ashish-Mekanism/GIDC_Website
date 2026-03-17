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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreFilledDataService = void 0;
const MembersRegistrastionForm_1 = __importDefault(require("../models/MembersRegistrastionForm"));
class PreFilledDataService {
    // async getPreFilledData(userId: ObjectId): Promise<any> {
    //   const preFilledData = await MembershipModel.find(
    //     { userId: userId },
    //     'userId membership_Id memberCompanyName plotShedNo roadNo gstNo companyType email phone mobile propertyDetails user_name'
    //   ).lean();
    //   return preFilledData?.map(pre => {
    //     const waterConnectionNo = ['undefined', null, 'null'].includes(
    //       pre?.propertyDetails?.[0]?.waterConnectionNo?.toString()
    //     )
    //       ? null
    //       : pre?.propertyDetails?.[0]?.waterConnectionNo;
    //     const gstNo = ['undefined', null, 'null'].includes(pre?.gstNo?.toString())
    //       ? null
    //       : pre?.gstNo?.toString();
    //     const { propertyDetails, user_name ,...rest} = pre;
    //     return {
    //       ...rest,
    //       user_name,
    //       waterConnectionNo,
    //       gstNo,
    //     };
    //   });
    // }
    getPreFilledData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const preFilledData = yield MembersRegistrastionForm_1.default.find({ userId }, 'userId membership_Id memberCompanyName plotShedNo roadNo gstNo companyType email phone mobile propertyDetails')
                .populate('userId', 'user_name') // ✅ fetch user_name from User model
                .lean();
            return preFilledData === null || preFilledData === void 0 ? void 0 : preFilledData.map(pre => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const waterConnectionNo = ['undefined', null, 'null'].includes((_c = (_b = (_a = pre === null || pre === void 0 ? void 0 : pre.propertyDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.waterConnectionNo) === null || _c === void 0 ? void 0 : _c.toString())
                    ? null
                    : (_e = (_d = pre === null || pre === void 0 ? void 0 : pre.propertyDetails) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.waterConnectionNo;
                const gstNo = ['undefined', null, 'null'].includes((_f = pre === null || pre === void 0 ? void 0 : pre.gstNo) === null || _f === void 0 ? void 0 : _f.toString())
                    ? null
                    : (_g = pre === null || pre === void 0 ? void 0 : pre.gstNo) === null || _g === void 0 ? void 0 : _g.toString();
                const { propertyDetails } = pre, rest = __rest(pre, ["propertyDetails"]);
                return Object.assign(Object.assign({}, rest), { user_name: ((_h = pre.userId) === null || _h === void 0 ? void 0 : _h.user_name) || null, // ✅ safely attach user_name
                    waterConnectionNo,
                    gstNo });
            });
        });
    }
}
exports.PreFilledDataService = PreFilledDataService;
