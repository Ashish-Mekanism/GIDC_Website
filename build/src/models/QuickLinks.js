"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const QuickLinkSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Icon: { type: String }, // Optional icon URL
    Title: { type: String },
    Links: [
        {
            title: { type: String },
            url: { type: String },
        },
    ],
}, { timestamps: true });
const QuickLink = (0, mongoose_1.model)(constants_1.DbModel.QuickLink, QuickLinkSchema);
exports.default = QuickLink;
