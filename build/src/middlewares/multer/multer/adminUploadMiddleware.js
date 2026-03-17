"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOverviewImageMiddleware = exports.adminMembershipReceiptPhotoMiddleware = exports.adminHomeBannerPhotoMiddleware = exports.adminForeignEmbassiesPhotoMiddleware = exports.adminCommitteeMemberPhotoMiddleware = exports.adminServiceAndFacilityMiddleware = exports.adminIndustriesMiddleware = exports.adminVideoGalleryMiddleware = exports.adminBusinessBulletinPhotoMiddleware = exports.adminPresidentPhotoMiddleware = exports.adminQuickLinkIconMiddleware = exports.adminCircularPhotoMiddleware = exports.adminEventPhotoMiddleware = exports.adminTelephonePhotoMiddleware = exports.adminPhotoGalleryMiddleware = void 0;
const fileService_1 = require("../../../services/fileService");
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
// ADMIN RELATED UPLOADS
const FIELD_TO_FOLDER_MAPPING = {
    [constants_1.MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.PHOTOGALLERY, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.TELEPHONE_LIST_PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.EVENT, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.QRCODE, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.CIRCULAR]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.CIRCULAR, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['application/pdf'], // Only allow PDF files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.QUICKLINK]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.QUICKLINK, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.PRESIDENT]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.PRESIDENT, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.BUSINESS_BULLETIN]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.BUSINESS_BULLETIN, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.VIDEOGALLERY, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: [
            'video/mp4', 'video/mpeg'
        ],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.VIDEOGALLERY_THUMBNAIL, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.INDUSTRIES]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.INDUSTRIES, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.SERVICEANDFACILITY, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.COMMITTEEMEMBER, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.FOREIGNEMBASSIES, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.HOMEBANNER]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.HOMEBANNER, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.ADMIN.RECEIPT_PHOTO]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ADMIN.RECEIPT_PHOTO, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.OVERVIEW.IMAGE]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ABOUTUS.OVERVIEWIMAGE, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    [constants_1.MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE]: {
        module: (req) => {
            return req.user_id && req.user_id.toString();
        },
        fileNameGenerator: (_req, file) => (0, helper_1.generateFileName)(constants_1.MEDIA_IDENTIFIER_KEY.ABOUTUS.CORPOIMAGE, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },
    // Add more mappings as needed
};
const adminUploadMiddleware = fileService_1.uploadsFileService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
const adminPhotoGalleryMiddleware = fileService_1.adminphotoGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminPhotoGalleryMiddleware = adminPhotoGalleryMiddleware;
const adminVideoGalleryMiddleware = fileService_1.adminVideoGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminVideoGalleryMiddleware = adminVideoGalleryMiddleware;
const adminTelephonePhotoMiddleware = fileService_1.adminTelephonePhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminTelephonePhotoMiddleware = adminTelephonePhotoMiddleware;
const adminEventPhotoMiddleware = fileService_1.adminEventPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminEventPhotoMiddleware = adminEventPhotoMiddleware;
const adminCircularPhotoMiddleware = fileService_1.adminCircularPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminCircularPhotoMiddleware = adminCircularPhotoMiddleware;
const adminQuickLinkIconMiddleware = fileService_1.adminQuickLinkService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminQuickLinkIconMiddleware = adminQuickLinkIconMiddleware;
const adminPresidentPhotoMiddleware = fileService_1.adminPresidentService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminPresidentPhotoMiddleware = adminPresidentPhotoMiddleware;
const adminBusinessBulletinPhotoMiddleware = fileService_1.adminBusinessBulletinService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminBusinessBulletinPhotoMiddleware = adminBusinessBulletinPhotoMiddleware;
const adminIndustriesMiddleware = fileService_1.adminIndustriesService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminIndustriesMiddleware = adminIndustriesMiddleware;
const adminServiceAndFacilityMiddleware = fileService_1.adminServiceAndFacilityService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminServiceAndFacilityMiddleware = adminServiceAndFacilityMiddleware;
const adminCommitteeMemberPhotoMiddleware = fileService_1.adminCommitteeMemberService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminCommitteeMemberPhotoMiddleware = adminCommitteeMemberPhotoMiddleware;
const adminForeignEmbassiesPhotoMiddleware = fileService_1.adminForeignEmbassiesPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminForeignEmbassiesPhotoMiddleware = adminForeignEmbassiesPhotoMiddleware;
const adminHomeBannerPhotoMiddleware = fileService_1.adminHomeBannerPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminHomeBannerPhotoMiddleware = adminHomeBannerPhotoMiddleware;
const adminMembershipReceiptPhotoMiddleware = fileService_1.adminMembershipReceiptPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminMembershipReceiptPhotoMiddleware = adminMembershipReceiptPhotoMiddleware;
const adminOverviewImageMiddleware = fileService_1.adminOverviewImageService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);
exports.adminOverviewImageMiddleware = adminOverviewImageMiddleware;
