"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const CommitteeMemberSchema = new mongoose_1.Schema({
    CommitteeModelId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.Committee,
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
    Designation: {
        type: String,
        require: true,
    },
    Photo: {
        type: String,
    },
}, { timestamps: true });
const CommitteeMember = (0, mongoose_1.model)(constants_1.DbModel.CommitteeMember, CommitteeMemberSchema);
exports.default = CommitteeMember;
