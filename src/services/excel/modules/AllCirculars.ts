import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import FileService from '../../fileService/fileService';
import { FOLDER_NAMES, RESPONSE_CODE } from '../../../utils/constants';
import ApplyJob from '../../../models/ApplyJob';
import { isValidObjectId } from 'mongoose';
import ApiError from '../../../utils/ApiError';
import BookEvent from '../../../models/BookEvent';
import Event from '../../../models/Event';
import dayjs from 'dayjs';
import DownloadAndCircular from '../../../models/DownloadAndCircular';

class AllCirculars extends ExcelService {
    private workSheetName = 'Circulars';
    private fileService = new FileService();

    async getMatchStage(filters: {
        fromDate: string;
        toDate: string;
    }) {
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
    getFile = (fileName?: string) => {
        return fileName
            ? this.fileService.getFilePathFromDatabase(
                FOLDER_NAMES.CIRCULAR,
                [FOLDER_NAMES.CIRCULAR, fileName]
            )
            : '';
    };
    mapToExcelRowWithFilePaths(data: any): Record<string, any> {
       
        return {
            ID: data?._id ?? '',
            Heading: data?.Heading ?? '',
            Description: data?.Description ?? '',
            Date: new Date(data?.Date)?.toISOString()?.split('T')[0] ?? '',
            Active: data.active ? 'Active' : 'Inactive',
            CreatedAt: data.createdAt
                ? new Date(data.createdAt)?.toISOString()?.split('T')[0]
                : '',
            UpdatedAt: data.updatedAt
                ? new Date(data.updatedAt)?.toISOString()?.split('T')[0]
                : '',
            Document: data?.Document ? this.getFile(data.Document) : '',

        };
    }

    async generate(res: Response, { filters }: { filters: any }) {
        const sheet = this.createWorksheet(this.workSheetName);

        const matchStage = (await this.getMatchStage(filters)) || {};
        console.log("matchStage", matchStage);
        const eventAttendees = await DownloadAndCircular.find(matchStage).lean();
        const rows = eventAttendees.map(item =>
            this.mapToExcelRowWithFilePaths(item)
        );

        this.setColumns(sheet, [
            { header: 'ID', key: 'ID', width: 24 },
            { header: 'Heading', key: 'Heading', width: 30 },
            { header: 'Description', key: 'Description', width: 50 },
            { header: 'Date', key: 'Date', width: 15 },
            { header: 'Active', key: 'Active', width: 15 },
            { header: 'Created At', key: 'CreatedAt', width: 20 },
            { header: 'Updated At', key: 'UpdatedAt', width: 20 },
            { header: 'Document', key: 'Document', width: 50 },

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

export default AllCirculars;
