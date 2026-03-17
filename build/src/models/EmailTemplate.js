"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const EmailTemplateSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
    },
    emailTo: {
        type: [String],
    },
}, { timestamps: true });
const EmailTemplateModel = (0, mongoose_1.model)(constants_1.DbModel.EmailTemplate, EmailTemplateSchema);
exports.default = EmailTemplateModel;
