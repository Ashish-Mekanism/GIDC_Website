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
import WebDirectoryModel from '../../../models/WebDirectory';

class AllWebDirectory extends ExcelService {
    private workSheetName = 'Web Directory';
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
            userId: data?.userId ?? '',
            created_by: data?.created_by ?? '',
            companyName: data?.companyName ?? '',
            companyLogo: data?.companyLogo ? this.getFile(data.companyLogo) : '',
            personalPhone: data?.personalPhone ?? '',
            companyPhone: data?.companyPhone ?? '',
            personalEmail: data?.personalEmail ?? '',
            companyEmail: data?.companyEmail ?? '',
            companyProfile: data?.companyProfile ?? '',
            productDetails: data?.productDetails ?? '',
            product: data?.product ?? '',
            location: data?.location ?? '',
            active: data.active ? 'Active' : 'Inactive',
            createdAt: data.createdAt
                ? new Date(data.createdAt)?.toISOString()?.split('T')[0]
                : '',
            updatedAt: data.updatedAt
                ? new Date(data.updatedAt)?.toISOString()?.split('T')[0]
                : '',
          

        };
    }

    async generate(res: Response, { filters }: { filters: any }) {
        const sheet = this.createWorksheet(this.workSheetName);

        const matchStage = (await this.getMatchStage(filters)) || {};
        console.log("matchStage", matchStage);
        const eventAttendees = await WebDirectoryModel.find(matchStage).lean();
        const rows = eventAttendees.map(item =>
            this.mapToExcelRowWithFilePaths(item)
        );

        this.setColumns(sheet, [
            { header: 'ID', key: 'ID', width: 24 },
            { header: 'userId', key: 'userId', width: 30 },
            { header: 'created_by', key: 'created_by', width: 30 },
            { header: 'companyName', key: 'companyName', width: 30 },
            { header: 'companyLogo', key: 'companyLogo', width: 30 },
            { header: 'personalPhone', key: 'personalPhone', width: 15 },
            { header: 'companyPhone', key: 'companyPhone', width: 15 },
            { header: 'personalEmail', key: 'personalEmail', width: 15 },
            { header: 'companyEmail', key: 'companyEmail', width: 15 },
            { header: 'companyProfile', key: 'companyProfile', width: 15 },
            { header: 'productDetails', key: 'productDetails', width: 15 },
            { header: 'product', key: 'product', width: 15 },
            { header: 'location', key: 'location', width: 15 },
            { header: 'active', key: 'active', width: 15 },
            { header: 'createdAt', key: 'createdAt', width: 15 },
            { header: 'updatedAt', key: 'updatedAt', width: 15 },
            

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

export default AllWebDirectory;
