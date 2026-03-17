import { CustomRequest } from '../../../types/common';
import asyncHandler from '../../../utils/asyncHandler';
import { Response, Request } from 'express';
import { SuccessResponseWithData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import { AdminUserService } from '../../../services/admin/user/adminUserService';

const getUserList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const adminUserService = new AdminUserService();

    let query = req.query as { fromDate: string; toDate: string };
    const getUsersList = await adminUserService.getAllUsersList(query);
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,

      'Members List Success',
      API_RESPONSE_STATUS.SUCCESS,
      getUsersList
    );
  }
);

export default {
  getUserList,
};
