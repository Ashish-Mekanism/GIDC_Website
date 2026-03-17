"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const TelephoneSchema = new mongoose_1.Schema({
    Title: { type: String, required: true, unique: true },
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Active: {
        type: Boolean,
        require: true,
    }
}, { timestamps: true });
const Telephone = (0, mongoose_1.model)(constants_1.DbModel.Telephone, TelephoneSchema);
exports.default = Telephone;
