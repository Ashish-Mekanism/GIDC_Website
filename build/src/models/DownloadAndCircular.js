"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const DownloadAndCircularSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
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
        enum: Object.values(constants_1.CIRCULAR_LIST_CATEGORIES),
        required: true,
    },
    Active: { type: Boolean, default: true },
}, { timestamps: true });
const DownloadAndCircular = (0, mongoose_1.model)(constants_1.DbModel.DownloadAndCircular, DownloadAndCircularSchema);
exports.default = DownloadAndCircular;
