"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const MembershipSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: true,
    },
    created_by: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User
    },
    approved_by: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User
    },
    membership_Id: {
        type: String,
    },
    memberCompanyName: { type: String, required: true },
    plotShedNo: { type: String, required: false },
    roadNo: { type: String, required: false },
    companyType: { type: String, enum: Object.values(constants_1.COMPANY_TYPE), required: false },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    mobile: { type: String, required: false },
    representativeDetails: [
        {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            mobile: { type: String },
            phone: { type: String },
            photo: { type: String },
        },
    ],
    website: { type: String },
    productName: { type: String },
    companyCategory: { type: String },
    gstNo: { type: String },
    amcTenementNo: { type: String },
    udyogAadharNo: { type: String },
    torrentServiceNo: { type: String },
    attachments: {
        allotmentLetter: { type: String },
        possessionLetter: { type: String },
        officeOrder: { type: String },
        transferOrder: { type: String },
    },
    otherDocuments: [
        {
            name: { type: String },
            file: { type: String },
        },
    ],
    //   plotShedSize: {
    //     waterConnectionNo: { type: String, required: true },
    //     connectionSize: { type: String, required: true },
    //     shedplotShedSizeNos: { type: String, required: true },
    //     areaSize: { type: String, required: true },
    //   },
    // Updated to handle multiple entries
    propertyDetails: [
        {
            plotShedSize: { type: String },
            waterConnectionNo: { type: String },
            connectionSizeMM: { type: String },
            areaSizeSqMtrs: { type: String },
        }
    ],
    // Cheque Details Section
    chequeDetails: {
        bankName: { type: String },
        branchName: { type: String },
        chequeNo: { type: String },
        chequeDate: { type: String },
        chequeAmountNumber: { type: Number },
        chequeAmountWords: { type: String },
        chequePhoto: { type: String }, // store the path or URL to the uploaded photo
    },
    receipt: { type: String },
    receiptPhoto: { type: String }, // store the path or URL to the uploaded photo
}, { timestamps: true } // Add createdAt and updatedAt timestamps
);
// Export the model
const MembershipModel = (0, mongoose_1.model)(constants_1.DbModel.Membership, MembershipSchema);
exports.default = MembershipModel;
