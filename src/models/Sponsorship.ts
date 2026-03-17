import { model, Schema, SchemaTypes } from 'mongoose';

import { ISponsorship } from '../types/models';
import { DbModel, SPONSORSHIP_APPROVAL_STATUS } from '../utils/constants';

const SponsorshipSchema = new Schema<ISponsorship>(
  {
    CreatedBy: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.User,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Phone: {
      type: Number,
      required: true,
    },
    Note: {
      type: String,
      required: true,
    },
    Approved: {
      type: Number,
      enum: Object.values(SPONSORSHIP_APPROVAL_STATUS),
    },
    Photo: {
      type: String,
    },
    Active: {
      type: Boolean,
    },
    StartDate: {
      type: Date,
    },
    EndDate: {
      type: Date,
    },
    Amount: {
      type: Number,
    },
    Url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Sponsorship = model<ISponsorship>(DbModel.Sponsorship, SponsorshipSchema);

export default Sponsorship;
