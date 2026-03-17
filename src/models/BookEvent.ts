import { Schema, model, Document } from 'mongoose';
import { IBookEvent } from '../types/models';
import { DbModel, EVENT_REGISTRATION_STATUS } from '../utils/constants';

const BookEventSchema = new Schema<IBookEvent>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: DbModel.Event,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: false },
    comment: { type: String, required: false },
    transactionId: { type: String, required: false },
    transactionPhoto: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(EVENT_REGISTRATION_STATUS),
      default: EVENT_REGISTRATION_STATUS.PENDING,
    },
    personCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookEvent = model<IBookEvent>(DbModel.BookEvent, BookEventSchema);

export default BookEvent;
