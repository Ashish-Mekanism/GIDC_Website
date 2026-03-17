import Joi from 'joi';
import commonValidations from '../commonValidations';
import { COMPANY_TYPE } from '../../utils/constants';

const representativeDetailsSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().optional().label('Name'),
        designation: Joi.string().optional().label('Designation'),
        email: Joi.string().email().optional().label('Email'),
        mobile: Joi.string().pattern(/^[0-9]{10,15}$/).optional().label('Mobile')
            .messages({ 'string.pattern.base': 'Mobile number must be between 10 and 15 digits' }),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().label('Phone')
            .messages({ 'string.pattern.base': 'Phone number must be between 10 and 15 digits' }),
        photo: Joi.string().optional().label('Photo'),
    })
);

// const attachmentsSchema = Joi.object({
//     allotmentLetter: Joi.string().optional().label('Allotment Letter'),
//     possessionLetter: Joi.string().optional().label('Possession Letter'),
//     officeOrder: Joi.string().optional().label('Office Order'),
//     transferOrder: Joi.string().optional().label('Transfer Order'),
// });

const otherDocumentsSchema = Joi.array().items(
    Joi.object({
        name: Joi.string().required().label('Document Name'),
       // file: Joi.string().required().label('File'),
    })
);

const membershipValidationSchema = {
    body: Joi.object()
        .keys({
            //userId: Joi.string().required().label('User ID'),
            memberCompanyName: Joi.string().required().label('Member Company Name').trim(),
            plotShedNo: Joi.string().required().label('Plot/Shed No').trim(),
            roadNo: Joi.string().required().label('Road No').trim(),
            companyType: Joi.string().valid(...Object.values(COMPANY_TYPE)).required().label('Company Type'),
            email: Joi.string().email().required().label('Email').trim(),
            phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().label('Phone').trim()
                .messages({ 'string.pattern.base': 'Phone number must be between 10 and 15 digits' }),
            mobile: Joi.string().pattern(/^[0-9]{10,15}$/).required().label('Mobile').trim()
                .messages({ 'string.pattern.base': 'Mobile number must be between 10 and 15 digits' }),
            representativeDetails: representativeDetailsSchema,
            website: Joi.string().uri().optional().label('Website').trim(),
            productName: Joi.string().optional().label('Product Name').trim(),
            companyCategory: Joi.string().optional().label('Company Category').trim(),
            gstNo: Joi.string().optional().label('GST No').trim(),
            amcTenementNo: Joi.string().optional().label('AMC Tenement No').trim(),
            udyogAadharNo: Joi.string().optional().label('Udyog Aadhar No').trim(),
            torrentServiceNo: Joi.string().optional().label('Torrent Service No').trim(),
            //attachments: attachmentsSchema,
            otherDocuments: otherDocumentsSchema,
        })
       ,
    params: Joi.object(),
    query: Joi.object(),
};
export default {

    membershipValidationSchema

};

