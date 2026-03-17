import Joi from 'joi';
import commonValidations from '../commonValidations';
import { DEFAULT_PASSWORD_LENGTH } from '../../utils/constants';

const registerUserSchema = {
  body: Joi.object()
    .keys({
      user_name: Joi.string()
        //.alphanum()
        .min(3)
        .max(20)
        .required()
        .label('User Name')
        .trim(),
      password: commonValidations.passwordValidator.length(DEFAULT_PASSWORD_LENGTH),
      email: commonValidations.emailValidator.required(),
      confirmPassword: Joi.string().required().label('confirmPassword'),
      companyName: Joi.string().required().label('Company Name').trim(),
      waterConnectionNo: Joi.string()
        .optional()
        .label('Water Connection')
        .trim(),
      plotShedNo: Joi.string().optional().label('Plot/Shed No').trim(),

      //   first_name: Joi.string().optional().label('First Name').trim(),
      //   last_name: Joi.string().optional().label('Last Name').trim(),
    })
    .messages({
      'alternatives.match': 'Username or Email is Invalid',
    }),
  params: Joi.object(),
  query: Joi.object(),
};

const loginUserSchema = {
  body: Joi.object().keys({
    user_name: Joi.string()
      // .alphanum()
      // .min(3)
      // .max(20)
      .required()
      .label('User Name')
      .trim(),
    password: commonValidations.passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
    //email: commonValidations.emailValidator.required(),
  }),
  params: Joi.object(),
  query: Joi.object(),
};

const nocAttachmentSchema = Joi.object({
  // applicationLetter: Joi.string().optional(),
  // waterBill: Joi.string().optional(),
  // lightBill: Joi.string().optional(),
  // taxBill: Joi.string().optional(),
  // otherDocumentImage: Joi.string().optional(),
  otherDocumentName: Joi.string().optional(),

  gidc: Joi.object({
    gidcLetterRefNo: Joi.string().optional(),
    gidcDate: Joi.date().optional(),
  }).optional(),

  torrent: Joi.object({
    torrentServiceNo: Joi.string().optional(),
    torrentNo: Joi.string().optional(),
    torrentDate: Joi.date().optional(),
    torrentName: Joi.string().optional(),
  }).optional(),

  amcTaxBill: Joi.object({
    amcTaxTenamentNo: Joi.string().optional(),
    amcTaxYear: Joi.string().optional(),
    amcTaxPaidAmount: Joi.string().optional(),
    amcTaxName: Joi.string().optional(),
  }).optional(),

  water: Joi.object({
    waterConnectionNo: Joi.string().optional(),
    waterBillNo: Joi.string().optional(),
    waterBillDate: Joi.date().optional(),
    waterConsumptionPeriod: Joi.string().optional(),
    waterBillName: Joi.string().optional(),
  }).optional(),
});

const chequeDetailsSchema = Joi.object({
  bankName: Joi.string().optional(),
  branchName: Joi.string().optional(),
  chequeNo: Joi.string().optional(),
  chequeDate: Joi.date().optional(),
  chequeAmountNumber: Joi.number().optional(),
  chequeAmountWords: Joi.string().optional(),
  chequePhoto: Joi.string().optional(),
});

const userContributionSchema = Joi.object({
  name: Joi.string().optional(),
  plotNo: Joi.string().optional(),
  bank: Joi.string().optional(),
  chequeDate: Joi.string().optional(),
  chequeNo: Joi.string().optional(),
  chequeAmount: Joi.string().optional(),
});

const nocFormSchema = {
  body: Joi.object({
    industryName: Joi.string().optional(),
    industryAddress: Joi.string().optional(),
    email: commonValidations.emailValidator.optional(),
    industryType: Joi.string().optional(),
    telephoneNo: Joi.string().optional(),
    membershipNo: Joi.string().optional(),
    isMember: Joi.string().optional(),
    isContributionFiled: Joi.string().optional(),
    year: Joi.number().optional(),
    receiptNo: Joi.string().optional(),
    // applicationType: Joi.array().items(Joi.string()).optional(),
    feeForWaterNoc: Joi.string().optional(),
    feeForOther: Joi.string().optional(),
    attachments: nocAttachmentSchema.optional(),
    // chequeDetails: chequeDetailsSchema.optional(),
    // userContribution: userContributionSchema.optional(),

    'userContribution.name': Joi.string().optional(),
    'userContribution.plotNo': Joi.string().optional(),
    'userContribution.bank': Joi.string().optional(),
    'userContribution.chequeDate': Joi.string().optional(),
    'userContribution.chequeNo': Joi.string().optional(),
    'userContribution.chequeAmount': Joi.string().optional(),

    'chequeDetails.bankName': Joi.string().optional(),
    'chequeDetails.branchName': Joi.string().optional(),
    'chequeDetails.chequeNo': Joi.string().optional(),
    'chequeDetails.chequeDate': Joi.date().optional(),
    'chequeDetails.chequeAmountNumber': Joi.number().optional(),
    'chequeDetails.chequeAmountWords': Joi.string().optional(),
    'chequeDetails.chequePhoto': Joi.string().optional(),
    plotNo: Joi.string().optional(),
    gstNo: Joi.string().optional(),
    roadNo: Joi.string().optional(),
    publishDate: Joi.date().optional(),
  }).unknown(true),
  params: Joi.object(),
  query: Joi.object(),
};

export default {
  loginUserSchema,
  registerUserSchema,
  nocFormSchema,
};
