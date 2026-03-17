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
exports.usersExcel = exports.eventAttendeesExcel = exports.appliedJobsExcel = exports.careerOpportunityExcel = exports.sponsorshipExcel = exports.seekerExcel = exports.nocNoDueExportToExcel = exports.serviceRequestExportToExcel = exports.exportUsersToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const MembersRegistrastionForm_1 = __importDefault(require("../models/MembersRegistrastionForm"));
const serviceRequestExcel_1 = __importDefault(require("../services/excel/modules/serviceRequestExcel"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const nocNoDueExcel_1 = __importDefault(require("../services/excel/modules/nocNoDueExcel"));
const seekerExcel_1 = __importDefault(require("../services/excel/modules/seekerExcel"));
const sponsorshipExcel__1 = __importDefault(require("../services/excel/modules/sponsorshipExcel__"));
const careerOpportunityExcel_1 = __importDefault(require("../services/excel/modules/careerOpportunityExcel"));
const appliedJobsExcel_1 = __importDefault(require("../services/excel/modules/appliedJobsExcel"));
const usersExcel_1 = __importDefault(require("../services/excel/modules/usersExcel"));
const eventAttendees_1 = __importDefault(require("../services/excel/modules/eventAttendees"));
const allEvent_1 = __importDefault(require("../services/excel/modules/allEvent"));
const AllCirculars_1 = __importDefault(require("../services/excel/modules/AllCirculars"));
const AllWebDirectory_1 = __importDefault(require("../services/excel/modules/AllWebDirectory"));
// export const exportUsersToExcel = async (req: Request, res: Response) => {
//     try {
//         // Fetch users from the database
//         const users = await UserModel.find()
//             .populate('created_by', 'email') // Populate creator's email
//             .lean(); // Convert Mongoose objects to plain JSON
//         // Create a new Excel workbook and worksheet
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('OIA-Users');
//         // Define Excel column headers
//         worksheet.columns = [
//             { header: 'ID', key: '_id', width: 25 },
//             { header: 'Email', key: 'email', width: 25 },
//             { header: 'User Type', key: 'user_type', width: 15 },
//             { header: 'Created By', key: 'created_by', width: 25 },
//             { header: 'Is Member', key: 'is_Member', width: 12 },
//             { header: 'Is Email Verified', key: 'is_Email_Verified', width: 18 },
//             { header: 'Account Status', key: 'account_status', width: 15 },
//             { header: 'Approval Status', key: 'approval_status', width: 15 },
//             { header: 'Role Names', key: 'roleName', width: 30 },
//             { header: 'Actions', key: 'actions', width: 30 },
//             { header: 'Created At', key: 'createdAt', width: 25 },
//         ];
//         // Add user data to the worksheet
//         users.forEach((user) => {
//             worksheet.addRow({
//                 _id: user._id,
//                 email: user.email,
//                 user_type: user.user_type,
//                 is_Member: user.is_Member,
//                 is_Email_Verified: user.is_Email_Verified,
//                 account_status: user.account_status,
//                 approval_status: user.approval_status,
//                 roleName: user.roleName,
//                 actions: user.roleName,
//                // createdAt: user.createdAt.toISOString(),
//             });
//         });
//         // Set headers for Excel file download
//         res.setHeader(
//             'Content-Type',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         );
//         res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
//         // Write the Excel file to response stream
//         await workbook.xlsx.write(res);
//         res.end(); // End response
//     } catch (error) {
//         console.error('Error exporting users:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
const exportUsersToExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberships = yield MembersRegistrastionForm_1.default.find()
            .populate('userId', 'email')
            .populate('created_by', 'email')
            .populate('approved_by', 'email')
            .lean();
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Memberships');
        const maxReps = 2;
        const maxProperties = 2;
        const maxDocs = 3;
        const baseColumns = [
            //  { header: 'ID', key: '_id', width: 24 },
            { header: 'Membership ID', key: 'membership_Id', width: 15 },
            { header: 'Company Name', key: 'memberCompanyName', width: 30 },
            { header: 'Plot/Shed No', key: 'plotShedNo', width: 20 },
            { header: 'Road No', key: 'roadNo', width: 20 },
            { header: 'Company Type', key: 'companyType', width: 20 },
            { header: 'Email', key: 'email', width: 25 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Mobile', key: 'mobile', width: 20 },
            { header: 'Website', key: 'website', width: 25 },
            { header: 'Product Name', key: 'productName', width: 25 },
            { header: 'Company Category', key: 'companyCategory', width: 25 },
            { header: 'GST No', key: 'gstNo', width: 20 },
            { header: 'AMC Tenement No', key: 'amcTenementNo', width: 25 },
            { header: 'Udyog Aadhar No', key: 'udyogAadharNo', width: 25 },
            { header: 'Torrent Service No', key: 'torrentServiceNo', width: 25 },
            { header: 'Allotment Letter', key: 'allotmentLetter', width: 25 },
            { header: 'Possession Letter', key: 'possessionLetter', width: 25 },
            { header: 'Office Order', key: 'officeOrder', width: 25 },
            { header: 'Transfer Order', key: 'transferOrder', width: 25 },
            { header: 'Bank Name', key: 'bankName', width: 20 },
            { header: 'Branch Name', key: 'branchName', width: 20 },
            { header: 'Cheque No', key: 'chequeNo', width: 15 },
            { header: 'Cheque Date', key: 'chequeDate', width: 20 },
            {
                header: 'Cheque Amount (Number)',
                key: 'chequeAmountNumber',
                width: 20,
            },
            { header: 'Cheque Amount (Words)', key: 'chequeAmountWords', width: 30 },
            { header: 'Cheque Photo', key: 'chequePhoto', width: 30 },
            { header: 'Receipt', key: 'receipt', width: 20 },
            { header: 'Receipt Photo', key: 'receiptPhoto', width: 30 },
            //  { header: 'User Email', key: 'user_email', width: 25 },
            //{ header: 'Created By', key: 'created_by', width: 25 },
            //  { header: 'Approved By', key: 'approved_by', width: 25 },
        ];
        const repColumns = [];
        for (let i = 0; i < maxReps; i++) {
            repColumns.push({ header: `Rep_${i + 1}_Name`, key: `rep_${i}_name`, width: 20 }, { header: `Rep_${i + 1}_Email`, key: `rep_${i}_email`, width: 25 }, {
                header: `Rep_${i + 1}_Designation`,
                key: `rep_${i}_designation`,
                width: 20,
            }, { header: `Rep_${i + 1}_Mobile`, key: `rep_${i}_mobile`, width: 20 }, { header: `Rep_${i + 1}_Phone`, key: `rep_${i}_phone`, width: 20 }, { header: `Rep_${i + 1}_Photo`, key: `rep_${i}_photo`, width: 30 });
        }
        const propertyColumns = [];
        for (let i = 0; i < maxProperties; i++) {
            propertyColumns.push({ header: `Prop_${i + 1}_PlotSize`, key: `prop_${i}_plot`, width: 20 }, {
                header: `Prop_${i + 1}_WaterConn`,
                key: `prop_${i}_water`,
                width: 20,
            }, {
                header: `Prop_${i + 1}_ConnSizeMM`,
                key: `prop_${i}_connSize`,
                width: 20,
            }, { header: `Prop_${i + 1}_AreaSize`, key: `prop_${i}_area`, width: 20 }
            // { header: `Prop_${i + 1}_ShedPlotSizeNos`, key: `prop_${i}_shedplotShedSizeNos`, width: 25 }
            );
        }
        const docColumns = [];
        for (let i = 0; i < maxDocs; i++) {
            docColumns.push({ header: `Doc_${i + 1}_Name`, key: `doc_${i}_name`, width: 25 }, { header: `Doc_${i + 1}_File`, key: `doc_${i}_file`, width: 30 });
        }
        worksheet.columns = [
            ...baseColumns,
            ...repColumns,
            ...propertyColumns,
            ...docColumns,
        ];
        memberships.forEach(m => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            const row = {
                //  _id: m._id,
                membership_Id: m.membership_Id,
                memberCompanyName: m.memberCompanyName,
                plotShedNo: m.plotShedNo,
                roadNo: m.roadNo,
                companyType: m.companyType,
                email: m.email,
                phone: m.phone,
                mobile: m.mobile,
                website: m.website,
                productName: m.productName,
                companyCategory: m.companyCategory,
                gstNo: m.gstNo,
                amcTenementNo: m.amcTenementNo,
                udyogAadharNo: m.udyogAadharNo,
                torrentServiceNo: m.torrentServiceNo,
                allotmentLetter: ((_a = m.attachments) === null || _a === void 0 ? void 0 : _a.allotmentLetter) || '',
                possessionLetter: ((_b = m.attachments) === null || _b === void 0 ? void 0 : _b.possessionLetter) || '',
                officeOrder: ((_c = m.attachments) === null || _c === void 0 ? void 0 : _c.officeOrder) || '',
                transferOrder: ((_d = m.attachments) === null || _d === void 0 ? void 0 : _d.transferOrder) || '',
                bankName: ((_e = m.chequeDetails) === null || _e === void 0 ? void 0 : _e.bankName) || '',
                branchName: ((_f = m.chequeDetails) === null || _f === void 0 ? void 0 : _f.branchName) || '',
                chequeNo: ((_g = m.chequeDetails) === null || _g === void 0 ? void 0 : _g.chequeNo) || '',
                chequeDate: ((_h = m.chequeDetails) === null || _h === void 0 ? void 0 : _h.chequeDate) || '',
                chequeAmountNumber: ((_j = m.chequeDetails) === null || _j === void 0 ? void 0 : _j.chequeAmountNumber) || '',
                chequeAmountWords: ((_k = m.chequeDetails) === null || _k === void 0 ? void 0 : _k.chequeAmountWords) || '',
                chequePhoto: ((_l = m.chequeDetails) === null || _l === void 0 ? void 0 : _l.chequePhoto) || '',
                receipt: m.receipt || '',
                receiptPhoto: m.receiptPhoto || '',
                // user_email: m.userId?.email || '',
                // created_by: m.created_by?.email || '',
                // approved_by: m.approved_by?.email || '',
            };
            (_m = m.representativeDetails) === null || _m === void 0 ? void 0 : _m.slice(0, maxReps).forEach((rep, i) => {
                row[`rep_${i}_name`] = rep.name || '';
                row[`rep_${i}_email`] = rep.email || '';
                row[`rep_${i}_designation`] = rep.designation || '';
                row[`rep_${i}_mobile`] = rep.mobile || '';
                row[`rep_${i}_phone`] = rep.phone || '';
                row[`rep_${i}_photo`] = rep.photo || '';
            });
            (_o = m.propertyDetails) === null || _o === void 0 ? void 0 : _o.slice(0, maxProperties).forEach((prop, i) => {
                row[`prop_${i}_plot`] = prop.plotShedSize || '';
                row[`prop_${i}_water`] = prop.waterConnectionNo || '';
                row[`prop_${i}_connSize`] = prop.connectionSizeMM || '';
                row[`prop_${i}_area`] = prop.areaSizeSqMtrs || '';
            });
            (_p = m.otherDocuments) === null || _p === void 0 ? void 0 : _p.slice(0, maxDocs).forEach((doc, i) => {
                row[`doc_${i}_name`] = doc.name || '';
                row[`doc_${i}_file`] = doc.file || '';
            });
            worksheet.addRow(row);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=memberships.xlsx');
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error('Error exporting memberships:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.exportUsersToExcel = exportUsersToExcel;
exports.serviceRequestExportToExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const srExcel = new serviceRequestExcel_1.default();
    const serviceCategoryKey = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.key;
    const complaintStatus = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.status;
    let fromDate = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.fromDate;
    let toDate = (_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.toDate;
    yield srExcel.generate(res, {
        filters: {
            key: serviceCategoryKey,
            status: complaintStatus,
            fromDate,
            toDate,
        },
    });
}));
exports.nocNoDueExportToExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const e = new nocNoDueExcel_1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
        },
    });
}));
exports.seekerExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const e = new seekerExcel_1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
        },
    });
}));
exports.sponsorshipExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const e = new sponsorshipExcel__1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    let approved = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.approved;
    let active = (_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.active;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
            approved,
            active,
        },
    });
}));
exports.careerOpportunityExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const e = new careerOpportunityExcel_1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    let approved = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.approved;
    let active = (_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.active;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
            approved,
            active,
        },
    });
}));
exports.appliedJobsExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const e = new appliedJobsExcel_1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    let careerOpportunityId = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.careerOpportunityId;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
            careerOpportunityId,
        },
    });
}));
exports.eventAttendeesExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const e = new eventAttendees_1.default();
    let fromDate = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.fromDate;
    let toDate = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.toDate;
    let eventId = (_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.eventId;
    yield e.generate(res, {
        filters: {
            fromDate,
            toDate,
            eventId,
        },
    });
}));
exports.usersExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = new usersExcel_1.default();
    yield e.generate(res, { filters: req.query });
}));
const allEventsListExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = new allEvent_1.default();
    yield e.generate(res, { filters: req.query });
}));
const circularsExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = new AllCirculars_1.default();
    yield e.generate(res, { filters: req.query });
}));
const webDirectoryExcel = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const e = new AllWebDirectory_1.default();
    yield e.generate(res, { filters: req.query });
}));
exports.default = {
    exportUsersToExcel: exports.exportUsersToExcel,
    serviceRequestExportToExcel: exports.serviceRequestExportToExcel,
    nocNoDueExportToExcel: exports.nocNoDueExportToExcel,
    seekerExcel: exports.seekerExcel,
    sponsorshipExcel: exports.sponsorshipExcel,
    careerOpportunityExcel: exports.careerOpportunityExcel,
    appliedJobsExcel: exports.appliedJobsExcel,
    usersExcel: exports.usersExcel,
    eventAttendeesExcel: exports.eventAttendeesExcel,
    allEventsListExcel,
    circularsExcel,
    webDirectoryExcel
};
