"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const TypeOfMembershipSchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        index: true,
        required: true
    },
    Title: { type: String },
    Description1: { type: String },
    Description2: { type: String },
    MembershipPoints: { type: [String] },
}, { timestamps: true });
const TypeOfMembership = (0, mongoose_1.model)(constants_1.DbModel.TypeOfMembership, TypeOfMembershipSchema);
exports.default = TypeOfMembership;
