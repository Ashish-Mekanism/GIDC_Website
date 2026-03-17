"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const AboutSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Paragraph1: { type: String },
    Paragraph2: { type: String },
    Paragraph3: { type: String },
}, { timestamps: true });
const About = (0, mongoose_1.model)(constants_1.DbModel.About, AboutSchema);
exports.default = About;
