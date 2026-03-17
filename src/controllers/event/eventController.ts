import { EventService } from '../../services/admin/event/eventService';
import { CustomRequest } from '../../types/common';
import {
  IActiveInactiveEvent,
  IApproveDeclineRegistration,
  IEventBody,
} from '../../types/requests';
import asyncHandler from '../../utils/asyncHandler';
import { Response } from 'express';
import {
  SuccessResponseWithData,
  SuccessResponseWithoutData,
} from '../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';

const createEvent = asyncHandler(
  async (req: CustomRequest<IEventBody>, res: Response) => {
    const eventService = new EventService();

    const payload = req?.body;
    const userid = req?.user_id;
    const files = req.files;

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const eventCreated = await eventService.createEvent(payload, userid, files);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Event Created Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventCreated
    );
  }
);

const updateEvent = asyncHandler(
  async (req: CustomRequest<IEventBody>, res: Response) => {
    const eventService = new EventService();
    const payload = req.body;
    const userid = req?.user_id;
    const eventId = req?.params.id;
    const files = req?.files;


    if (!userid) {
      throw new Error('User ID is required to update a member.');
    }
    const eventUpdated = await eventService.updateEvent(
      payload,
      eventId,
      files
    );

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Sub Telephone Uspdated Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventUpdated
    );
  }
);

const getUpComingEventList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const eventService = new EventService();

    const userid = req?.user_id;
    console.log(userid, ' userid');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const eventList = await eventService.getUpcomingEventList();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Event List Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventList
    );
  }
);

const getPastEventList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const eventService = new EventService();

    const userid = req?.user_id;
    console.log(userid, ' userid');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const eventList = await eventService.getPastEventList();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Past Event List Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventList
    );
  }
);

const getEventDetails = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const eventService = new EventService();

    const userid = req?.user_id;
    const eventId = req.params.id;
    console.log(userid, ' userid');
    console.log(eventId, ' eventId');

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const photoGallery = await eventService.getEventDetails(eventId);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Photo Gallery Success',
      API_RESPONSE_STATUS.SUCCESS,
      photoGallery
    );
  }
);

const getEventAttendeesList = asyncHandler(
  async (req: CustomRequest<Request>, res: Response) => {
    const eventService = new EventService();

    const userid = req?.user_id;
    const eventId = req.params.id;

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const eventList = await eventService.getEventAttendeesList(eventId);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'Event List Success',
      API_RESPONSE_STATUS.SUCCESS,
      eventList
    );
  }
);

const eventActiveInactive = asyncHandler(
  async (req: CustomRequest<IActiveInactiveEvent>, res: Response) => {
    const eventService = new EventService();
    const payload = req.body;
    const eventId = payload.eventId;
    const action = payload.action;

    console.log(payload, 'paylooadd');

    const approvalStatus = await eventService.activeInactiveEvent(
      eventId,
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

const approveDeclineEventRegistration = asyncHandler(
  async (req: CustomRequest<IApproveDeclineRegistration>, res: Response) => {
    const eventService = new EventService();

    const payload = req?.body;
    const userid = req?.user_id;

    if (!userid) {
      throw new Error('User ID is required.');
    }

    const registrationAction =
      await eventService.approveDeclineEventRegistration(payload, userid);

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.CREATED,
      registrationAction.message,
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

export default {
  createEvent,
  updateEvent,
  getUpComingEventList,
  getPastEventList,
  getEventDetails,
  getEventAttendeesList,
  eventActiveInactive,
  approveDeclineEventRegistration,
};
