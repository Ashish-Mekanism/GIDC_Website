import { DownloadAndCircularService } from '../../services/admin/downloadAndCircular/downloadAndCircularService';
import { CustomRequest } from '../../types/common';
import {
  IActiveInactiveCircular,
  IDownloadAndCircularBody,
} from '../../types/requests';
import asyncHandler from '../../utils/asyncHandler';
import { Response } from 'express';
import {
  SuccessResponseWithData,
  SuccessResponseWithoutData,
} from '../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';

const createCircular = asyncHandler(
  async (req: CustomRequest<IDownloadAndCircularBody>, res: Response) => {
    const downloadAndCircularService = new DownloadAndCircularService();

    const payload = req?.body;
    const userid = req?.user_id;
    const file = req.file;

    console.log(payload, 'payload');
    console.log(file, 'file');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const eventCreated = await downloadAndCircularService.createCircular(
      payload,
      userid,
      file
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Circular Created Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventCreated
    );
  }
);

const updateCircular = asyncHandler(
  async (req: CustomRequest<IDownloadAndCircularBody>, res: Response) => {
    const downloadAndCircularService = new DownloadAndCircularService();
    const payload = req.body;
    const userid = req?.user_id;
    const circularId = req?.params.id;
    //    const file = req?.file
    console.log(payload, ' payload');
    console.log(circularId, ' circularId');

    if (!userid) {
      throw new Error('User ID is required to update a member.');
    }
    const ciruclarUpdated = await downloadAndCircularService.updateCircular(
      payload,
      circularId
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Circular Uspdated Success ',
      API_RESPONSE_STATUS.SUCCESS,
      ciruclarUpdated
    );
  }
);

const getCircularList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const downloadAndCircularService = new DownloadAndCircularService();

    const userid = req?.user_id;
    const query = req.query;

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const circularList = await downloadAndCircularService.getCircularList(query);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Circular List Success',
      API_RESPONSE_STATUS.SUCCESS,
      circularList
    );
  }
);

const getCircularDetails = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const downloadAndCircularService = new DownloadAndCircularService();

    const userid = req?.user_id;
    const circularId = req.params.id;
    console.log(userid, ' userid');
    console.log(circularId, ' circularId');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const circularDetails =
      await downloadAndCircularService.getCircularDetails(circularId);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Circular Details Success',
      API_RESPONSE_STATUS.SUCCESS,
      circularDetails
    );
  }
);

const circularActiveInactive = asyncHandler(
  async (req: CustomRequest<IActiveInactiveCircular>, res: Response) => {
    const downloadAndCircularService = new DownloadAndCircularService();
    const payload = req.body;
    const downlaodAndCircular_Id = payload.downlaodAndCircularId;
    const action = payload.action;

    console.log(payload, 'paylooadd');

    const approvalStatus =
      await downloadAndCircularService.activeInactiveCircular(
        downlaodAndCircular_Id,
        action
      );

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      approvalStatus.message, // Use the message from the `approvalStatus` object
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

export default {
  createCircular,
  updateCircular,
  getCircularList,
  getCircularDetails,
  circularActiveInactive,
};
