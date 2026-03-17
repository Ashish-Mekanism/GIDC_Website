import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import NocFormModel from '../../../models/NocNoDue';

import FileService from '../../fileService/fileService';
import { FOLDER_NAMES } from '../../../utils/constants';

class NOCNoDueExcel extends ExcelService {
  private workSheetName = 'NOC_No_Due';
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
    const { userId, attachments, chequeDetails } = data;

    const getFile = (fileName?: string) => {
      return fileName
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
            userId,
            fileName,
          ])
        : '';
    };

    return {
      ID: data._id ?? '',
      UserID: userId ?? '',
      Email: data?.email ?? '',
      IndustryName: data?.industryName ?? '',
      IndustryAddress: data?.industryAddress ?? '',
      IndustryType: data?.industryType ?? '',
      TelephoneNo: data?.telephoneNo ?? '',
      IsMember: data?.isMember ?? '',
      IsContributionFiled: data?.isContributionFiled ?? '',
      MembershipNo: data?.membershipNo ?? '',
      Year: data?.year ?? '',
      ReceiptNo: data?.receiptNo ?? '',
      ApplicationType: Array.isArray(data?.applicationType)
        ? data.applicationType.join(', ')
        : (data?.applicationType ?? ''),
      FeeForWaterNoc: data?.feeForWaterNoc ?? '',
      PlotNo: data?.plotNo ?? '',
      RefNo: data?.refNo ?? '',
      RoadNo: data?.roadNo ?? '',
      GSTNo: data?.gstNo ?? '',
      ChequeBankName: chequeDetails?.bankName ?? '',
      ChequeBranchName: chequeDetails?.branchName ?? '',
      ChequeNo: chequeDetails?.chequeNo ?? '',
      ChequeDate: chequeDetails?.chequeDate ?? '',
      ChequeAmountNumber: chequeDetails?.chequeAmountNumber ?? '',
      ChequeAmountWords: chequeDetails?.chequeAmountWords ?? '',
      ChequePhoto: getFile(chequeDetails?.chequePhoto),
      ApplicationLetter: getFile(attachments?.applicationLetter),
      WaterBill: getFile(attachments?.waterBill),
      LightBill: getFile(attachments?.lightBill),
      TaxBill: getFile(attachments?.taxBill),
      OtherDocumentImage: getFile(attachments?.otherDocumentImage),
      OtherDocumentName: attachments?.otherDocumentName ?? '',
      PublishDate: data.publishDate ?? '',
      CreatedAt: data.createdAt ?? '',
      UpdatedAt: data.updatedAt ?? '',
      GidcLetterRefNo: attachments?.gidc?.gidcLetterRefNo ?? '',
      GidcDate: attachments?.gidc?.gidcDate ?? '',
      TorrentServiceNo: attachments?.torrent?.torrentServiceNo ?? '',
      TorrentNo: attachments?.torrent?.torrentNo ?? '',
      TorrentName: attachments?.torrent?.torrentName ?? '',
      TorrentDate: attachments?.torrent?.torrentDate ?? '',
      AmcTaxBillTenamentNo: attachments?.amcTaxBill?.amcTaxTenamentNo ?? '',
      AmcTaxBillYear: attachments?.amcTaxBill?.amcTaxYear ?? '',
      AmcTaxBillPaidAmount: attachments?.amcTaxBill?.amcTaxPaidAmount ?? '',
      AmcTaxBillName: attachments?.amcTaxBill?.amcTaxName ?? '',
      WaterConnectionNo: attachments?.water?.waterConnectionNo ?? '',
      WaterBillNo: attachments?.water?.waterBillNo ?? '',
      WaterBillDate: attachments?.water?.waterBillDate ?? '',
      WaterConsumptionPeriod: attachments?.water?.waterConsumptionPeriod ?? '',
      WaterBillName: attachments?.water?.waterBillName ?? '',
    };
  }

  async generate(res: Response, { filters }: { filters: any }) {
    const sheet = this.createWorksheet(this.workSheetName);
    const matchStage = (await this.getMatchStage(filters)) || {};

    const complaints = await NocFormModel.find(matchStage).lean();
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

export default NOCNoDueExcel;
