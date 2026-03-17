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
const Complaint_1 = __importDefault(require("../../../models/Complaint"));
const ServiceCategory_1 = __importDefault(require("../../../models/ServiceCategory"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const excelService_1 = __importDefault(require("../base/excelService"));
class ServiceRequestsExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = "ServiceRequests";
    }
    getServiceRequestFilters(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { key, status, fromDate, toDate } = filters;
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const allServiceCategories = yield ServiceCategory_1.default.find({}).lean();
            const defaultKeys = constants_1.DEFAULT_SERVICE_CATEGORIES.map((cat) => cat.key);
            const matchStage = {};
            // Date Filter
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            const statusFilters = [
                { status: { $ne: constants_1.COMPLAINT_STATUS.DELETED } },
            ];
            if (status === ((_a = constants_1.COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED) === null || _a === void 0 ? void 0 : _a.toString())) {
                statusFilters.push({
                    status: { $in: [constants_1.COMPLAINT_STATUS.PENDING, constants_1.COMPLAINT_STATUS.ASSIGN] },
                });
            }
            else if (status === ((_b = constants_1.COMPLAINT_STATUS_QUERY.COMPLETED) === null || _b === void 0 ? void 0 : _b.toString())) {
                statusFilters.push({
                    status: { $eq: constants_1.COMPLAINT_STATUS.COMPLETED },
                });
            }
            if (statusFilters.length > 1) {
                // APPLY FILTER WITH DELETE AND STATUS
                matchStage.$and = statusFilters;
            }
            else {
                // APPLY ONLY DELETE FILTER IF NOT STATUS
                Object.assign(matchStage, statusFilters[0]);
            }
            // Key Filter
            // If key is passed and it's "others"
            if (key === "others") {
                const nonOtherCategoryIds = allServiceCategories
                    .filter((cat) => defaultKeys.includes(cat.key))
                    .map((cat) => cat._id);
                matchStage.$or = [
                    { serviceCategory: { $exists: false } },
                    { serviceCategory: { $nin: nonOtherCategoryIds } },
                ];
            }
            else if (key && defaultKeys.includes(key)) {
                const matchedCategory = allServiceCategories.find((cat) => cat.key === key);
                if (matchedCategory) {
                    matchStage.serviceCategory = matchedCategory._id;
                }
            }
            return matchStage;
        });
    }
    mapComplaintToRow(complaint) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        return {
            ID: (_a = complaint === null || complaint === void 0 ? void 0 : complaint._id) !== null && _a !== void 0 ? _a : "",
            UserID: (_b = complaint === null || complaint === void 0 ? void 0 : complaint.userId) !== null && _b !== void 0 ? _b : "",
            Email: (_c = complaint === null || complaint === void 0 ? void 0 : complaint.email) !== null && _c !== void 0 ? _c : "",
            Mobile: (_d = complaint === null || complaint === void 0 ? void 0 : complaint.mobile) !== null && _d !== void 0 ? _d : "",
            Phone: (_e = complaint === null || complaint === void 0 ? void 0 : complaint.phone) !== null && _e !== void 0 ? _e : "",
            ComplaintPhotos: (_f = complaint === null || complaint === void 0 ? void 0 : complaint.complaint_photo) === null || _f === void 0 ? void 0 : _f.join(", "),
            CompanyName: (_g = complaint === null || complaint === void 0 ? void 0 : complaint.companyName) !== null && _g !== void 0 ? _g : "",
            PersonName: (_h = complaint === null || complaint === void 0 ? void 0 : complaint.personName) !== null && _h !== void 0 ? _h : "",
            RoadNo: (_j = complaint === null || complaint === void 0 ? void 0 : complaint.roadNo) !== null && _j !== void 0 ? _j : "",
            Address: (_k = complaint === null || complaint === void 0 ? void 0 : complaint.address) !== null && _k !== void 0 ? _k : "",
            ServiceCategoryID: (_m = (_l = complaint.serviceCategory) === null || _l === void 0 ? void 0 : _l._id) !== null && _m !== void 0 ? _m : "",
            ServiceCategoryKey: (_p = (_o = complaint.serviceCategory) === null || _o === void 0 ? void 0 : _o.key) !== null && _p !== void 0 ? _p : "",
            ServiceCategoryName: (_r = (_q = complaint.serviceCategory) === null || _q === void 0 ? void 0 : _q.ServiceCategoryName) !== null && _r !== void 0 ? _r : complaint.ServiceCategoryName,
            ServiceDetails: (_s = complaint === null || complaint === void 0 ? void 0 : complaint.serviceDetails) !== null && _s !== void 0 ? _s : "",
            Status: (_t = complaint === null || complaint === void 0 ? void 0 : complaint.status) !== null && _t !== void 0 ? _t : "",
            WaterConnectionNo: (_u = complaint === null || complaint === void 0 ? void 0 : complaint.waterConnectionNo) !== null && _u !== void 0 ? _u : "",
            CreatedAt: (_v = complaint.createdAt) !== null && _v !== void 0 ? _v : "",
            UpdatedAt: (_w = complaint.updatedAt) !== null && _w !== void 0 ? _w : "",
            ServiceNumber: (_x = complaint === null || complaint === void 0 ? void 0 : complaint.serviceNumber) !== null && _x !== void 0 ? _x : "",
            ContractorID: (_z = (_y = complaint.assignContractor) === null || _y === void 0 ? void 0 : _y._id) !== null && _z !== void 0 ? _z : "",
            ContractorName: (_1 = (_0 = complaint.assignContractor) === null || _0 === void 0 ? void 0 : _0.ContractorName) !== null && _1 !== void 0 ? _1 : "",
            ContractorEmail: (_3 = (_2 = complaint.assignContractor) === null || _2 === void 0 ? void 0 : _2.ContractorEmail) !== null && _3 !== void 0 ? _3 : "",
            AssignedContractorAt: (_4 = complaint.assignedContractorAt) !== null && _4 !== void 0 ? _4 : "",
            CompletedServiceAt: (_5 = complaint.completedServiceAt) !== null && _5 !== void 0 ? _5 : "",
            isCreatedByAdmin: true,
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters, }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getServiceRequestFilters(filters)) || {};
            const complaints = yield Complaint_1.default.find(matchStage)
                .populate("serviceCategory assignContractor")
                .lean();
            const rows = complaints.map(this.mapComplaintToRow);
            this.setColumns(sheet, [
                { header: "Service Number", key: "ServiceNumber", width: 20 },
                { header: "Email", key: "Email", width: 25 },
                { header: "Mobile", key: "Mobile", width: 15 },
                { header: "Phone", key: "Phone", width: 15 },
                { header: "Name", key: "PersonName", width: 25 },
                { header: "Company", key: "CompanyName", width: 30 },
                { header: "Road No", key: "RoadNo", width: 10 },
                { header: "Address", key: "Address", width: 30 },
                { header: "Water Connection No", key: "WaterConnectionNo", width: 20 },
                { header: "Service Category", key: "ServiceCategoryName", width: 20 },
                { header: "Service Details", key: "ServiceDetails", width: 40 },
                { header: "Status", key: "Status", width: 12 },
                { header: "Created At", key: "CreatedAt", width: 20 },
                {
                    header: "Assigned Contractor At",
                    key: "AssignedContractorAt",
                    width: 20,
                },
                { header: "Completed At", key: "CompletedServiceAt", width: 20 },
                { header: "Contractor Name", key: "ContractorName", width: 25 },
                { header: "Contractor Email", key: "ContractorEmail", width: 25 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=complaints.xlsx");
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = ServiceRequestsExcel;
