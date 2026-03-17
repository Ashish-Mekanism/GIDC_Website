import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import FileService from '../../fileService/fileService';
import { FOLDER_NAMES, RESPONSE_CODE } from '../../../utils/constants';
import ApplyJob from '../../../models/ApplyJob';
import { isValidObjectId } from 'mongoose';
import ApiError from '../../../utils/ApiError';

class AppliedJobsExcel extends ExcelService {
  private workSheetName = 'AppliedJobs';
  private fileService = new FileService();

  async getMatchStage(filters: {
    fromDate: string;
    toDate: string;
    careerOpportunityId: string;
  }) {
    const { fromDate, toDate, careerOpportunityId } = filters;

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};
    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    if (careerOpportunityId) {
      matchStage.careerOpportunityId = careerOpportunityId;
    }
    return matchStage;
  }

  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    const { resume } = data;

    const getFile = (fileName?: string) => {
      return fileName
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.RESUME, [
            FOLDER_NAMES.RESUME,
            fileName,
          ])
        : '';
    };

    return {
      ID: data?._id ?? '',
      CareerOpportunityID: data?.careerOpportunityId ?? '',
      Name: data?.name ?? '',
      Email: data?.email ?? '',
      IndustryJob: data?.industryJob ?? '',
      ContactNo: data?.contactNo ?? '',
      CurrentAddress: data?.currentAddress ?? '',
      ResumeFile: getFile(resume),
      CreatedAt: data?.createdAt ?? '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const careerOpportunityId = filters?.careerOpportunityId;
    if (careerOpportunityId && !isValidObjectId(careerOpportunityId)) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Invalid Career Opportunity Id'
      );
    }
    const matchStage = (await this.getMatchStage(filters)) || {};

    const jobs = await ApplyJob.find(matchStage).lean();
    const rows = jobs.map(item => this.mapToExcelRowWithFilePaths(item));

    this.setColumns(sheet, [
      { header: 'ID', key: 'ID', width: 20 },
      {
        header: 'Career Opportunity ID',
        key: 'CareerOpportunityID',
        width: 25,
      },
      { header: 'Name', key: 'Name', width: 25 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Industry Job', key: 'IndustryJob', width: 25 },
      { header: 'Contact No', key: 'ContactNo', width: 20 },
      { header: 'Current Address', key: 'CurrentAddress', width: 40 },
      { header: 'Resume File', key: 'ResumeFile', width: 40 },
      { header: 'Created At', key: 'CreatedAt', width: 20 },
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

export default AppliedJobsExcel;
