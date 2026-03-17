"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const AdminContactUsSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Address: { type: String },
    PhoneNumber: { type: String },
    Email: { type: String },
    Linkedin: { type: String },
    Facebook: { type: String },
    Twitter: { type: String },
}, { timestamps: true });
const AdminContactUs = (0, mongoose_1.model)(constants_1.DbModel.AdminContactUs, AdminContactUsSchema);
exports.default = AdminContactUs;
