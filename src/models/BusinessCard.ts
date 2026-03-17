
import { model, Schema, SchemaTypes } from "mongoose";
import { IBusinessCard } from "../types/models";
import { DbModel } from "../utils/constants";

const BusinessCardSchema = new Schema<IBusinessCard>({
  created_by: {
    type: SchemaTypes.ObjectId,
    ref: DbModel.User
  },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: DbModel.User,
    required: true,
  },
  name: { type: String },
  organisation: { type: String },
  websiteUrl: { type: String },
  jobTitle: { type: String },
  phone: { type: String },
  officePhone: { type: String },
  whatsappNo: { type: String },
  email: { type: String },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zip: { type: String },
  socialMedia: {
    facebookUrl: { type: String },
    twitterUrl: { type: String },
    googleUrl: { type: String },
    instagramUrl: { type: String },
    linkedInUrl: { type: String },
    youtubeUrl: { type: String },
    pinterestUrl: { type: String },
    mapUrl: { type: String },
  },
  aboutProfile: { type: String },
  profilePhoto: { type: String },
  active: { type: Boolean },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});


// Export the Mongoose model
const BusinessCardModel = model<IBusinessCard>(
  DbModel.BusinessCard,
  BusinessCardSchema
);

export default BusinessCardModel;