import { Response } from 'express';
import { isValidDayjs } from '../../../utils/helper';
import ExcelService from '../base/excelService';
import {
  ACCOUNT_STATUS,
  MEMBER_APPROVAL_STATUS,
  USER_TYPE,
} from '../../../utils/constants';
import User from '../../../models/User';
type FilterValue = string | number | boolean | undefined | null;

class UsersExcel extends ExcelService {
  private workSheetName = 'Users';
  parseFilterValue(value: FilterValue, type: 'number' | 'boolean' | 'string') {
    if (value === undefined || value === null || value === '') return undefined;

    switch (type) {
      case 'number': {
        const n = Number(value);
        return Number.isNaN(n) ? undefined : n;
      }
      case 'boolean':
        if (value === 'true' || value === true || value === '1' || value === 1)
          return true;
        if (
          value === 'false' ||
          value === false ||
          value === '0' ||
          value === 0
        )
          return false;
        return undefined;
      case 'string':
        return String(value);
    }
  }
  async getMatchStage(filters: {
    fromDate: string;
    toDate: string;
    approved: string | number;
    active: string | boolean;
    user_type: string;
    is_Email_Verified: string;
    approval_status: string;
    account_status: string;
    is_Member:string;
  }) {
    const { fromDate, toDate, ...rest } = filters;
    const matchStage: Record<string, any> = {};

    // Date filter
    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    // Config-driven filters
    const schema: Record<string, 'number' | 'boolean' | 'string'> = {
      user_type: 'number',
      is_Email_Verified: 'boolean',
      approval_status: 'number',
      account_status: 'number',
      is_Member: 'boolean',
    };

    Object.entries(schema).forEach(([key, type]) => {
      const parsed = this.parseFilterValue(
        rest[key as keyof typeof rest],
        type
      );
      if (parsed !== undefined) {
        matchStage[key] = parsed;
      }
    });
    return matchStage;
  }

  mapToExcelRowWithFilePaths(data: any): Record<string, any> {
    return {
      UserID: data._id ?? '',
      Username: data.user_name ?? '',
      Email: data.email ?? '',
      IsMember: data.is_Member ? 'Yes' : 'No',
      UserType:
        data.user_type === USER_TYPE.SUPER_ADMIN
          ? 'SUPER_ADMIN'
          : data.user_type === USER_TYPE.SUB_ADMIN
            ? 'SUB_ADMIN'
            : data.user_type === USER_TYPE.USER
              ? 'USER'
              : 'Unknown',
      EmailVerified: data.is_Email_Verified ? 'Verified' : 'Not Verified',
      ApprovalStatus:
        data.approval_status === MEMBER_APPROVAL_STATUS.APPROVED
          ? 'Approved'
          : data.approval_status === MEMBER_APPROVAL_STATUS.PENDING
            ? 'Pending'
            : 'Declined',
      AccountStatus:
        data.account_status === ACCOUNT_STATUS.ACTIVE
          ? 'Active'
          : 'Deactivated',
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
    const Users = await User.find(matchStage);

    const rows = Users.map(item => this.mapToExcelRowWithFilePaths(item));
    this.setColumns(sheet, [
      { header: 'User ID', key: 'UserID', width: 25 },
      { header: 'Username', key: 'Username', width: 30 },
      { header: 'Email', key: 'Email', width: 35 },
      { header: 'Is Member', key: 'IsMember', width: 15 },
      { header: 'User Type', key: 'UserType', width: 20 },
      { header: 'Email Verified', key: 'EmailVerified', width: 20 },
      { header: 'Approval Status', key: 'ApprovalStatus', width: 20 },
      { header: 'Account Status', key: 'AccountStatus', width: 20 },
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

export default UsersExcel;
