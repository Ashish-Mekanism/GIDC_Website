"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const SponsorshipSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
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
        enum: Object.values(constants_1.SPONSORSHIP_APPROVAL_STATUS),
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
}, {
    timestamps: true,
});
const Sponsorship = (0, mongoose_1.model)(constants_1.DbModel.Sponsorship, SponsorshipSchema);
exports.default = Sponsorship;
