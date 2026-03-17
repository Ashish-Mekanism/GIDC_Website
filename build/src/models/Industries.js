"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const IndustriesSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Photo: { type: String },
    IndustriesName: { type: String },
}, { timestamps: true });
const Industries = (0, mongoose_1.model)(constants_1.DbModel.Industries, IndustriesSchema);
exports.default = Industries;
