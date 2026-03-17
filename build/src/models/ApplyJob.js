"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const ApplyJobSchema = new mongoose_1.Schema({
    careerOpportunityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.DbModel.CareerOpportunity,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    industryJob: {
        type: String,
    },
    contactNo: {
        type: String,
    },
    currentAddress: {
        type: String,
    },
    resume: {
        type: String,
    }
}, { timestamps: { createdAt: true, updatedAt: false } });
const ApplyJob = (0, mongoose_1.model)(constants_1.DbModel.ApplyJob, ApplyJobSchema);
exports.default = ApplyJob;
