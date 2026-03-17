"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const commonValidations_1 = __importDefault(require("../commonValidations"));
const constants_1 = require("../../utils/constants");
const registerUserSchema = {
    body: joi_1.default.object()
        .keys({
        user_name: joi_1.default.string()
            //.alphanum()
            .min(3)
            .max(20)
            .required()
            .label('User Name')
            .trim(),
        password: commonValidations_1.default.passwordValidator.length(constants_1.DEFAULT_PASSWORD_LENGTH),
        email: commonValidations_1.default.emailValidator.required(),
        confirmPassword: joi_1.default.string().required().label('confirmPassword'),
        companyName: joi_1.default.string().required().label('Company Name').trim(),
        waterConnectionNo: joi_1.default.string()
            .optional()
            .label('Water Connection')
            .trim(),
        plotShedNo: joi_1.default.string().optional().label('Plot/Shed No').trim(),
        //   first_name: Joi.string().optional().label('First Name').trim(),
        //   last_name: Joi.string().optional().label('Last Name').trim(),
    })
        .messages({
        'alternatives.match': 'Username or Email is Invalid',
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
const loginUserSchema = {
    body: joi_1.default.object().keys({
        user_name: joi_1.default.string()
            // .alphanum()
            // .min(3)
            // .max(20)
            .required()
            .label('User Name')
            .trim(),
        password: commonValidations_1.default.passwordValidator.min(constants_1.DEFAULT_PASSWORD_LENGTH),
        //email: commonValidations.emailValidator.required(),
    }),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
const nocAttachmentSchema = joi_1.default.object({
    // applicationLetter: Joi.string().optional(),
    // waterBill: Joi.string().optional(),
    // lightBill: Joi.string().optional(),
    // taxBill: Joi.string().optional(),
    // otherDocumentImage: Joi.string().optional(),
    otherDocumentName: joi_1.default.string().optional(),
    gidc: joi_1.default.object({
        gidcLetterRefNo: joi_1.default.string().optional(),
        gidcDate: joi_1.default.date().optional(),
    }).optional(),
    torrent: joi_1.default.object({
        torrentServiceNo: joi_1.default.string().optional(),
        torrentNo: joi_1.default.string().optional(),
        torrentDate: joi_1.default.date().optional(),
        torrentName: joi_1.default.string().optional(),
    }).optional(),
    amcTaxBill: joi_1.default.object({
        amcTaxTenamentNo: joi_1.default.string().optional(),
        amcTaxYear: joi_1.default.string().optional(),
        amcTaxPaidAmount: joi_1.default.string().optional(),
        amcTaxName: joi_1.default.string().optional(),
    }).optional(),
    water: joi_1.default.object({
        waterConnectionNo: joi_1.default.string().optional(),
        waterBillNo: joi_1.default.string().optional(),
        waterBillDate: joi_1.default.date().optional(),
        waterConsumptionPeriod: joi_1.default.string().optional(),
        waterBillName: joi_1.default.string().optional(),
    }).optional(),
});
const chequeDetailsSchema = joi_1.default.object({
    bankName: joi_1.default.string().optional(),
    branchName: joi_1.default.string().optional(),
    chequeNo: joi_1.default.string().optional(),
    chequeDate: joi_1.default.date().optional(),
    chequeAmountNumber: joi_1.default.number().optional(),
    chequeAmountWords: joi_1.default.string().optional(),
    chequePhoto: joi_1.default.string().optional(),
});
const userContributionSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    plotNo: joi_1.default.string().optional(),
    bank: joi_1.default.string().optional(),
    chequeDate: joi_1.default.string().optional(),
    chequeNo: joi_1.default.string().optional(),
    chequeAmount: joi_1.default.string().optional(),
});
const nocFormSchema = {
    body: joi_1.default.object({
        industryName: joi_1.default.string().optional(),
        industryAddress: joi_1.default.string().optional(),
        email: commonValidations_1.default.emailValidator.optional(),
        industryType: joi_1.default.string().optional(),
        telephoneNo: joi_1.default.string().optional(),
        membershipNo: joi_1.default.string().optional(),
        isMember: joi_1.default.string().optional(),
        isContributionFiled: joi_1.default.string().optional(),
        year: joi_1.default.number().optional(),
        receiptNo: joi_1.default.string().optional(),
        // applicationType: Joi.array().items(Joi.string()).optional(),
        feeForWaterNoc: joi_1.default.string().optional(),
        feeForOther: joi_1.default.string().optional(),
        attachments: nocAttachmentSchema.optional(),
        // chequeDetails: chequeDetailsSchema.optional(),
        // userContribution: userContributionSchema.optional(),
        'userContribution.name': joi_1.default.string().optional(),
        'userContribution.plotNo': joi_1.default.string().optional(),
        'userContribution.bank': joi_1.default.string().optional(),
        'userContribution.chequeDate': joi_1.default.string().optional(),
        'userContribution.chequeNo': joi_1.default.string().optional(),
        'userContribution.chequeAmount': joi_1.default.string().optional(),
        'chequeDetails.bankName': joi_1.default.string().optional(),
        'chequeDetails.branchName': joi_1.default.string().optional(),
        'chequeDetails.chequeNo': joi_1.default.string().optional(),
        'chequeDetails.chequeDate': joi_1.default.date().optional(),
        'chequeDetails.chequeAmountNumber': joi_1.default.number().optional(),
        'chequeDetails.chequeAmountWords': joi_1.default.string().optional(),
        'chequeDetails.chequePhoto': joi_1.default.string().optional(),
        plotNo: joi_1.default.string().optional(),
        gstNo: joi_1.default.string().optional(),
        roadNo: joi_1.default.string().optional(),
        publishDate: joi_1.default.date().optional(),
    }).unknown(true),
    params: joi_1.default.object(),
    query: joi_1.default.object(),
};
exports.default = {
    loginUserSchema,
    registerUserSchema,
    nocFormSchema,
};
