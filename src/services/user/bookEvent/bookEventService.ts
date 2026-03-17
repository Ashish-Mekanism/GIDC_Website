import { ObjectId } from 'mongoose';
import BookEvent from '../../../models/BookEvent';
import { toObjectId } from '../../../utils/helper';
import Event from '../../../models/Event';
import { IBookEventBody } from '../../../types/requests';
import ApiError from '../../../utils/ApiError';
import { EventsEmailKeys, RESPONSE_CODE } from '../../../utils/constants';
import { SendEmailTemplateMail } from '../../emailService';

export class BookEventService {
  sendEmailTemplateMail = new SendEmailTemplateMail();

  async bookEvent(payload: Partial<IBookEventBody>, file: any) {
    const {
      eventId,
      name,
      email,
      phone,
      companyName,
      comment,
      transactionId,
      personCount,
    } = payload;

    if (!eventId) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Event ID is required.');
    }

    const eventExist = await Event.findById(toObjectId(eventId));
    if (!eventExist) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Event not found.');
    }

    if (!personCount) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Person count is required.'
      );
    }
    if (isNaN(+personCount)) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Person count must be a valid number.'
      );
    }
    if (+personCount < 1) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Person count should be 1 or more.'
      );
    }
    const transactionPhoto = file?.filename || null;

    // Create a new booking instance
    const bookEvent = new BookEvent({
      eventId: toObjectId(eventId),
      name,
      email,
      phone,
      companyName,
      comment,
      //userId, // Associate the booking with the user
      transactionId,
      transactionPhoto: transactionPhoto,
      eventDate: eventExist.Date,
      personCount: +personCount,
    });

    // Save the booking in the database
    const userBooking = await bookEvent.save();
    await this.sendEmailTemplateMail.sendEventEmailToUser(
      userBooking?._id?.toString(),
      EventsEmailKeys.EVENT_REQUEST_RECEIVED_USER
    );
    await this.sendEmailTemplateMail.sendEventEmailToAdmin(
      userBooking?._id?.toString()
    );
    return bookEvent;
  }
}
