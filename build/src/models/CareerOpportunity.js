"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const CareerOpportunitySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: true,
    },
    jobTitle: { type: String },
    jobType: { type: String, enum: Object.values(constants_1.JOB_TYPE) },
    jobDescription: { type: String },
    jobLocation: { type: String, enum: Object.values(constants_1.JOB_LOCATION) },
    companyAddress: { type: String },
    applicationDeadline: { type: Date },
    associationName: { type: String },
    email: { type: String },
    jobIndustry: { type: String },
    requiredExperience: { type: String },
    requiredPerson: { type: String },
    approveStatus: {
        type: Number,
        enum: Object.values(constants_1.JOB_POSTING_STATUS),
    },
    active: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const CareerOpportunityModel = (0, mongoose_1.model)(constants_1.DbModel.CareerOpportunity, CareerOpportunitySchema);
exports.default = CareerOpportunityModel;
