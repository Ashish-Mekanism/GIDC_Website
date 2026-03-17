import { CustomRequest } from '../../../types/common';
import asyncHandler from '../../../utils/asyncHandler';
import { Response } from 'express';
import { SuccessResponseWithData } from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';

import { emailTemplateService } from '../../../services/admin/emailTemplate';
import {
  IEditEmailTemplateBody,
  IUpdateConfigBody,
} from '../../../types/requests';

// const deleteConfig = asyncHandler(
//   async (req: CustomRequest<Request>, res: Response) => {
//     const key = req?.params?.key;

//     await configService.deleteConfig(key);
//     SuccessResponseWithoutData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'Deleted Config',
//       API_RESPONSE_STATUS.SUCCESS
//     );
//   }
// );
// const getConfig = asyncHandler(
//   async (req: CustomRequest<Request>, res: Response) => {
//     const key = req?.params?.key;

//     const config = await configService.getConfig(key);
//     SuccessResponseWithData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'Get Config Success',
//       API_RESPONSE_STATUS.SUCCESS,
//       config
//     );
//   }
// );
// const getAllConfig = asyncHandler(
//   async (_req: CustomRequest<Request>, res: Response) => {
//     const configList = await configService.getAllConfig();
//     SuccessResponseWithData(
//       res,
//       RESPONSE_CODE.SUCCESS,
//       'All Configs',
//       API_RESPONSE_STATUS.SUCCESS,
//       configList
//     );
//   }
// );

const getServiceRequestsEmailTemplates = asyncHandler(
  async (_req: CustomRequest<Request>, res: Response) => {
    const templates =
      await emailTemplateService.getServiceRequestEmailTemplates();
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'All Service Request Templates',
      API_RESPONSE_STATUS.SUCCESS,
      templates
    );
  }
);
const getEventsEmailTemplates = asyncHandler(
  async (_req: CustomRequest<Request>, res: Response) => {
    const templates = await emailTemplateService.getEventEmailTemplates();
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'All Events Email Templates',
      API_RESPONSE_STATUS.SUCCESS,
      templates
    );
  }
);

const editEmailTemplate = asyncHandler(
  async (req: CustomRequest<IEditEmailTemplateBody>, res: Response) => {
    const key = req?.params?.key;
    const data = req?.body;
    const updatedTemplate = await emailTemplateService.editEmailTemplate(
      key,
      data
    );
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Updated Email Template',
      API_RESPONSE_STATUS.SUCCESS,
      updatedTemplate
    );
  }
);
export default {
  getServiceRequestsEmailTemplates,
  getEventsEmailTemplates,
  editEmailTemplate,
};
