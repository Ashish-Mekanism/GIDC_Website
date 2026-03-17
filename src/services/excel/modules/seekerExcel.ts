import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import FileService from '../../fileService/fileService';
import { FOLDER_NAMES } from '../../../utils/constants';
import ApplyJob from '../../../models/ApplyJob';

class SeekerExcel extends ExcelService {
  private workSheetName = 'Seekeers';
  private fileService = new FileService();

  async getMatchStage(filters: { fromDate: string; toDate: string }) {
    const { fromDate, toDate } = filters;

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};
    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    return matchStage;
  }

  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    const { resume, careerOpportunityId } = data;

    const getFile = (fileName?: string) => {
      return fileName
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.RESUME, [
            FOLDER_NAMES.RESUME,
            fileName,
          ])
        : '';
    };

    return {
      SeekerID: data._id ?? '',
      Name: data.name ?? '',
      Email: data.email ?? '',
      ContactNo: data.contactNo ?? '',
      CurrentAddress: data.currentAddress ?? '',
      Resume: getFile(resume),
      JobId: careerOpportunityId?._id ?? '',
      AppliedJobTitle: careerOpportunityId?.jobTitle ?? '',
      JobType: careerOpportunityId?.jobType ?? '',
      JobLocation: careerOpportunityId?.jobLocation ?? '',
      CompanyAddress: careerOpportunityId?.companyAddress ?? '',
      AssociationName: careerOpportunityId?.associationName ?? '',
      JobIndustry: careerOpportunityId?.jobIndustry ?? '',
      EmployerEmail: careerOpportunityId?.email ?? '',
      ApplicationDeadline: careerOpportunityId?.applicationDeadline ?? '',
      AppliedAt: data.createdAt ?? '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const matchStage = (await this.getMatchStage(filters)) || {};

    const seekers = await ApplyJob.find(matchStage)
      .populate('careerOpportunityId')
      .lean();
    const rows = seekers.map(item => this.mapToExcelRowWithFilePaths(item));
    this.setColumns(sheet, [
      { header: 'Seeker ID', key: 'SeekerID', width: 25 },
      { header: 'Name', key: 'Name', width: 20 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Contact No', key: 'ContactNo', width: 15 },
      { header: 'Current Address', key: 'CurrentAddress', width: 30 },
      { header: 'Resume', key: 'Resume', width: 40 },
      {
        header: 'Job Id',
        key: 'JobId',
        width: 40,
      },
      { header: 'Job Title', key: 'AppliedJobTitle', width: 25 },
      { header: 'Job Type', key: 'JobType', width: 15 },
      { header: 'Job Location', key: 'JobLocation', width: 15 },
      { header: 'Company Address', key: 'CompanyAddress', width: 25 },
      { header: 'Association Name', key: 'AssociationName', width: 35 },
      { header: 'Job Industry', key: 'JobIndustry', width: 25 },
      { header: 'Employer Email', key: 'EmployerEmail', width: 30 },
      { header: 'Application Deadline', key: 'ApplicationDeadline', width: 20 },
      { header: 'Applied At', key: 'AppliedAt', width: 20 },
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

export default SeekerExcel;
