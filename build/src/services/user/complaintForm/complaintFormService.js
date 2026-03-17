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
exports.ComplaintFormService = void 0;
const membershipFormRepository_1 = require("../../../repository/membershipFormRepository");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const Complaint_1 = __importDefault(require("../../../models/Complaint"));
const User_1 = __importDefault(require("../../../models/User"));
const MembersRegistrastionForm_1 = __importDefault(require("../../../models/MembersRegistrastionForm"));
const ServiceCategory_1 = __importDefault(require("../../../models/ServiceCategory"));
const emailService_1 = require("../../emailService");
class ComplaintFormService {
    constructor() {
        this.membershipFormRepository = new membershipFormRepository_1.MembershipFormRepository();
        this.sendEmailTemplateMail = new emailService_1.SendEmailTemplateMail();
    }
    createComplaint(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const photoFilenames = files && files.length > 0
                ? files.map((file) => file.filename)
                : [];
            //Check userid exist
            const UserExist = yield User_1.default.findById(user_id);
            if (!UserExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, "User does not exist", {}, false);
            }
            if (!(payload === null || payload === void 0 ? void 0 : payload.waterConnectionNo)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, "Water Connection Number is required", {}, false);
            }
            const membershipExist = yield MembersRegistrastionForm_1.default.findOne({ userId: user_id });
            const serviceCategory = yield ServiceCategory_1.default.findById(payload.serviceCategory);
            const updatedPayload = Object.assign(Object.assign({}, payload), { userId: user_id, complaint_photo: photoFilenames, status: constants_1.COMPLAINT_STATUS.PENDING, membershipNo: membershipExist === null || membershipExist === void 0 ? void 0 : membershipExist.membership_Id, ServiceCategoryName: serviceCategory === null || serviceCategory === void 0 ? void 0 : serviceCategory.ServiceCategoryName, isCreatedByAdmin: false });
            const complaint = new Complaint_1.default(updatedPayload);
            const raisedComplaint = yield complaint.save();
            yield this.sendEmailTemplateMail.sendServiceRequestEmailToUser((_a = raisedComplaint === null || raisedComplaint === void 0 ? void 0 : raisedComplaint._id) === null || _a === void 0 ? void 0 : _a.toString(), constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER);
            yield this.sendEmailTemplateMail.sendServiceRequestEmailToAdminAndContractors((_b = raisedComplaint === null || raisedComplaint === void 0 ? void 0 : raisedComplaint._id) === null || _b === void 0 ? void 0 : _b.toString());
            return raisedComplaint;
        });
    }
    createComplaintByAdmin(payload, adminId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const photoFilenames = files && files.length > 0
                ? files.map((file) => file.filename)
                : [];
            if (!(payload === null || payload === void 0 ? void 0 : payload.waterConnectionNo)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, "Water Connection Number is required", {}, false);
            }
            // const membershipExist = await MembershipModel.findOne({ userId: user_id });
            const serviceCategory = yield ServiceCategory_1.default.findById(payload.serviceCategory);
            const updatedPayload = Object.assign(Object.assign({}, payload), { complaint_photo: photoFilenames, status: constants_1.COMPLAINT_STATUS.PENDING, membershipNo: payload === null || payload === void 0 ? void 0 : payload.membershipNo, ServiceCategoryName: serviceCategory === null || serviceCategory === void 0 ? void 0 : serviceCategory.ServiceCategoryName, isCreatedByAdmin: true, isExported: true, createdByAdminId: adminId });
            console.log(updatedPayload, 'updatedPayload');
            const complaint = new Complaint_1.default(updatedPayload);
            const raisedComplaint = yield complaint.save();
            yield this.sendEmailTemplateMail.sendServiceRequestEmailToUser((_a = raisedComplaint === null || raisedComplaint === void 0 ? void 0 : raisedComplaint._id) === null || _a === void 0 ? void 0 : _a.toString(), constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER);
            yield this.sendEmailTemplateMail.sendServiceRequestEmailToAdminAndContractors((_b = raisedComplaint === null || raisedComplaint === void 0 ? void 0 : raisedComplaint._id) === null || _b === void 0 ? void 0 : _b.toString());
            return raisedComplaint;
        });
    }
}
exports.ComplaintFormService = ComplaintFormService;
