import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';

import CareerOpportunityModel from '../../../models/CareerOpportunity';
import { JOB_POSTING_STATUS } from '../../../utils/constants';

class CareerOpportunityExcel extends ExcelService {
  private workSheetName = 'OpportunityRequests';
  
  async getMatchStage(filters: {
    fromDate: string;
    toDate: string;
    approved: string | number;
    active: string | boolean;
  }) {
    const { fromDate, toDate, approved, active } = filters;

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};
    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }
    if (approved !== '' && !isNaN(Number(approved))) {
      matchStage.approveStatus = Number(approved);
    }

    if (['true', 'false', true, false].includes(active)) {
      matchStage.active = active === true || active === 'true';
    }
    return matchStage;
  }

  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    return {
      JobID: data._id ?? '',
      JobTitle: data.jobTitle ?? '',
      JobType: data.jobType ?? '',
      JobDescription: data.jobDescription ?? '',
      JobLocation: data.jobLocation ?? '',
      CompanyAddress: data.companyAddress ?? '',
      AssociationName: data.associationName ?? '',
      JobIndustry: data.jobIndustry ?? '',
      EmployerEmail: data.email ?? '',
      ApplicationDeadline: data.applicationDeadline
        ? new Date(data.applicationDeadline)?.toISOString()?.split('T')[0]
        : '',
      ApproveStatus:
        data.approveStatus === JOB_POSTING_STATUS.APPROVED
          ? 'Approved'
          : data.approveStatus === JOB_POSTING_STATUS.PENDING
            ? 'Pending'
            : 'Declined',
      Active: data.active ? 'Active' : 'Inactive',
      CreatedAt: data.createdAt
        ? new Date(data.createdAt)?.toISOString()?.split('T')[0]
        : '',
      UpdatedAt: data.updatedAt
        ? new Date(data.updatedAt)?.toISOString()?.split('T')[0]
        : '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const matchStage = (await this.getMatchStage(filters)) || {};
    const careerOpportunity = await CareerOpportunityModel.find(matchStage);

    const rows = careerOpportunity.map(item =>
      this.mapToExcelRowWithFilePaths(item)
    );
    this.setColumns(sheet, [
      { header: 'Job ID', key: 'JobID', width: 25 },
      { header: 'Job Title', key: 'JobTitle', width: 30 },
      { header: 'Job Type', key: 'JobType', width: 20 },
      { header: 'Job Description', key: 'JobDescription', width: 50 },
      { header: 'Job Location', key: 'JobLocation', width: 20 },
      { header: 'Company Address', key: 'CompanyAddress', width: 40 },
      { header: 'Association Name', key: 'AssociationName', width: 40 },
      { header: 'Job Industry', key: 'JobIndustry', width: 25 },
      { header: 'Employer Email', key: 'EmployerEmail', width: 30 },
      { header: 'Application Deadline', key: 'ApplicationDeadline', width: 20 },
      { header: 'Approve Status', key: 'ApproveStatus', width: 15 },
      { header: 'Active', key: 'Active', width: 12 },
      { header: 'Created At', key: 'CreatedAt', width: 20 },
      { header: 'Updated At', key: 'UpdatedAt', width: 20 },
    ]);

    this.addRows(sheet, rows);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${this.workSheetName}.xlsx`
    );

    await this.workbook.xlsx.write(res);
    res.end();
  }
}

export default CareerOpportunityExcel;
