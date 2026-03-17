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
const DownloadAndCircular_1 = __importDefault(require("../../../models/DownloadAndCircular"));
class AllCirculars extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Circulars';
        this.fileService = new fileService_1.default();
        this.getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.CIRCULAR, [constants_1.FOLDER_NAMES.CIRCULAR, fileName])
                : '';
        };
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            ID: (_a = data === null || data === void 0 ? void 0 : data._id) !== null && _a !== void 0 ? _a : '',
            Heading: (_b = data === null || data === void 0 ? void 0 : data.Heading) !== null && _b !== void 0 ? _b : '',
            Description: (_c = data === null || data === void 0 ? void 0 : data.Description) !== null && _c !== void 0 ? _c : '',
            Date: (_f = (_e = (_d = new Date(data === null || data === void 0 ? void 0 : data.Date)) === null || _d === void 0 ? void 0 : _d.toISOString()) === null || _e === void 0 ? void 0 : _e.split('T')[0]) !== null && _f !== void 0 ? _f : '',
            Active: data.active ? 'Active' : 'Inactive',
            CreatedAt: data.createdAt
                ? (_h = (_g = new Date(data.createdAt)) === null || _g === void 0 ? void 0 : _g.toISOString()) === null || _h === void 0 ? void 0 : _h.split('T')[0]
                : '',
            UpdatedAt: data.updatedAt
                ? (_k = (_j = new Date(data.updatedAt)) === null || _j === void 0 ? void 0 : _j.toISOString()) === null || _k === void 0 ? void 0 : _k.split('T')[0]
                : '',
            Document: (data === null || data === void 0 ? void 0 : data.Document) ? this.getFile(data.Document) : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            console.log("matchStage", matchStage);
            const eventAttendees = yield DownloadAndCircular_1.default.find(matchStage).lean();
            const rows = eventAttendees.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 24 },
                { header: 'Heading', key: 'Heading', width: 30 },
                { header: 'Description', key: 'Description', width: 50 },
                { header: 'Date', key: 'Date', width: 15 },
                { header: 'Active', key: 'Active', width: 15 },
                { header: 'Created At', key: 'CreatedAt', width: 20 },
                { header: 'Updated At', key: 'UpdatedAt', width: 20 },
                { header: 'Document', key: 'Document', width: 50 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = AllCirculars;
