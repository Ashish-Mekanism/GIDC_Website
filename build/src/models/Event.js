"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const EventSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
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
        enum: Object.values(constants_1.REGISTRATION),
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
}, { timestamps: true });
const Event = (0, mongoose_1.model)(constants_1.DbModel.Event, EventSchema);
exports.default = Event;
