import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import FileService from '../../fileService/fileService';
import { FOLDER_NAMES, RESPONSE_CODE } from '../../../utils/constants';
import ApplyJob from '../../../models/ApplyJob';
import { isValidObjectId } from 'mongoose';
import ApiError from '../../../utils/ApiError';
import BookEvent from '../../../models/BookEvent';

class EventAttendeesExcel extends ExcelService {
  private workSheetName = 'Event Attendees';
  private fileService = new FileService();

  async getMatchStage(filters: {
    fromDate: string;
    toDate: string;
    eventId: string;
  }) {
    const { fromDate, toDate, eventId } = filters;

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};
    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    if (eventId) {
      matchStage.eventId = eventId;
    }
    return matchStage;
  }
  getFile = (fileName?: string) => {
    return fileName
      ? this.fileService.getFilePathFromDatabase(
          FOLDER_NAMES.BOOKINGTRANSACTION,
          [FOLDER_NAMES.BOOKINGTRANSACTION, fileName]
        )
      : '';
  };
  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    const { transactionPhoto } = data;

    return {
      ID: data?._id ?? '',
      EventID: data?.eventId ?? '',
      EventDate: data?.eventDate ?? '',
      Name: data?.name ?? '',
      Email: data?.email ?? '',
      Phone: data?.phone ?? '',
      CompanyName: data?.companyName ?? '',
      Comment: data?.comment ?? '',
      TransactionID: data?.transactionId ?? '',
      TransactionPhoto: transactionPhoto ? this.getFile(transactionPhoto) : '',
      Status: data?.status ?? '',
      PersonCount: data?.personCount ?? '',
      CreatedAt: data?.createdAt ?? '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const eventId = filters?.eventId;
    if (eventId && !isValidObjectId(eventId)) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Invalid Event Id');
    }
    const matchStage = (await this.getMatchStage(filters)) || {};

    const eventAttendees = await BookEvent.find(matchStage).lean();
    const rows = eventAttendees.map(item =>
      this.mapToExcelRowWithFilePaths(item)
    );

    this.setColumns(sheet, [
      { header: 'ID', key: 'ID', width: 24 },
      { header: 'Event ID', key: 'EventID', width: 24 },
      { header: 'Event Date', key: 'EventDate', width: 20 },
      { header: 'Name', key: 'Name', width: 25 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Phone', key: 'Phone', width: 20 },
      { header: 'Company Name', key: 'CompanyName', width: 30 },
      { header: 'Comment', key: 'Comment', width: 40 },
      { header: 'Transaction ID', key: 'TransactionID', width: 30 },
      { header: 'Transaction Photo', key: 'TransactionPhoto', width: 40 },
      { header: 'Status', key: 'Status', width: 20 },
      { header: 'Person Count', key: 'PersonCount', width: 15 },
      { header: 'Created At', key: 'CreatedAt', width: 25 },
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

export default EventAttendeesExcel;
