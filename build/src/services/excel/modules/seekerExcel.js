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
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const constants_1 = require("../../../utils/constants");
const ApplyJob_1 = __importDefault(require("../../../models/ApplyJob"));
class SeekerExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Seekeers';
        this.fileService = new fileService_1.default();
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate } = filters;
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
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const { resume, careerOpportunityId } = data;
        const getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.RESUME, [
                    constants_1.FOLDER_NAMES.RESUME,
                    fileName,
                ])
                : '';
        };
        return {
            SeekerID: (_a = data._id) !== null && _a !== void 0 ? _a : '',
            Name: (_b = data.name) !== null && _b !== void 0 ? _b : '',
            Email: (_c = data.email) !== null && _c !== void 0 ? _c : '',
            ContactNo: (_d = data.contactNo) !== null && _d !== void 0 ? _d : '',
            CurrentAddress: (_e = data.currentAddress) !== null && _e !== void 0 ? _e : '',
            Resume: getFile(resume),
            JobId: (_f = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId._id) !== null && _f !== void 0 ? _f : '',
            AppliedJobTitle: (_g = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.jobTitle) !== null && _g !== void 0 ? _g : '',
            JobType: (_h = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.jobType) !== null && _h !== void 0 ? _h : '',
            JobLocation: (_j = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.jobLocation) !== null && _j !== void 0 ? _j : '',
            CompanyAddress: (_k = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.companyAddress) !== null && _k !== void 0 ? _k : '',
            AssociationName: (_l = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.associationName) !== null && _l !== void 0 ? _l : '',
            JobIndustry: (_m = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.jobIndustry) !== null && _m !== void 0 ? _m : '',
            EmployerEmail: (_o = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.email) !== null && _o !== void 0 ? _o : '',
            ApplicationDeadline: (_p = careerOpportunityId === null || careerOpportunityId === void 0 ? void 0 : careerOpportunityId.applicationDeadline) !== null && _p !== void 0 ? _p : '',
            AppliedAt: (_q = data.createdAt) !== null && _q !== void 0 ? _q : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const seekers = yield ApplyJob_1.default.find(matchStage)
                .populate('careerOpportunityId')
                .lean();
            const rows = seekers.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'Seeker ID', key: 'SeekerID', width: 25 },
                { header: 'Name', key: 'Name', width: 20 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Contact No', key: 'ContactNo', width: 15 },
                { header: 'Current Address', key: 'CurrentAddress', width: 30 },
                { header: 'Resume', key: 'Resume', width: 40 },
                {
                    header: 'Job Id',
                    key: 'JobId',
                    width: 40,
                },
                { header: 'Job Title', key: 'AppliedJobTitle', width: 25 },
                { header: 'Job Type', key: 'JobType', width: 15 },
                { header: 'Job Location', key: 'JobLocation', width: 15 },
                { header: 'Company Address', key: 'CompanyAddress', width: 25 },
                { header: 'Association Name', key: 'AssociationName', width: 35 },
                { header: 'Job Industry', key: 'JobIndustry', width: 25 },
                { header: 'Employer Email', key: 'EmployerEmail', width: 30 },
                { header: 'Application Deadline', key: 'ApplicationDeadline', width: 20 },
                { header: 'Applied At', key: 'AppliedAt', width: 20 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = SeekerExcel;
