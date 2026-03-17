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
const WebDirectory_1 = __importDefault(require("../../../models/WebDirectory"));
class AllWebDirectory extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Web Directory';
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return {
            ID: (_a = data === null || data === void 0 ? void 0 : data._id) !== null && _a !== void 0 ? _a : '',
            userId: (_b = data === null || data === void 0 ? void 0 : data.userId) !== null && _b !== void 0 ? _b : '',
            created_by: (_c = data === null || data === void 0 ? void 0 : data.created_by) !== null && _c !== void 0 ? _c : '',
            companyName: (_d = data === null || data === void 0 ? void 0 : data.companyName) !== null && _d !== void 0 ? _d : '',
            companyLogo: (data === null || data === void 0 ? void 0 : data.companyLogo) ? this.getFile(data.companyLogo) : '',
            personalPhone: (_e = data === null || data === void 0 ? void 0 : data.personalPhone) !== null && _e !== void 0 ? _e : '',
            companyPhone: (_f = data === null || data === void 0 ? void 0 : data.companyPhone) !== null && _f !== void 0 ? _f : '',
            personalEmail: (_g = data === null || data === void 0 ? void 0 : data.personalEmail) !== null && _g !== void 0 ? _g : '',
            companyEmail: (_h = data === null || data === void 0 ? void 0 : data.companyEmail) !== null && _h !== void 0 ? _h : '',
            companyProfile: (_j = data === null || data === void 0 ? void 0 : data.companyProfile) !== null && _j !== void 0 ? _j : '',
            productDetails: (_k = data === null || data === void 0 ? void 0 : data.productDetails) !== null && _k !== void 0 ? _k : '',
            product: (_l = data === null || data === void 0 ? void 0 : data.product) !== null && _l !== void 0 ? _l : '',
            location: (_m = data === null || data === void 0 ? void 0 : data.location) !== null && _m !== void 0 ? _m : '',
            active: data.active ? 'Active' : 'Inactive',
            createdAt: data.createdAt
                ? (_p = (_o = new Date(data.createdAt)) === null || _o === void 0 ? void 0 : _o.toISOString()) === null || _p === void 0 ? void 0 : _p.split('T')[0]
                : '',
            updatedAt: data.updatedAt
                ? (_r = (_q = new Date(data.updatedAt)) === null || _q === void 0 ? void 0 : _q.toISOString()) === null || _r === void 0 ? void 0 : _r.split('T')[0]
                : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            console.log("matchStage", matchStage);
            const eventAttendees = yield WebDirectory_1.default.find(matchStage).lean();
            const rows = eventAttendees.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 24 },
                { header: 'userId', key: 'userId', width: 30 },
                { header: 'created_by', key: 'created_by', width: 30 },
                { header: 'companyName', key: 'companyName', width: 30 },
                { header: 'companyLogo', key: 'companyLogo', width: 30 },
                { header: 'personalPhone', key: 'personalPhone', width: 15 },
                { header: 'companyPhone', key: 'companyPhone', width: 15 },
                { header: 'personalEmail', key: 'personalEmail', width: 15 },
                { header: 'companyEmail', key: 'companyEmail', width: 15 },
                { header: 'companyProfile', key: 'companyProfile', width: 15 },
                { header: 'productDetails', key: 'productDetails', width: 15 },
                { header: 'product', key: 'product', width: 15 },
                { header: 'location', key: 'location', width: 15 },
                { header: 'active', key: 'active', width: 15 },
                { header: 'createdAt', key: 'createdAt', width: 15 },
                { header: 'updatedAt', key: 'updatedAt', width: 15 },
            ]);
            this.addRows(sheet, rows);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${this.workSheetName}.xlsx`);
            yield this.workbook.xlsx.write(res);
            res.end();
        });
    }
}
exports.default = AllWebDirectory;
