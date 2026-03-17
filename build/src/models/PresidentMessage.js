"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const PresidentMessageSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Photo: { type: String },
    Title: { type: String },
    Sub_Title: { type: String },
    Description: { type: String },
}, { timestamps: true });
const PresidentMessage = (0, mongoose_1.model)(constants_1.DbModel.PresidentMessage, PresidentMessageSchema);
exports.default = PresidentMessage;
