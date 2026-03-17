import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';

import FileService from '../../fileService/fileService';
import { FOLDER_NAMES } from '../../../utils/constants';
import Sponsorship from '../../../models/Sponsorship';

class SponsorshipExcel extends ExcelService {
  private workSheetName = 'Sponsorships';
  private fileService = new FileService();

  async getMatchStage(filters: {
    fromDate: string;
    toDate: string;
    approved: string;
    active: string;
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

    if (approved && !isNaN(+approved)) {
      matchStage.Approved = +approved;
    }

    if (active) {
      matchStage.Active = active === 'true' ? true : false;
    }

    return matchStage;
  }

  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    const getFile = (fileName?: string) => {
      return fileName
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.SPONSORSHIP, [
            FOLDER_NAMES.SPONSORSHIP,
            fileName,
          ])
        : '';
    };

    return {
      SponsorshipID: data._id ?? '',
      CreatedBy: data.CreatedBy ?? '',
      Name: data.Name ?? '',
      Email: data.Email ?? '',
      Phone: data.Phone ?? '',
      Note: data.Note ?? '',
      Approved:
        data.Approved === 0
          ? 'Pending'
          : data.Approved === 1
            ? 'Approved'
            : 'Declined',
      Active: data.Active ? 'Active' : 'Inactive',
      StartDate: data.StartDate ?? '',
      EndDate: data.EndDate ?? '',
      Amount: data.Amount ?? '',
      Url: data.Url ?? '',
      Photo: getFile(data.Photo),
      CreatedAt: data.createdAt ?? '',
      UpdatedAt: data.updatedAt ?? '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const matchStage = (await this.getMatchStage(filters)) || {};
    const sponsorships = await Sponsorship.find(matchStage).lean();
    const rows = sponsorships.map(item =>
      this.mapToExcelRowWithFilePaths(item)
    );
     this.setColumns(sheet, [
    { header: 'Sponsorship ID', key: 'SponsorshipID', width: 25 },
    { header: 'Created By', key: 'CreatedBy', width: 25 },
    { header: 'Name', key: 'Name', width: 25 },
    { header: 'Email', key: 'Email', width: 30 },
    { header: 'Phone', key: 'Phone', width: 15 },
    { header: 'Note', key: 'Note', width: 40 },
    { header: 'Approved Status', key: 'Approved', width: 15 },
    { header: 'Active Status', key: 'Active', width: 15 },
    { header: 'Start Date', key: 'StartDate', width: 20 },
    { header: 'End Date', key: 'EndDate', width: 20 },
    { header: 'Amount', key: 'Amount', width: 15 },
    { header: 'Website URL', key: 'Url', width: 40 },
    { header: 'Photo Path', key: 'Photo', width: 40 },
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

export default SponsorshipExcel;
