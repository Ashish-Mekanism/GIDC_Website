import { CustomRequest } from '../../../types/common';
import asyncHandler from '../../../utils/asyncHandler';
import { Response } from 'express';
import {
  SuccessResponseWithData,
  SuccessResponseWithoutData,
} from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';

import { ICreateConfigBody, IUpdateConfigBody } from '../../../types/requests';
import { configService } from '../../../services/admin/config';

const createConfig = asyncHandler(
  async (req: CustomRequest<ICreateConfigBody>, res: Response) => {
    const key = req?.body?.key;
    const value = req?.body?.value;
    const config = await configService.createConfig(key, value);
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Created Config Success',
      API_RESPONSE_STATUS.SUCCESS,
      config
    );
  }
);
const editConfig = asyncHandler(
  async (req: CustomRequest<IUpdateConfigBody>, res: Response) => {
    const key = req?.params?.key;
    const value = req?.body?.value;
    const config = await configService.editConfig(key, value);
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Updated Config',
      API_RESPONSE_STATUS.SUCCESS,
      config
    );
  }
);
const deleteConfig = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const key = req?.params?.key;

    await configService.deleteConfig(key);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Deleted Config',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);
const getConfig = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const key = req?.params?.key;

    const config = await configService.getConfig(key);
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Get Config Success',
      API_RESPONSE_STATUS.SUCCESS,
      config
    );
  }
);
const getAllConfig = asyncHandler(
  async (_req: CustomRequest<Request>, res: Response) => {
    const configList = await configService.getAllConfig();
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'All Configs',
      API_RESPONSE_STATUS.SUCCESS,
      configList
    );
  }
);

export default {
  createConfig,
  editConfig,
  deleteConfig,
  getConfig,
  getAllConfig,
};
