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
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const BookEvent_1 = __importDefault(require("../../../models/BookEvent"));
class EventAttendeesExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Event Attendees';
        this.fileService = new fileService_1.default();
        this.getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.BOOKINGTRANSACTION, [constants_1.FOLDER_NAMES.BOOKINGTRANSACTION, fileName])
                : '';
        };
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate, eventId } = filters;
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
            if (eventId) {
                matchStage.eventId = eventId;
            }
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const { transactionPhoto } = data;
        return {
            ID: (_a = data === null || data === void 0 ? void 0 : data._id) !== null && _a !== void 0 ? _a : '',
            EventID: (_b = data === null || data === void 0 ? void 0 : data.eventId) !== null && _b !== void 0 ? _b : '',
            EventDate: (_c = data === null || data === void 0 ? void 0 : data.eventDate) !== null && _c !== void 0 ? _c : '',
            Name: (_d = data === null || data === void 0 ? void 0 : data.name) !== null && _d !== void 0 ? _d : '',
            Email: (_e = data === null || data === void 0 ? void 0 : data.email) !== null && _e !== void 0 ? _e : '',
            Phone: (_f = data === null || data === void 0 ? void 0 : data.phone) !== null && _f !== void 0 ? _f : '',
            CompanyName: (_g = data === null || data === void 0 ? void 0 : data.companyName) !== null && _g !== void 0 ? _g : '',
            Comment: (_h = data === null || data === void 0 ? void 0 : data.comment) !== null && _h !== void 0 ? _h : '',
            TransactionID: (_j = data === null || data === void 0 ? void 0 : data.transactionId) !== null && _j !== void 0 ? _j : '',
            TransactionPhoto: transactionPhoto ? this.getFile(transactionPhoto) : '',
            Status: (_k = data === null || data === void 0 ? void 0 : data.status) !== null && _k !== void 0 ? _k : '',
            PersonCount: (_l = data === null || data === void 0 ? void 0 : data.personCount) !== null && _l !== void 0 ? _l : '',
            CreatedAt: (_m = data === null || data === void 0 ? void 0 : data.createdAt) !== null && _m !== void 0 ? _m : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const eventId = filters === null || filters === void 0 ? void 0 : filters.eventId;
            if (eventId && !(0, mongoose_1.isValidObjectId)(eventId)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid Event Id');
            }
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const eventAttendees = yield BookEvent_1.default.find(matchStage).lean();
            const rows = eventAttendees.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 24 },
                { header: 'Event ID', key: 'EventID', width: 24 },
                { header: 'Event Date', key: 'EventDate', width: 20 },
                { header: 'Name', key: 'Name', width: 25 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Phone', key: 'Phone', width: 20 },
                { header: 'Company Name', key: 'CompanyName', width: 30 },
                { header: 'Comment', key: 'Comment', width: 40 },
                { header: 'Transaction ID', key: 'TransactionID', width: 30 },
                { header: 'Transaction Photo', key: 'TransactionPhoto', width: 40 },
                { header: 'Status', key: 'Status', width: 20 },
                { header: 'Person Count', key: 'PersonCount', width: 15 },
                { header: 'Created At', key: 'CreatedAt', width: 25 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = EventAttendeesExcel;
