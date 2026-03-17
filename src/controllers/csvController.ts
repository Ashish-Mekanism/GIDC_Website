import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import UserModel from '../models/User'; // Your User model
import MembershipModel from '../models/MembersRegistrastionForm';
import ServiceRequestsExcel from '../services/excel/modules/serviceRequestExcel';
import asyncHandler from '../utils/asyncHandler';
import NOCNoDueExcel from '../services/excel/modules/nocNoDueExcel';
import SeekerExcel from '../services/excel/modules/seekerExcel';
import SponsorshipExcel from '../services/excel/modules/sponsorshipExcel__';
import CareerOpportunityExcel from '../services/excel/modules/careerOpportunityExcel';
import AppliedJobsExcel from '../services/excel/modules/appliedJobsExcel';
import UsersExcel from '../services/excel/modules/usersExcel';
import EventAttendeesExcel from '../services/excel/modules/eventAttendees';
import AllEvent from '../services/excel/modules/allEvent';
import AllCirculars from '../services/excel/modules/AllCirculars';
import AllWebDirectory from '../services/excel/modules/AllWebDirectory';

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

export const exportUsersToExcel = async (req: Request, res: Response) => {
  try {
    const memberships = await MembershipModel.find()
      .populate('userId', 'email')
      .populate('created_by', 'email')
      .populate('approved_by', 'email')
      .lean();

    const workbook = new ExcelJS.Workbook();
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
      repColumns.push(
        { header: `Rep_${i + 1}_Name`, key: `rep_${i}_name`, width: 20 },
        { header: `Rep_${i + 1}_Email`, key: `rep_${i}_email`, width: 25 },
        {
          header: `Rep_${i + 1}_Designation`,
          key: `rep_${i}_designation`,
          width: 20,
        },
        { header: `Rep_${i + 1}_Mobile`, key: `rep_${i}_mobile`, width: 20 },
        { header: `Rep_${i + 1}_Phone`, key: `rep_${i}_phone`, width: 20 },
        { header: `Rep_${i + 1}_Photo`, key: `rep_${i}_photo`, width: 30 }
      );
    }

    const propertyColumns = [];
    for (let i = 0; i < maxProperties; i++) {
      propertyColumns.push(
        { header: `Prop_${i + 1}_PlotSize`, key: `prop_${i}_plot`, width: 20 },
        {
          header: `Prop_${i + 1}_WaterConn`,
          key: `prop_${i}_water`,
          width: 20,
        },
        {
          header: `Prop_${i + 1}_ConnSizeMM`,
          key: `prop_${i}_connSize`,
          width: 20,
        },
        { header: `Prop_${i + 1}_AreaSize`, key: `prop_${i}_area`, width: 20 }
        // { header: `Prop_${i + 1}_ShedPlotSizeNos`, key: `prop_${i}_shedplotShedSizeNos`, width: 25 }
      );
    }

    const docColumns = [];
    for (let i = 0; i < maxDocs; i++) {
      docColumns.push(
        { header: `Doc_${i + 1}_Name`, key: `doc_${i}_name`, width: 25 },
        { header: `Doc_${i + 1}_File`, key: `doc_${i}_file`, width: 30 }
      );
    }

    worksheet.columns = [
      ...baseColumns,
      ...repColumns,
      ...propertyColumns,
      ...docColumns,
    ];

    memberships.forEach(m => {
      const row: any = {
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
        allotmentLetter: m.attachments?.allotmentLetter || '',
        possessionLetter: m.attachments?.possessionLetter || '',
        officeOrder: m.attachments?.officeOrder || '',
        transferOrder: m.attachments?.transferOrder || '',
        bankName: m.chequeDetails?.bankName || '',
        branchName: m.chequeDetails?.branchName || '',
        chequeNo: m.chequeDetails?.chequeNo || '',
        chequeDate: m.chequeDetails?.chequeDate || '',
        chequeAmountNumber: m.chequeDetails?.chequeAmountNumber || '',
        chequeAmountWords: m.chequeDetails?.chequeAmountWords || '',
        chequePhoto: m.chequeDetails?.chequePhoto || '',
        receipt: m.receipt || '',
        receiptPhoto: m.receiptPhoto || '',
        // user_email: m.userId?.email || '',
        // created_by: m.created_by?.email || '',
        // approved_by: m.approved_by?.email || '',
      };

      m.representativeDetails?.slice(0, maxReps).forEach((rep, i) => {
        row[`rep_${i}_name`] = rep.name || '';
        row[`rep_${i}_email`] = rep.email || '';
        row[`rep_${i}_designation`] = rep.designation || '';
        row[`rep_${i}_mobile`] = rep.mobile || '';
        row[`rep_${i}_phone`] = rep.phone || '';
        row[`rep_${i}_photo`] = rep.photo || '';
      });

      m.propertyDetails?.slice(0, maxProperties).forEach((prop, i) => {
        row[`prop_${i}_plot`] = prop.plotShedSize || '';
        row[`prop_${i}_water`] = prop.waterConnectionNo || '';
        row[`prop_${i}_connSize`] = prop.connectionSizeMM || '';
        row[`prop_${i}_area`] = prop.areaSizeSqMtrs || '';
      });

      m.otherDocuments?.slice(0, maxDocs).forEach((doc, i) => {
        row[`doc_${i}_name`] = doc.name || '';
        row[`doc_${i}_file`] = doc.file || '';
      });

      worksheet.addRow(row);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=memberships.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting memberships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const serviceRequestExportToExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const srExcel = new ServiceRequestsExcel();
    const serviceCategoryKey = req?.query?.key as string;
    const complaintStatus = req?.query?.status as string;
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    await srExcel.generate(res, {
      filters: {
        key: serviceCategoryKey,
        status: complaintStatus,
        fromDate,
        toDate,
      },
    });
  }
);
export const nocNoDueExportToExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new NOCNoDueExcel();
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    await e.generate(res, {
      filters: {
        fromDate,
        toDate,
      },
    });
  }
);
export const seekerExcel = asyncHandler(async (req: Request, res: Response) => {
  const e = new SeekerExcel();
  let fromDate = req?.query?.fromDate as string;
  let toDate = req?.query?.toDate as string;
  await e.generate(res, {
    filters: {
      fromDate,
      toDate,
    },
  });
});
export const sponsorshipExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new SponsorshipExcel();
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    let approved = req?.query?.approved as string;
    let active = req?.query?.active as string;
    await e.generate(res, {
      filters: {
        fromDate,
        toDate,
        approved,
        active,
      },
    });
  }
);
export const careerOpportunityExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new CareerOpportunityExcel();
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    let approved = req?.query?.approved as string;
    let active = req?.query?.active as string;
    await e.generate(res, {
      filters: {
        fromDate,
        toDate,
        approved,
        active,
      },
    });
  }
);

