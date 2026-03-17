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
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
class AppliedJobsExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'AppliedJobs';
        this.fileService = new fileService_1.default();
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate, careerOpportunityId } = filters;
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
            if (careerOpportunityId) {
                matchStage.careerOpportunityId = careerOpportunityId;
            }
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { resume } = data;
        const getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.RESUME, [
                    constants_1.FOLDER_NAMES.RESUME,
                    fileName,
                ])
                : '';
        };
        return {
            ID: (_a = data === null || data === void 0 ? void 0 : data._id) !== null && _a !== void 0 ? _a : '',
            CareerOpportunityID: (_b = data === null || data === void 0 ? void 0 : data.careerOpportunityId) !== null && _b !== void 0 ? _b : '',
            Name: (_c = data === null || data === void 0 ? void 0 : data.name) !== null && _c !== void 0 ? _c : '',
            Email: (_d = data === null || data === void 0 ? void 0 : data.email) !== null && _d !== void 0 ? _d : '',
            IndustryJob: (_e = data === null || data === void 0 ? void 0 : data.industryJob) !== null && _e !== void 0 ? _e : '',
            ContactNo: (_f = data === null || data === void 0 ? void 0 : data.contactNo) !== null && _f !== void 0 ? _f : '',
            CurrentAddress: (_g = data === null || data === void 0 ? void 0 : data.currentAddress) !== null && _g !== void 0 ? _g : '',
            ResumeFile: getFile(resume),
            CreatedAt: (_h = data === null || data === void 0 ? void 0 : data.createdAt) !== null && _h !== void 0 ? _h : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const careerOpportunityId = filters === null || filters === void 0 ? void 0 : filters.careerOpportunityId;
            if (careerOpportunityId && !(0, mongoose_1.isValidObjectId)(careerOpportunityId)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid Career Opportunity Id');
            }
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const jobs = yield ApplyJob_1.default.find(matchStage).lean();
            const rows = jobs.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 20 },
                {
                    header: 'Career Opportunity ID',
                    key: 'CareerOpportunityID',
                    width: 25,
                },
                { header: 'Name', key: 'Name', width: 25 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Industry Job', key: 'IndustryJob', width: 25 },
                { header: 'Contact No', key: 'ContactNo', width: 20 },
                { header: 'Current Address', key: 'CurrentAddress', width: 40 },
                { header: 'Resume File', key: 'ResumeFile', width: 40 },
                { header: 'Created At', key: 'CreatedAt', width: 20 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = AppliedJobsExcel;
