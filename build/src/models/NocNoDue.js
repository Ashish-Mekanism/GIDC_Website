"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const mongoose_1 = require("mongoose");
const requiredIfNotExported = function () {
    return !this.isExported;
};
const NocFormSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: requiredIfNotExported,
    },
    isExported: {
        type: Boolean,
        default: false,
    },
    industryName: { type: String, required: true },
    industryAddress: { type: String, required: true },
    email: { type: String },
    industryType: {
        type: String,
        // enum: Object.values(COMPANY_TYPE),
        required: requiredIfNotExported,
    },
    telephoneNo: {
        type: String,
        required: requiredIfNotExported,
    },
    membershipNo: { type: String },
    isMember: {
        type: String,
        enum: Object.values(constants_1.YES_NO),
        required: true,
    },
    isContributionFiled: {
        type: String,
        enum: Object.values(constants_1.YES_NO),
        required: true,
    },
    year: { type: Number, required: requiredIfNotExported },
    receiptNo: {
        type: String,
        required: requiredIfNotExported,
    },
    applicationType: {
        type: [String],
        // enum: Object.values(APPLICATION_TYPE),
        required: requiredIfNotExported,
    },
    feeForWaterNoc: {
        type: String,
        // enum: Object.values(FEE_FOR_WATER_NOC),
    },
    feeForOther: {
        type: String,
        // enum: Object.values(OTHER_FEES),
    },
    plotNo: { type: String },
    refNo: { type: String },
    // attachments: {
    //   /// IMAGES
    //   applicationLetter: { type: String },
    //   waterBill: { type: String },
    //   lightBill: { type: String },
    //   taxBill: { type: String },
    //   otherDocumentImage: { type: String },
    //   otherDocumentName: { type: String },
    //   gidc: {
    //     gidcLetterRefNo: String,
    //     gidcDate: Date,
    //   },
    //   torrent: {
    //     torrentServiceNo: String,
    //     torrentNo: String,
    //     torrentDate: Date,
    //     torrentName: String,
    //   },
    //   amcTaxBill: {
    //     amcTaxTenamentNo: String,
    //     amcTaxYear: String,
    //     amcTaxPaidAmount: String,
    //     amcTaxName: String,
    //   },
    //   water: {
    //     waterConnectionNo: String,
    //     waterBillNo: String,
    //     waterBillDate: Date,
    //     waterConsumptionPeriod: String,
    //     waterBillName: String,
    //   },
    //   // otherDocuments: [
    //   //     {
    //   //         documentName: { type: String, required: true },
    //   //         documentImage: { type: String, required: true },
    //   //     },
    //   // ],
    // },
    attachments: {
        applicationLetter: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
        waterBill: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
        lightBill: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
        taxBill: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
        otherDocumentImage: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
        otherDocumentName: { type: String },
        gidc: {
            gidcLetterRefNo: String,
            gidcDate: Date,
        },
        torrent: {
            torrentServiceNo: String,
            torrentNo: String,
            torrentDate: Date,
            torrentName: String,
        },
        amcTaxBill: {
            amcTaxTenamentNo: String,
            amcTaxYear: String,
            amcTaxPaidAmount: String,
            amcTaxName: String,
        },
        water: {
            waterConnectionNo: String,
            waterBillNo: String,
            waterBillDate: Date,
            waterConsumptionPeriod: String,
            waterBillName: String,
        },
    },
    chequeDetails: {
        bankName: { type: String },
        branchName: { type: String },
        chequeNo: { type: String },
        chequeDate: { type: String },
        chequeAmountNumber: { type: Number },
        chequeAmountWords: { type: String },
        chequePhoto: {
            _id: { type: mongoose_1.SchemaTypes.ObjectId },
            fileName: { type: String },
        },
    },
    userContribution: {
        name: { type: String },
        plotNo: { type: String },
        bank: { type: String },
        chequeDate: { type: String },
        chequeNo: { type: String },
        chequeAmount: { type: String },
    },
    gstNo: { type: String },
    roadNo: { type: String },
    publishDate: {
        type: Date,
        required: requiredIfNotExported,
    },
    user_name: { type: String
    }
}, { timestamps: true });
// Export the model
const NocFormModel = (0, mongoose_1.model)(constants_1.DbModel.NocNoDue, NocFormSchema);
exports.default = NocFormModel;