export const appliedJobsExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new AppliedJobsExcel();
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    let careerOpportunityId = req?.query?.careerOpportunityId as string;
    await e.generate(res, {
      filters: {
        fromDate,
        toDate,
        careerOpportunityId,
      },
    });
  }
);

export const eventAttendeesExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new EventAttendeesExcel();
    let fromDate = req?.query?.fromDate as string;
    let toDate = req?.query?.toDate as string;
    let eventId = req?.query?.eventId as string;
    await e.generate(res, {
      filters: {
        fromDate,
        toDate,
        eventId,
      },
    });
  }
);

export const usersExcel = asyncHandler(async (req: Request, res: Response) => {
  const e = new UsersExcel();
  await e.generate(res, { filters: req.query });
});

  
const allEventsListExcel = asyncHandler(async (req: Request, res: Response) => {
  const e = new AllEvent();
  await e.generate(res, { filters: req.query });
});
const circularsExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new AllCirculars();
    await e.generate(res, { filters: req.query });
  }  
);
const webDirectoryExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const e = new AllWebDirectory();
    await e.generate(res, { filters: req.query });
  }  
);

export default {
  exportUsersToExcel,
  serviceRequestExportToExcel,
  nocNoDueExportToExcel,
  seekerExcel,
  sponsorshipExcel,
  careerOpportunityExcel,
  appliedJobsExcel,
  usersExcel,
  eventAttendeesExcel,
  allEventsListExcel,
  circularsExcel,
  webDirectoryExcel
};
