import { model, Schema, SchemaTypes } from 'mongoose';
import { DbModel, REGISTRATION } from '../utils/constants';
import { IEvent } from '../types/models';

const EventSchema: Schema<IEvent> = new Schema(
  {
    CreatedBy: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.User,
      index: true,
      required: true,
    },
    EventTitle: {
      type: String,
    },
    Photo: {
      type: String,
    },
    Description: {
      type: String,
    },
    Date: {
      type: String,
    },
    StartTime: {
      type: String,
      required: true,
    },
    EndTime: {
      type: String,
      required: true,
    },

    Registration: {
      type: String,
      enum: Object.values(REGISTRATION),
      required: true,
    },
    Speaker: {
      type: String,
    },
    Fee: {
      type: Number,
    },
    Capacity: {
      type: Number,
    },
    Location: {
      LocationName: { type: String },
      Address: { type: String },
      City: { type: String },
      State: { type: String },
      PostCode: { type: String },
      Region: { type: String },
      Country: { type: String },
    },
    QRCodePhoto: {
      type: String,
    },
    UpiId: {
      type: String,
    },
    IsUpi: {
      type: Boolean,
      default: false,
    },
    IsQrCode: {
      type: Boolean,
      default: false,
    },
    Active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Event = model<IEvent>(DbModel.Event, EventSchema);

export default Event;
