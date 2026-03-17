"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const SubTelephoneSchema = new mongoose_1.Schema({
    TelephoneModelId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Name: {
        type: String,
        require: true,
    },
    Address: {
        type: String,
        require: true,
    },
    Contact1: {
        type: Number,
    },
    Contact2: {
        type: Number,
    },
    Photo: {
        type: String,
    },
}, { timestamps: true });
const SubTelephone = (0, mongoose_1.model)(constants_1.DbModel.SubTelephone, SubTelephoneSchema);
exports.default = SubTelephone;
