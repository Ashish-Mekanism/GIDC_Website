import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel, JOB_LOCATION, JOB_POSTING_STATUS, JOB_TYPE } from "../utils/constants";
import { ICareerOpportunity } from "../types/models";

const CareerOpportunitySchema = new Schema<ICareerOpportunity>(
    {
        userId: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.User,
            required: true,
        },
        jobTitle: { type: String },
        jobType: { type: String, enum: Object.values(JOB_TYPE) },
        jobDescription: { type: String },
        jobLocation: { type: String, enum: Object.values(JOB_LOCATION) },
        companyAddress: { type: String },
        applicationDeadline: { type: Date },
        associationName: { type: String },
        email: { type: String },
        jobIndustry: { type: String },
        requiredExperience: { type: String },

        requiredPerson: { type: String },

        approveStatus: {
            type: Number,
            enum: Object.values(JOB_POSTING_STATUS),
        },
        active: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const CareerOpportunityModel = model<ICareerOpportunity>(
    DbModel.CareerOpportunity,
    CareerOpportunitySchema
);

export default CareerOpportunityModel;