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
const helper_1 = require("../../../utils/helper");
const excelService_1 = __importDefault(require("../base/excelService"));
const CareerOpportunity_1 = __importDefault(require("../../../models/CareerOpportunity"));
const constants_1 = require("../../../utils/constants");
class CareerOpportunityExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'OpportunityRequests';
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate, approved, active } = filters;
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const matchStage = {};
            // Date Filter
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            if (approved !== '' && !isNaN(Number(approved))) {
                matchStage.approveStatus = Number(approved);
            }
            if (['true', 'false', true, false].includes(active)) {
                matchStage.active = active === true || active === 'true';
            }
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return {
            JobID: (_a = data._id) !== null && _a !== void 0 ? _a : '',
            JobTitle: (_b = data.jobTitle) !== null && _b !== void 0 ? _b : '',
            JobType: (_c = data.jobType) !== null && _c !== void 0 ? _c : '',
            JobDescription: (_d = data.jobDescription) !== null && _d !== void 0 ? _d : '',
            JobLocation: (_e = data.jobLocation) !== null && _e !== void 0 ? _e : '',
            CompanyAddress: (_f = data.companyAddress) !== null && _f !== void 0 ? _f : '',
            AssociationName: (_g = data.associationName) !== null && _g !== void 0 ? _g : '',
            JobIndustry: (_h = data.jobIndustry) !== null && _h !== void 0 ? _h : '',
            EmployerEmail: (_j = data.email) !== null && _j !== void 0 ? _j : '',
            ApplicationDeadline: data.applicationDeadline
                ? (_l = (_k = new Date(data.applicationDeadline)) === null || _k === void 0 ? void 0 : _k.toISOString()) === null || _l === void 0 ? void 0 : _l.split('T')[0]
                : '',
            ApproveStatus: data.approveStatus === constants_1.JOB_POSTING_STATUS.APPROVED
                ? 'Approved'
                : data.approveStatus === constants_1.JOB_POSTING_STATUS.PENDING
                    ? 'Pending'
                    : 'Declined',
            Active: data.active ? 'Active' : 'Inactive',
            CreatedAt: data.createdAt
                ? (_o = (_m = new Date(data.createdAt)) === null || _m === void 0 ? void 0 : _m.toISOString()) === null || _o === void 0 ? void 0 : _o.split('T')[0]
                : '',
            UpdatedAt: data.updatedAt
                ? (_q = (_p = new Date(data.updatedAt)) === null || _p === void 0 ? void 0 : _p.toISOString()) === null || _q === void 0 ? void 0 : _q.split('T')[0]
                : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const careerOpportunity = yield CareerOpportunity_1.default.find(matchStage);
            const rows = careerOpportunity.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'Job ID', key: 'JobID', width: 25 },
                { header: 'Job Title', key: 'JobTitle', width: 30 },
                { header: 'Job Type', key: 'JobType', width: 20 },
                { header: 'Job Description', key: 'JobDescription', width: 50 },
                { header: 'Job Location', key: 'JobLocation', width: 20 },
                { header: 'Company Address', key: 'CompanyAddress', width: 40 },
                { header: 'Association Name', key: 'AssociationName', width: 40 },
                { header: 'Job Industry', key: 'JobIndustry', width: 25 },
                { header: 'Employer Email', key: 'EmployerEmail', width: 30 },
                { header: 'Application Deadline', key: 'ApplicationDeadline', width: 20 },
                { header: 'Approve Status', key: 'ApproveStatus', width: 15 },
                { header: 'Active', key: 'Active', width: 12 },
                { header: 'Created At', key: 'CreatedAt', width: 20 },
                { header: 'Updated At', key: 'UpdatedAt', width: 20 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = CareerOpportunityExcel;
