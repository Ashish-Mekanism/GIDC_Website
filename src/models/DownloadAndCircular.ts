import { model, Schema, SchemaTypes } from 'mongoose';
import {
  CIRCULAR_LIST_CATEGORIES,
  DbModel,
  REGISTRATION,
} from '../utils/constants';
import { IDownloadAndCircular, IEvent } from '../types/models';

const DownloadAndCircularSchema: Schema<IDownloadAndCircular> = new Schema(
  {
    CreatedBy: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.User,
      index: true,
      required: true,
    },
    Heading: {
      type: String,
      require: true,
    },
    Document: {
      type: String,
    },
    Description: {
      type: String,
    },
    Date: {
      type: Date,
    },
    Category: {
      type: String,
      enum: Object.values(CIRCULAR_LIST_CATEGORIES),
      required: true,
    },
    Active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DownloadAndCircular = model<IDownloadAndCircular>(
  DbModel.DownloadAndCircular,
  DownloadAndCircularSchema
);

export default DownloadAndCircular;
