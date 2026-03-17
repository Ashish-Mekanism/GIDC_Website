import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import FileService from '../../fileService/fileService';
import { FOLDER_NAMES } from '../../../utils/constants';
import Event from '../../../models/Event';
import dayjs from 'dayjs';

class AllEvent extends ExcelService {
    private fileService = new FileService();

    async getMatchStage(filters: {
        fromDate: string;
        toDate: string;
        type: string;
    }) {
        const { fromDate, toDate, type } = filters;

        const validFromDate = isValidDayjs(fromDate);
        const validToDate = isValidDayjs(toDate);
        const matchStage: any = {};

        // Date Filter
        if (fromDate || toDate) {
            matchStage.Date = {};
            if (fromDate) matchStage.Date.$gte = fromDate;
            if (toDate) matchStage.Date.$lte = toDate;
        }

        // Event type filters
        const today = dayjs().startOf('day').toDate();
        if (type === 'upcoming') {
            matchStage.Date = { $gte: today };
        } else if (type === 'past') {
            matchStage.Date = { $lt: today };
        }

        return matchStage;
    }

    getFile = (fileName?: string) => {
        return fileName
            ? this.fileService.getFilePathFromDatabase(
                FOLDER_NAMES.EVENT,
                [FOLDER_NAMES.EVENT, fileName]
            )
            : '';
    };

    mapToExcelRowWithFilePaths(data: any): Record<string, any> {
        return {
            ID: data?._id ?? '',
            EventDate: data?.Date ?? '',
            Title: data?.EventTitle ?? '',
            Description: data?.Description ?? '',
            StartTime: data?.StartTime ?? '',
            EndTime: data?.EndTime ?? '',
            Registration: data?.Registration ?? '',
            Speaker: data?.Speaker ?? '',
            Photo: data?.Photo ? this.getFile(data.Photo) : '',
            Capacity: data?.Capacity ?? '',
            Location: data?.Location ?? '',
            Fee: data?.Fee ?? '',
            CreatedAt: data?.createdAt ?? '',
            UpdatedAt: data?.updatedAt ?? '',
        };
    }

    async generate(res: Response, { filters }: { filters: any }) {
        // Set worksheet name dynamically based on type
        let workSheetName = 'All Event';
        if (filters?.type === 'upcoming') workSheetName = 'Upcoming Event';
        else if (filters?.type === 'past') workSheetName = 'Past Event';

        const sheet = this.createWorksheet(workSheetName);

        const matchStage = (await this.getMatchStage(filters)) || {};
        console.log("matchStage", matchStage);

        const events = await Event.find(matchStage).lean();
        const rows = events.map(item =>
            this.mapToExcelRowWithFilePaths(item)
        );

        this.setColumns(sheet, [
            { header: 'ID', key: 'ID', width: 24 },
            { header: 'Event Date', key: 'EventDate', width: 15 },
            { header: 'Title', key: 'Title', width: 30 },
            { header: 'Description', key: 'Description', width: 30 },
            { header: 'Start Time', key: 'StartTime', width: 15 },
            { header: 'End Time', key: 'EndTime', width: 15 },
            { header: 'Registration', key: 'Registration', width: 25 },
            { header: 'Speaker', key: 'Speaker', width: 25 },
            { header: 'Photo', key: 'Photo', width: 40 },
            { header: 'Capacity', key: 'Capacity', width: 10 },
            { header: 'Location', key: 'Location', width: 20 },
            { header: 'Fee', key: 'Fee', width: 10 },
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
            `attachment; filename=${workSheetName}.xlsx`
        );

        await this.workbook.xlsx.write(res);
        res.end();
    }
}

export default AllEvent;
