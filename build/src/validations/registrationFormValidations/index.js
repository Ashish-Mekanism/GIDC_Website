"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../utils/constants");
const representativeDetailsSchema = joi_1.default.array().items(joi_1.default.object({
    name: joi_1.default.string().optional().label('Name'),
    designation: joi_1.default.string().optional().label('Designation'),
    email: joi_1.default.string().email().optional().label('Email'),
    mobile: joi_1.default.string().pattern(/^[0-9]{10,15}$/).optional().label('Mobile')
        .messages({ 'string.pattern.base': 'Mobile number must be between 10 and 15 digits' }),
    phone: joi_1.default.string().pattern(/^[0-9]{10,15}$/).optional().label('Phone')
        .messages({ 'string.pattern.base': 'Phone number must be between 10 and 15 digits' }),
    photo: joi_1.default.string().optional().label('Photo'),
}));
// const attachmentsSchema = Joi.object({
//     allotmentLetter: Joi.string().optional().label('Allotment Letter'),
//     possessionLetter: Joi.string().optional().label('Possession Letter'),
//     officeOrder: Joi.string().optional().label('Office Order'),
//     transferOrder: Joi.string().optional().label('Transfer Order'),
// });
const otherDocumentsSchema = joi_1.default.array().items(joi_1.default.object({
    name: joi_1.default.string().required().label('Document Name'),
    // file: Joi.string().required().label('File'),
}));
const membershipValidationSchema = {
    body: joi_1.default.object()
        .keys({
        //userId: Joi.string().required().label('User ID'),
        memberCompanyName: joi_1.default.string().required().label('Member Company Name').trim(),
        plotShedNo: joi_1.default.string().required().label('Plot/Shed No').trim(),
        roadNo: joi_1.default.string().required().label('Road No').trim(),
        companyType: joi_1.default.string().valid(...Object.values(constants_1.COMPANY_TYPE)).required().label('Company Type'),
        email: joi_1.default.string().email().required().label('Email').trim(),
        phone: joi_1.default.string().pattern(/^[0-9]{10,15}$/).required().label('Phone').trim()
            .messages({ 'string.pattern.base': 'Phone number must be between 10 and 15 digits' }),
        mobile: joi_1.default.string().pattern(/^[0-9]{10,15}$/).required().label('Mobile').trim()
            .messages({ 'string.pattern.base': 'Mobile number must be between 10 and 15 digits' }),
        representativeDetails: representativeDetailsSchema,
        website: joi_1.default.string().uri().optional().label('Website').trim(),
        productName: joi_1.default.string().optional().label('Product Name').trim(),
        companyCategory: joi_1.default.string().optional().label('Company Category').trim(),
        gstNo: joi_1.default.string().optional().label('GST No').trim(),
        amcTenementNo: joi_1.default.string().optional().label('AMC Tenement No').trim(),
        udyogAadharNo: joi_1.default.string().optional().label('Udyog Aadhar No').trim(),
        torrentServiceNo: joi_1.default.string().optional().label('Torrent Service No').trim(),
        //attachments: attachmentsSchema,
        otherDocuments: otherDocumentsSchema,
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
exports.default = {
    membershipValidationSchema
};
