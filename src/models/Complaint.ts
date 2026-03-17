import { model, Schema, SchemaTypes } from "mongoose";
import { IComplaint } from "../types/models";
import {
  COMPLAINT_STATUS,
  DbModel,
  UNIQUE_COUNTER_ID,
} from "../utils/constants";
import Counter from "./Counter";
const requiredIfNotExported = function (this: any) {
  return !this.isExported;
};

const requiredIfCreatedByUser = function (this: any) {
  return !this.isCreatedByAdmin;
};
const ComplaintSchema = new Schema<IComplaint>(
  {
    serviceNumber: { type: Number, unique: true },
    userId: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.User,
      required: !requiredIfNotExported && !requiredIfCreatedByUser,
    },
    membershipNo: { type: String },
    email: { type: String },
    mobile: { type: String },
    phone: { type: String },
    complaint_photo: [{ type: String }], // This can store image URL
    companyName: { type: String },
    personName: { type: String },
    roadNo: { type: String },
    address: { type: String },
    serviceCategory: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.ServiceCategory,
    },
    ServiceCategoryName: {
      type: String,
    },
    serviceDetails: { type: String },
    status: {
      type: Number,
      enum: Object.values(COMPLAINT_STATUS),
    },
    assignContractor: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.Contractor,
    },
    assignedContractorAt: {
      type: Date,
    },
    completedServiceAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    waterConnectionNo: {
      type: String,
      required: requiredIfNotExported,
    },
    isExported: {
      type: Boolean,
      default: false,
    },
    isCreatedByAdmin: { type: Boolean, default: false },
    createdByAdminId: { type: SchemaTypes.ObjectId, ref: DbModel.User },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      // Use MongoDB's default retry logic for better reliability
      runValidators: true,
    }
  );

  return sequenceDocument!.seq;
}

ComplaintSchema.pre("save", async function (next) {
  // Only auto-increment if this is a new document and serviceNumber is not already set
  if (this.isNew && !this.serviceNumber) {
    try {
      this.serviceNumber = await getNextSequenceValue(
        UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER
      );

      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

ComplaintSchema.statics.getNextServiceNumber =
  async function (): Promise<number> {
    // This doesn't increment, just peeks at what the next number would be
    const counter = await Counter.findById(
      UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER
    );
    return (counter?.seq || 0) + 1;
  };

// Static method to reset counter (useful for testing or admin operations)
ComplaintSchema.statics.resetServiceNumberCounter = async function (
  startFrom: number = 0
): Promise<void> {
  await Counter.findByIdAndUpdate(
    UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER,
    { seq: startFrom },
    { upsert: true }
  );
};
// Export the Mongoose model
const ComplaintModel = model<IComplaint>(DbModel.Complaint, ComplaintSchema);

export default ComplaintModel;

/*
What You Should Do After Import
// Find the max serviceNumber from all imported records
const maxImportedNumber = await ComplaintModel.findOne()
  .sort({ serviceNumber: -1 })
  .select('serviceNumber')
  .lean();

await Counter.findByIdAndUpdate(
  UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER,
  { seq: maxImportedNumber?.serviceNumber ?? 0 },
  { upsert: true }
);

*/
