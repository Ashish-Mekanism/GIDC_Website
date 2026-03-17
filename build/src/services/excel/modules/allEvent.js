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
const Event_1 = __importDefault(require("../../../models/Event"));
const dayjs_1 = __importDefault(require("dayjs"));
class AllEvent extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.fileService = new fileService_1.default();
        this.getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.EVENT, [constants_1.FOLDER_NAMES.EVENT, fileName])
                : '';
        };
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate, type } = filters;
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const matchStage = {};
            // Date Filter
            if (fromDate || toDate) {
                matchStage.Date = {};
                if (fromDate)
                    matchStage.Date.$gte = fromDate;
                if (toDate)
                    matchStage.Date.$lte = toDate;
            }
            // Event type filters
            const today = (0, dayjs_1.default)().startOf('day').toDate();
            if (type === 'upcoming') {
                matchStage.Date = { $gte: today };
            }
            else if (type === 'past') {
                matchStage.Date = { $lt: today };
            }
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            ID: (_a = data === null || data === void 0 ? void 0 : data._id) !== null && _a !== void 0 ? _a : '',
            EventDate: (_b = data === null || data === void 0 ? void 0 : data.Date) !== null && _b !== void 0 ? _b : '',
            Title: (_c = data === null || data === void 0 ? void 0 : data.EventTitle) !== null && _c !== void 0 ? _c : '',
            Description: (_d = data === null || data === void 0 ? void 0 : data.Description) !== null && _d !== void 0 ? _d : '',
            StartTime: (_e = data === null || data === void 0 ? void 0 : data.StartTime) !== null && _e !== void 0 ? _e : '',
            EndTime: (_f = data === null || data === void 0 ? void 0 : data.EndTime) !== null && _f !== void 0 ? _f : '',
            Registration: (_g = data === null || data === void 0 ? void 0 : data.Registration) !== null && _g !== void 0 ? _g : '',
            Speaker: (_h = data === null || data === void 0 ? void 0 : data.Speaker) !== null && _h !== void 0 ? _h : '',
            Photo: (data === null || data === void 0 ? void 0 : data.Photo) ? this.getFile(data.Photo) : '',
            Capacity: (_j = data === null || data === void 0 ? void 0 : data.Capacity) !== null && _j !== void 0 ? _j : '',
            Location: (_k = data === null || data === void 0 ? void 0 : data.Location) !== null && _k !== void 0 ? _k : '',
            Fee: (_l = data === null || data === void 0 ? void 0 : data.Fee) !== null && _l !== void 0 ? _l : '',
            CreatedAt: (_m = data === null || data === void 0 ? void 0 : data.createdAt) !== null && _m !== void 0 ? _m : '',
            UpdatedAt: (_o = data === null || data === void 0 ? void 0 : data.updatedAt) !== null && _o !== void 0 ? _o : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            // Set worksheet name dynamically based on type
            let workSheetName = 'All Event';
            if ((filters === null || filters === void 0 ? void 0 : filters.type) === 'upcoming')
                workSheetName = 'Upcoming Event';
            else if ((filters === null || filters === void 0 ? void 0 : filters.type) === 'past')
                workSheetName = 'Past Event';
            const sheet = this.createWorksheet(workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            console.log("matchStage", matchStage);
            const events = yield Event_1.default.find(matchStage).lean();
            const rows = events.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 24 },
                { header: 'Event Date', key: 'EventDate', width: 15 },
                { header: 'Title', key: 'Title', width: 30 },
                { header: 'Description', key: 'Description', width: 30 },
                { header: 'Start Time', key: 'StartTime', width: 15 },
                { header: 'End Time', key: 'EndTime', width: 15 },
                { header: 'Registration', key: 'Registration', width: 25 },
                { header: 'Speaker', key: 'Speaker', width: 25 },
                { header: 'Photo', key: 'Photo', width: 40 },
                { header: 'Capacity', key: 'Capacity', width: 10 },
                { header: 'Location', key: 'Location', width: 20 },
                { header: 'Fee', key: 'Fee', width: 10 },
                { header: 'Created At', key: 'CreatedAt', width: 20 },
                { header: 'Updated At', key: 'UpdatedAt', width: 20 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = AllEvent;
