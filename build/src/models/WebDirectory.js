"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const WebDirectorySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: true,
    },
    created_by: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User
    },
    companyName: { type: String },
    companyLogo: { type: String },
    personalPhone: { type: Number },
    companyPhone: { type: Number },
    personalEmail: { type: String },
    companyEmail: { type: String },
    companyProfile: { type: String },
    productDetails: { type: String },
    product: [{
            // _id:{type:SchemaTypes.ObjectId},
            productName: { type: String },
            productImage: { type: String },
        }],
    location: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
    },
    active: {
        type: Boolean,
    },
    membershipNo: {
        type: String
    }
}, { timestamps: true });
const WebDirectoryModel = (0, mongoose_1.model)(constants_1.DbModel.WebDirectory, WebDirectorySchema);
exports.default = WebDirectoryModel;
