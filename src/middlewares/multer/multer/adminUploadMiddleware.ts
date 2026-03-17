import { adminBusinessBulletinService, adminCircularPhotoService, adminCommitteeMemberService, adminEventPhotoService, adminForeignEmbassiesPhotoService, adminHomeBannerPhotoService, adminIndustriesService, adminMembershipReceiptPhotoService, adminOverviewImageService, adminphotoGalleryService, adminPresidentService, adminQuickLinkService, adminServiceAndFacilityService, adminTelephonePhotoService, adminVideoGalleryService, uploadsFileService } from "../../../services/fileService";
import { CustomRequest } from "../../../types/common";
import { FOLDER_NAMES, MEDIA_IDENTIFIER_KEY, MULTER_FIELD_NAMES } from "../../../utils/constants";
import { generateFileName } from "../../../utils/helper";

// ADMIN RELATED UPLOADS
const FIELD_TO_FOLDER_MAPPING = {

    [MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.PHOTOGALLERY, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.TELEPHONE_LIST_PHOTO, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.EVENT]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.EVENT, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.QRCODE]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.QRCODE, file.originalname),
        maxSize: 2 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.CIRCULAR]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.CIRCULAR, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['application/pdf'], // Only allow PDF files
    },

    [MULTER_FIELD_NAMES.ADMIN.QUICKLINK]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.QUICKLINK, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png','image/svg+xml'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.PRESIDENT]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.PRESIDENT, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.BUSINESS_BULLETIN]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.BUSINESS_BULLETIN, file.originalname),
        maxSize: 2 * 1024 * 1024, // 2MB limit (adjust if needed)
        allowedTypes: ['image/jpeg', 'image/png'], // Restrict to image files
    },

    [MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.VIDEOGALLERY, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: [
            'video/mp4', 'video/mpeg'
        ],
    },

    [MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.VIDEOGALLERY_THUMBNAIL, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes:['image/jpeg', 'image/png'], 
    },

    [MULTER_FIELD_NAMES.ADMIN.INDUSTRIES]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.INDUSTRIES, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png','image/svg+xml'],
    },

    [MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.SERVICEANDFACILITY, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },

    [MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.COMMITTEEMEMBER, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },

    [MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.FOREIGNEMBASSIES, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },

    [MULTER_FIELD_NAMES.ADMIN.HOMEBANNER]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.HOMEBANNER, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },

    [MULTER_FIELD_NAMES.ADMIN.RECEIPT_PHOTO]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ADMIN.RECEIPT_PHOTO, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },





      [MULTER_FIELD_NAMES.OVERVIEW.IMAGE]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ABOUTUS.OVERVIEWIMAGE, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },

      [MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE]: {
        module: (req: CustomRequest) => {
            return req.user_id && req.user_id.toString() as any;
        },
        fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
            generateFileName(MEDIA_IDENTIFIER_KEY.ABOUTUS.CORPOIMAGE, file.originalname),
        maxSize: 100 * 1024 * 1024, // Increase limit to 100MB (adjust as needed)
        allowedTypes: ['image/jpeg', 'image/png'],
    },






    // Add more mappings as needed
};

const adminUploadMiddleware = uploadsFileService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);

const adminPhotoGalleryMiddleware = adminphotoGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminVideoGalleryMiddleware = adminVideoGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminTelephonePhotoMiddleware = adminTelephonePhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminEventPhotoMiddleware = adminEventPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminCircularPhotoMiddleware = adminCircularPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminQuickLinkIconMiddleware = adminQuickLinkService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminPresidentPhotoMiddleware = adminPresidentService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminBusinessBulletinPhotoMiddleware = adminBusinessBulletinService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminIndustriesMiddleware = adminIndustriesService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminServiceAndFacilityMiddleware = adminServiceAndFacilityService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminCommitteeMemberPhotoMiddleware = adminCommitteeMemberService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminForeignEmbassiesPhotoMiddleware= adminForeignEmbassiesPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminHomeBannerPhotoMiddleware = adminHomeBannerPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminMembershipReceiptPhotoMiddleware= adminMembershipReceiptPhotoService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)
const adminOverviewImageMiddleware= adminOverviewImageService.multerMiddleware(FIELD_TO_FOLDER_MAPPING)

export {
    adminPhotoGalleryMiddleware, adminTelephonePhotoMiddleware,
    adminEventPhotoMiddleware, adminCircularPhotoMiddleware, adminQuickLinkIconMiddleware,
    adminPresidentPhotoMiddleware, adminBusinessBulletinPhotoMiddleware, adminVideoGalleryMiddleware, adminIndustriesMiddleware,
    adminServiceAndFacilityMiddleware, adminCommitteeMemberPhotoMiddleware,adminForeignEmbassiesPhotoMiddleware,
    adminHomeBannerPhotoMiddleware,adminMembershipReceiptPhotoMiddleware,adminOverviewImageMiddleware
};
