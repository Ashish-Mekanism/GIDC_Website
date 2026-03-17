"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResumeMiddleware = exports.UserBookingTransactionMiddleware = exports.UserSponsorshipMiddleware = exports.UserNocMiddleware = exports.UserDigitalCardSliderMiddleware = exports.userBusinessCardProfileMiddleware = exports.UserDigitalCardGalleryMiddleware = exports.userWebDirectoryMiddleware = exports.userComplaintMiddleware = exports.userUploadMiddleware = void 0;
const fileService_1 = require("../../../services/fileService");
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
// USER RELATED UPLOADS
// const FIELD_TO_FOLDER_MAPPING = {
//   [MULTER_FIELD_NAMES.USER.PROFILE]: {
//     module: FOLDER_NAMES.USER_PROFILES,
//     fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
//       generateFileName('profile', file.originalname),
//     maxSize: 5 * 1024 * 1024, // 5MB
//     allowedTypes: ['image/jpeg','image/jpg', 'image/png'], // Restrict to image files
//   },
//   // Add more mappings as needed
// };
const FIELD_TO_FOLDER_MAPPING = {
    [constants_1.MULTER_FIELD_NAMES.USER.REP_1_PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.REP1, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.REP_2_PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.REP2, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.ATT_AL]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.ATT_AL, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.ATT_OO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.ATT_OO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.ATT_PL]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.ATT_PL, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.ATT_TO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.ATT_TO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_1]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_1, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_2]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_2, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_3]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_3, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.USER.CHEQUE]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.USER.CHEQUE, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.COMPLAINT.PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.COMPLAINT.PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.WEBDIRECTORY.COMPANY_LOGO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.WEBDIRECTORY.PRODUCT_PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.BUSINESSCARD.PROFILE, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY]: {
        module: (req) => {
            return req.params.id && req.params.id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.BUSINESSCARD.DIGITALGALLERY, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER]: {
        module: (req) => {
            return req.params.id && req.params.id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.BUSINESSCARD.DIGITALSLIDER, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.ATT_APPLICATION_LETTER]: {
        module: (req) => {
            //  return req.user_id && req.user_id.toString();
            console.log(req.nocUserId, " req.nocUserId");
            return req.nocUserId;
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.ATT_APPLICATION_LETTER, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.ATT_LIGHTBILL]: {
        module: (req) => {
            // return req.user_id && req.user_id.toString();
            return req.nocUserId;
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.ATT_LIGHTBILL, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.ATT_OTHER_DOC]: {
        module: (req) => {
            //return req.user_id && req.user_id.toString();
            return req.nocUserId;
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.ATT_OTHER_DOC, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.ATT_TAXBILL]: {
        module: (req) => {
            // return req.user_id && req.user_id.toString();
            return req.nocUserId;
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.ATT_TAXBILL, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.ATT_WATERBILL]: {
        module: (req) => {
            //return req.user_id && req.user_id.toString();
            return req.nocUserId;
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.ATT_WATERBILL, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    },
    [constants_1.MULTER_FIELD_NAMES.NOC.CHEQUE_PHOTO]: {
        module: (req) => {
            return req.nocUserId;
            // return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.NOC.CHEQUE_PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
    },
    // [MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO]: {
    //   module: (req: CustomRequest) => {
    //     return req?.user_id && req?.user_id.toString()
    //   },
    //   fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
    //     generateFileName(MEDIA_IDENTIFIER_KEY.SPONSORSHIP.PHOTO, file.originalname),
    //   maxSize: 5 * 1024 * 1024, // 5MB
    //   allowedTypes: ['image/jpeg','image/jpg', 'image/png'], // Restrict to image files
    // },
    [constants_1.MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO]: {
        module: () => constants_1.FOLDER_NAMES.SPONSORSHIP, // Directly use 'SPONSORSHIP' folder
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.SPONSORSHIP.PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.BOOKINGTRANSACTION.PHOTO]: {
        module: () => constants_1.FOLDER_NAMES.BOOKINGTRANSACTION, // Directly use 'SPONSORSHIP' folder
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.BOOKINGTRANSACTION.PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.APPLY_JOB.RESUME]: {
        module: () => constants_1.FOLDER_NAMES.RESUME, // Directly use 'SPONSORSHIP' folder
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.APPLY_JOB.RESUME, file.originalname),
        maxSize: 500 * 1024, // 500kb
        allowedTypes: ["application/pdf"], // Restrict to image files
    },
};
const userUploadMiddleware = fileService_1.userUploadsFileService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.userUploadMiddleware = userUploadMiddleware;
const userComplaintMiddleware = fileService_1.userComplaintPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.userComplaintMiddleware = userComplaintMiddleware;
const userWebDirectoryMiddleware = fileService_1.userWebDirectoryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.userWebDirectoryMiddleware = userWebDirectoryMiddleware;
const userBusinessCardProfileMiddleware = fileService_1.userBusinessCardService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.userBusinessCardProfileMiddleware = userBusinessCardProfileMiddleware;
const UserDigitalCardGalleryMiddleware = fileService_1.userDigitalCardGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.UserDigitalCardGalleryMiddleware = UserDigitalCardGalleryMiddleware;
const UserDigitalCardSliderMiddleware = fileService_1.userDigitalCardSliderService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.UserDigitalCardSliderMiddleware = UserDigitalCardSliderMiddleware;
const UserNocMiddleware = fileService_1.userNocService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.UserNocMiddleware = UserNocMiddleware;
const UserSponsorshipMiddleware = fileService_1.userSponsorshipService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.UserSponsorshipMiddleware = UserSponsorshipMiddleware;
const UserBookingTransactionMiddleware = fileService_1.userBookingTransactionService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.UserBookingTransactionMiddleware = UserBookingTransactionMiddleware;
const userResumeMiddleware = fileService_1.userResumeService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.userResumeMiddleware = userResumeMiddleware;
