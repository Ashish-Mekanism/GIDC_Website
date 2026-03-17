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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../../utils/helper");
const excelService_1 = __importDefault(require("../base/excelService"));
const constants_1 = require("../../../utils/constants");
const User_1 = __importDefault(require("../../../models/User"));
class UsersExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'Users';
    }
    parseFilterValue(value, type) {
        if (value === undefined || value === null || value === '')
            return undefined;
        switch (type) {
            case 'number': {
                const n = Number(value);
                return Number.isNaN(n) ? undefined : n;
            }
            case 'boolean':
                if (value === 'true' || value === true || value === '1' || value === 1)
                    return true;
                if (value === 'false' ||
                    value === false ||
                    value === '0' ||
                    value === 0)
                    return false;
                return undefined;
            case 'string':
                return String(value);
        }
    }
    getMatchStage(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate } = filters, rest = __rest(filters, ["fromDate", "toDate"]);
            const matchStage = {};
            // Date filter
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            // Config-driven filters
            const schema = {
                user_type: 'number',
                is_Email_Verified: 'boolean',
                approval_status: 'number',
                account_status: 'number',
                is_Member: 'boolean',
            };
            Object.entries(schema).forEach(([key, type]) => {
                const parsed = this.parseFilterValue(rest[key], type);
                if (parsed !== undefined) {
                    matchStage[key] = parsed;
                }
            });
            return matchStage;
        });
    }
    mapToExcelRowWithFilePaths(data) {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            UserID: (_a = data._id) !== null && _a !== void 0 ? _a : '',
            Username: (_b = data.user_name) !== null && _b !== void 0 ? _b : '',
            Email: (_c = data.email) !== null && _c !== void 0 ? _c : '',
            IsMember: data.is_Member ? 'Yes' : 'No',
            UserType: data.user_type === constants_1.USER_TYPE.SUPER_ADMIN
                ? 'SUPER_ADMIN'
                : data.user_type === constants_1.USER_TYPE.SUB_ADMIN
                    ? 'SUB_ADMIN'
                    : data.user_type === constants_1.USER_TYPE.USER
                        ? 'USER'
                        : 'Unknown',
            EmailVerified: data.is_Email_Verified ? 'Verified' : 'Not Verified',
            ApprovalStatus: data.approval_status === constants_1.MEMBER_APPROVAL_STATUS.APPROVED
                ? 'Approved'
                : data.approval_status === constants_1.MEMBER_APPROVAL_STATUS.PENDING
                    ? 'Pending'
                    : 'Declined',
            AccountStatus: data.account_status === constants_1.ACCOUNT_STATUS.ACTIVE
                ? 'Active'
                : 'Deactivated',
            CreatedAt: data.createdAt
                ? (_e = (_d = new Date(data.createdAt)) === null || _d === void 0 ? void 0 : _d.toISOString()) === null || _e === void 0 ? void 0 : _e.split('T')[0]
                : '',
            UpdatedAt: data.updatedAt
                ? (_g = (_f = new Date(data.updatedAt)) === null || _f === void 0 ? void 0 : _f.toISOString()) === null || _g === void 0 ? void 0 : _g.split('T')[0]
                : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const Users = yield User_1.default.find(matchStage);
            const rows = Users.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'User ID', key: 'UserID', width: 25 },
                { header: 'Username', key: 'Username', width: 30 },
                { header: 'Email', key: 'Email', width: 35 },
                { header: 'Is Member', key: 'IsMember', width: 15 },
                { header: 'User Type', key: 'UserType', width: 20 },
                { header: 'Email Verified', key: 'EmailVerified', width: 20 },
                { header: 'Approval Status', key: 'ApprovalStatus', width: 20 },
                { header: 'Account Status', key: 'AccountStatus', width: 20 },
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
exports.default = UsersExcel;
