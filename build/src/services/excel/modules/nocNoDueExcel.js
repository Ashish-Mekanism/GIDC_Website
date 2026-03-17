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
const NocNoDue_1 = __importDefault(require("../../../models/NocNoDue"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const constants_1 = require("../../../utils/constants");
class NOCNoDueExcel extends excelService_1.default {
    constructor() {
        super(...arguments);
        this.workSheetName = 'NOC_No_Due';
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32;
        const { userId, attachments, chequeDetails } = data;
        const getFile = (fileName) => {
            return fileName
                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                    userId,
                    fileName,
                ])
                : '';
        };
        return {
            ID: (_a = data._id) !== null && _a !== void 0 ? _a : '',
            UserID: userId !== null && userId !== void 0 ? userId : '',
            Email: (_b = data === null || data === void 0 ? void 0 : data.email) !== null && _b !== void 0 ? _b : '',
            IndustryName: (_c = data === null || data === void 0 ? void 0 : data.industryName) !== null && _c !== void 0 ? _c : '',
            IndustryAddress: (_d = data === null || data === void 0 ? void 0 : data.industryAddress) !== null && _d !== void 0 ? _d : '',
            IndustryType: (_e = data === null || data === void 0 ? void 0 : data.industryType) !== null && _e !== void 0 ? _e : '',
            TelephoneNo: (_f = data === null || data === void 0 ? void 0 : data.telephoneNo) !== null && _f !== void 0 ? _f : '',
            IsMember: (_g = data === null || data === void 0 ? void 0 : data.isMember) !== null && _g !== void 0 ? _g : '',
            IsContributionFiled: (_h = data === null || data === void 0 ? void 0 : data.isContributionFiled) !== null && _h !== void 0 ? _h : '',
            MembershipNo: (_j = data === null || data === void 0 ? void 0 : data.membershipNo) !== null && _j !== void 0 ? _j : '',
            Year: (_k = data === null || data === void 0 ? void 0 : data.year) !== null && _k !== void 0 ? _k : '',
            ReceiptNo: (_l = data === null || data === void 0 ? void 0 : data.receiptNo) !== null && _l !== void 0 ? _l : '',
            ApplicationType: Array.isArray(data === null || data === void 0 ? void 0 : data.applicationType)
                ? data.applicationType.join(', ')
                : ((_m = data === null || data === void 0 ? void 0 : data.applicationType) !== null && _m !== void 0 ? _m : ''),
            FeeForWaterNoc: (_o = data === null || data === void 0 ? void 0 : data.feeForWaterNoc) !== null && _o !== void 0 ? _o : '',
            PlotNo: (_p = data === null || data === void 0 ? void 0 : data.plotNo) !== null && _p !== void 0 ? _p : '',
            RefNo: (_q = data === null || data === void 0 ? void 0 : data.refNo) !== null && _q !== void 0 ? _q : '',
            RoadNo: (_r = data === null || data === void 0 ? void 0 : data.roadNo) !== null && _r !== void 0 ? _r : '',
            GSTNo: (_s = data === null || data === void 0 ? void 0 : data.gstNo) !== null && _s !== void 0 ? _s : '',
            ChequeBankName: (_t = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.bankName) !== null && _t !== void 0 ? _t : '',
            ChequeBranchName: (_u = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.branchName) !== null && _u !== void 0 ? _u : '',
            ChequeNo: (_v = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.chequeNo) !== null && _v !== void 0 ? _v : '',
            ChequeDate: (_w = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.chequeDate) !== null && _w !== void 0 ? _w : '',
            ChequeAmountNumber: (_x = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.chequeAmountNumber) !== null && _x !== void 0 ? _x : '',
            ChequeAmountWords: (_y = chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.chequeAmountWords) !== null && _y !== void 0 ? _y : '',
            ChequePhoto: getFile(chequeDetails === null || chequeDetails === void 0 ? void 0 : chequeDetails.chequePhoto),
            ApplicationLetter: getFile(attachments === null || attachments === void 0 ? void 0 : attachments.applicationLetter),
            WaterBill: getFile(attachments === null || attachments === void 0 ? void 0 : attachments.waterBill),
            LightBill: getFile(attachments === null || attachments === void 0 ? void 0 : attachments.lightBill),
            TaxBill: getFile(attachments === null || attachments === void 0 ? void 0 : attachments.taxBill),
            OtherDocumentImage: getFile(attachments === null || attachments === void 0 ? void 0 : attachments.otherDocumentImage),
            OtherDocumentName: (_z = attachments === null || attachments === void 0 ? void 0 : attachments.otherDocumentName) !== null && _z !== void 0 ? _z : '',
            PublishDate: (_0 = data.publishDate) !== null && _0 !== void 0 ? _0 : '',
            CreatedAt: (_1 = data.createdAt) !== null && _1 !== void 0 ? _1 : '',
            UpdatedAt: (_2 = data.updatedAt) !== null && _2 !== void 0 ? _2 : '',
            GidcLetterRefNo: (_4 = (_3 = attachments === null || attachments === void 0 ? void 0 : attachments.gidc) === null || _3 === void 0 ? void 0 : _3.gidcLetterRefNo) !== null && _4 !== void 0 ? _4 : '',
            GidcDate: (_6 = (_5 = attachments === null || attachments === void 0 ? void 0 : attachments.gidc) === null || _5 === void 0 ? void 0 : _5.gidcDate) !== null && _6 !== void 0 ? _6 : '',
            TorrentServiceNo: (_8 = (_7 = attachments === null || attachments === void 0 ? void 0 : attachments.torrent) === null || _7 === void 0 ? void 0 : _7.torrentServiceNo) !== null && _8 !== void 0 ? _8 : '',
            TorrentNo: (_10 = (_9 = attachments === null || attachments === void 0 ? void 0 : attachments.torrent) === null || _9 === void 0 ? void 0 : _9.torrentNo) !== null && _10 !== void 0 ? _10 : '',
            TorrentName: (_12 = (_11 = attachments === null || attachments === void 0 ? void 0 : attachments.torrent) === null || _11 === void 0 ? void 0 : _11.torrentName) !== null && _12 !== void 0 ? _12 : '',
            TorrentDate: (_14 = (_13 = attachments === null || attachments === void 0 ? void 0 : attachments.torrent) === null || _13 === void 0 ? void 0 : _13.torrentDate) !== null && _14 !== void 0 ? _14 : '',
            AmcTaxBillTenamentNo: (_16 = (_15 = attachments === null || attachments === void 0 ? void 0 : attachments.amcTaxBill) === null || _15 === void 0 ? void 0 : _15.amcTaxTenamentNo) !== null && _16 !== void 0 ? _16 : '',
            AmcTaxBillYear: (_18 = (_17 = attachments === null || attachments === void 0 ? void 0 : attachments.amcTaxBill) === null || _17 === void 0 ? void 0 : _17.amcTaxYear) !== null && _18 !== void 0 ? _18 : '',
            AmcTaxBillPaidAmount: (_20 = (_19 = attachments === null || attachments === void 0 ? void 0 : attachments.amcTaxBill) === null || _19 === void 0 ? void 0 : _19.amcTaxPaidAmount) !== null && _20 !== void 0 ? _20 : '',
            AmcTaxBillName: (_22 = (_21 = attachments === null || attachments === void 0 ? void 0 : attachments.amcTaxBill) === null || _21 === void 0 ? void 0 : _21.amcTaxName) !== null && _22 !== void 0 ? _22 : '',
            WaterConnectionNo: (_24 = (_23 = attachments === null || attachments === void 0 ? void 0 : attachments.water) === null || _23 === void 0 ? void 0 : _23.waterConnectionNo) !== null && _24 !== void 0 ? _24 : '',
            WaterBillNo: (_26 = (_25 = attachments === null || attachments === void 0 ? void 0 : attachments.water) === null || _25 === void 0 ? void 0 : _25.waterBillNo) !== null && _26 !== void 0 ? _26 : '',
            WaterBillDate: (_28 = (_27 = attachments === null || attachments === void 0 ? void 0 : attachments.water) === null || _27 === void 0 ? void 0 : _27.waterBillDate) !== null && _28 !== void 0 ? _28 : '',
            WaterConsumptionPeriod: (_30 = (_29 = attachments === null || attachments === void 0 ? void 0 : attachments.water) === null || _29 === void 0 ? void 0 : _29.waterConsumptionPeriod) !== null && _30 !== void 0 ? _30 : '',
            WaterBillName: (_32 = (_31 = attachments === null || attachments === void 0 ? void 0 : attachments.water) === null || _31 === void 0 ? void 0 : _31.waterBillName) !== null && _32 !== void 0 ? _32 : '',
        };
    }
    generate(res_1, _a) {
        return __awaiter(this, arguments, void 0, function* (res, { filters }) {
            const sheet = this.createWorksheet(this.workSheetName);
            const matchStage = (yield this.getMatchStage(filters)) || {};
            const complaints = yield NocNoDue_1.default.find(matchStage).lean();
            const rows = complaints.map(item => this.mapToExcelRowWithFilePaths(item));
            this.setColumns(sheet, [
                { header: 'ID', key: 'ID', width: 20 },
                { header: 'User ID', key: 'UserID', width: 20 },
                { header: 'Email', key: 'Email', width: 30 },
                { header: 'Industry Name', key: 'IndustryName', width: 25 },
                { header: 'Industry Address', key: 'IndustryAddress', width: 25 },
                { header: 'Industry Type', key: 'IndustryType', width: 15 },
                { header: 'Telephone No', key: 'TelephoneNo', width: 15 },
                { header: 'Is Member', key: 'IsMember', width: 10 },
                { header: 'Contribution Filed', key: 'IsContributionFiled', width: 15 },
                { header: 'Membership No', key: 'MembershipNo', width: 15 },
                { header: 'Year', key: 'Year', width: 10 },
                { header: 'Receipt No', key: 'ReceiptNo', width: 20 },
                { header: 'Application Type', key: 'ApplicationType', width: 25 },
                { header: 'Fee For Water NOC', key: 'FeeForWaterNoc', width: 20 },
                { header: 'Plot No', key: 'PlotNo', width: 15 },
                { header: 'Ref No', key: 'RefNo', width: 20 },
                { header: 'Road No', key: 'RoadNo', width: 10 },
                { header: 'GST No', key: 'GSTNo', width: 20 },
                { header: 'Cheque Bank Name', key: 'ChequeBankName', width: 20 },
                { header: 'Cheque Branch Name', key: 'ChequeBranchName', width: 20 },
                { header: 'Cheque No', key: 'ChequeNo', width: 15 },
                { header: 'Cheque Date', key: 'ChequeDate', width: 20 },
                { header: 'Cheque Amount (₹)', key: 'ChequeAmountNumber', width: 20 },
                { header: 'Cheque Amount (Words)', key: 'ChequeAmountWords', width: 30 },
                { header: 'Cheque Photo', key: 'ChequePhoto', width: 40 },
                { header: 'Application Letter', key: 'ApplicationLetter', width: 40 },
                { header: 'Water Bill', key: 'WaterBill', width: 40 },
                { header: 'Light Bill', key: 'LightBill', width: 40 },
                { header: 'Tax Bill', key: 'TaxBill', width: 40 },
                { header: 'Other Document Image', key: 'OtherDocumentImage', width: 40 },
                { header: 'Other Document Name', key: 'OtherDocumentName', width: 25 },
                //   GidcLetterRefNo: attachments?.gidc?.gidcLetterRefNo ?? '',
                // GidcDate: attachments?.gidc?.gidcDate ?? '',
                // TorrentServiceNo: attachments?.torrent?.torrentServiceNo ?? '',
                // TorrentNo: attachments?.torrent?.torrentNo ?? '',
                // TorrentName: attachments?.torrent?.torrentName ?? '',
                // TorrentDate: attachments?.torrent?.torrentDate ?? '',
                // AmcTaxBillTenamentNo: attachments?.amcTaxBill?.amcTaxTenamentNo ?? '',
                // AmcTaxBillYear: attachments?.amcTaxBill?.amcTaxYear ?? '',
                // AmcTaxBillPaidAmount: attachments?.amcTaxBill?.amcTaxPaidAmount ?? '',
                // AmcTaxBillName: attachments?.amcTaxBill?.amcTaxName ?? '',
                // WaterConnectionNo:attachments?.water?.waterConnectionNo ?? '',
                // WaterBillNo:attachments?.water?.waterBillNo ?? '',
                // WaterBillDate:attachments?.water?.waterBillDate ?? '',
                // WaterConsumptionPeriod:attachments?.water?.waterConsumptionPeriod ?? '',
                // WaterBillName:attachments?.water?.waterBillName ?? '',
                { header: 'GIDC Letter Ref No', key: 'GidcLetterRefNo', width: 25 },
                { header: 'GIDC Date', key: 'GidcDate', width: 20 },
                { header: 'Torrent Service No', key: 'TorrentServiceNo', width: 20 },
                { header: 'Torrent No', key: 'TorrentNo', width: 20 },
                { header: 'Torrent Name', key: 'TorrentName', width: 20 },
                { header: 'Torrent Date', key: 'TorrentDate', width: 20 },
                {
                    header: 'AMC Tax Bill Tenament No',
                    key: 'AmcTaxBillTenamentNo',
                    width: 20,
                },
                { header: 'AMC Tax Bill Year', key: 'AmcTaxBillYear', width: 20 },
                {
                    header: 'AMC Tax Bill Paid Amount',
                    key: 'AmcTaxBillPaidAmount',
                    width: 20,
                },
                { header: 'AMC Tax Bill Name', key: 'AmcTaxBillName', width: 20 },
                { header: 'Water Connection No', key: 'WaterConnectionNo', width: 20 },
                { header: 'Water Bill No', key: 'WaterBillNo', width: 20 },
                { header: 'Water Bill Date', key: 'WaterBillDate', width: 20 },
                {
                    header: 'Water Consumption Period',
                    key: 'WaterConsumptionPeriod',
                    width: 20,
                },
                { header: 'Water Bill Name', key: 'WaterBillName', width: 20 },
                { header: 'Publish Date', key: 'PublishDate', width: 20 },
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
exports.default = NOCNoDueExcel;
