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
const Sponsorship_1 = __importDefault(require("../../../models/Sponsorship"));
class SponsorshipExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Sponsorships';
        this.fileService = new fileService_1.default();
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
            if (approved && !isNaN(+approved)) {
                matchStage.Approved = +approved;
            }
            if (active) {
                matchStage.Active = active === 'true' ? true : false;
            }
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.SPONSORSHIP, [
                    constants_1.FOLDER_NAMES.SPONSORSHIP,
                    fileName,
                ])
                : '';
        };
        return {
            SponsorshipID: (_a = data._id) !== null && _a !== void 0 ? _a : '',
            CreatedBy: (_b = data.CreatedBy) !== null && _b !== void 0 ? _b : '',
            Name: (_c = data.Name) !== null && _c !== void 0 ? _c : '',
            Email: (_d = data.Email) !== null && _d !== void 0 ? _d : '',
            Phone: (_e = data.Phone) !== null && _e !== void 0 ? _e : '',
            Note: (_f = data.Note) !== null && _f !== void 0 ? _f : '',
            Approved: data.Approved === 0
                ? 'Pending'
                : data.Approved === 1
                    ? 'Approved'
                    : 'Declined',
            Active: data.Active ? 'Active' : 'Inactive',
            StartDate: (_g = data.StartDate) !== null && _g !== void 0 ? _g : '',
            EndDate: (_h = data.EndDate) !== null && _h !== void 0 ? _h : '',
            Amount: (_j = data.Amount) !== null && _j !== void 0 ? _j : '',
            Url: (_k = data.Url) !== null && _k !== void 0 ? _k : '',
            Photo: getFile(data.Photo),
            CreatedAt: (_l = data.createdAt) !== null && _l !== void 0 ? _l : '',
            UpdatedAt: (_m = data.updatedAt) !== null && _m !== void 0 ? _m : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const sponsorships = yield Sponsorship_1.default.find(matchStage).lean();
            const rows = sponsorships.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'Sponsorship ID', key: 'SponsorshipID', width: 25 },
                { header: 'Created By', key: 'CreatedBy', width: 25 },
                { header: 'Name', key: 'Name', width: 25 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Phone', key: 'Phone', width: 15 },
                { header: 'Note', key: 'Note', width: 40 },
                { header: 'Approved Status', key: 'Approved', width: 15 },
                { header: 'Active Status', key: 'Active', width: 15 },
                { header: 'Start Date', key: 'StartDate', width: 20 },
                { header: 'End Date', key: 'EndDate', width: 20 },
                { header: 'Amount', key: 'Amount', width: 15 },
                { header: 'Website URL', key: 'Url', width: 40 },
                { header: 'Photo Path', key: 'Photo', width: 40 },
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
exports.default = SponsorshipExcel;
