import NocFormModel from "../../../models/NocNoDue";
import {
  uploadsFileService,
  userBookingTransactionService,
  userBusinessCardService,
  userComplaintPhotoService,
  userDigitalCardGalleryService,
  userDigitalCardSliderService,
  userNocService,
  userResumeService,
  userSponsorshipService,
  userUploadsFileService,
  userWebDirectoryService,
} from "../../../services/fileService";
import { CustomRequest } from "../../../types/common";
import {
  FOLDER_NAMES,
  MEDIA_IDENTIFIER_KEY,
  MULTER_FIELD_NAMES,
} from "../../../utils/constants";
import { generateFileName } from "../../../utils/helper";
import { Express } from "express";
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
  [MULTER_FIELD_NAMES.USER.REP_1_PHOTO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.REP1, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.REP_2_PHOTO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.REP2, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.ATT_AL]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.ATT_AL, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.ATT_OO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.ATT_OO, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.ATT_PL]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.ATT_PL, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.ATT_TO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.USER.ATT_TO, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },
  [MULTER_FIELD_NAMES.USER.OTHER_DOC_1]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_1,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.OTHER_DOC_2]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_2,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.OTHER_DOC_3]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.USER.OTHER_DOC_3,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.USER.CHEQUE]: {
    module: (req: CustomRequest) => {
     
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.USER.CHEQUE,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.COMPLAINT.PHOTO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.COMPLAINT.PHOTO, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.WEBDIRECTORY.COMPANY_LOGO,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.WEBDIRECTORY.PRODUCT_PHOTO,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE]: {
    module: (req: CustomRequest) => {
      return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.BUSINESSCARD.PROFILE,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY]: {
    module: (req: CustomRequest) => {
      return req.params.id && req.params.id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.BUSINESSCARD.DIGITALGALLERY,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER]: {
    module: (req: CustomRequest) => {
      return req.params.id && req.params.id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.BUSINESSCARD.DIGITALSLIDER,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.NOC.ATT_APPLICATION_LETTER]: {
    module: (req: any) => {
      //  return req.user_id && req.user_id.toString();
console.log( req.nocUserId, " req.nocUserId");

      return req.nocUserId;
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.NOC.ATT_APPLICATION_LETTER,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  },

  [MULTER_FIELD_NAMES.NOC.ATT_LIGHTBILL]: {
    module: (req: any) => {
      // return req.user_id && req.user_id.toString();
      return req.nocUserId;
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.NOC.ATT_LIGHTBILL,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  },

  [MULTER_FIELD_NAMES.NOC.ATT_OTHER_DOC]: {
    module: (req: any) => {
      //return req.user_id && req.user_id.toString();
      return req.nocUserId;
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.NOC.ATT_OTHER_DOC,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  },

  [MULTER_FIELD_NAMES.NOC.ATT_TAXBILL]: {
    module:  (req: any) => {
      // return req.user_id && req.user_id.toString();
      return req.nocUserId;
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(MEDIA_IDENTIFIER_KEY.NOC.ATT_TAXBILL, file.originalname),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  },

  [MULTER_FIELD_NAMES.NOC.ATT_WATERBILL]: {
    module: (req: any) => {
      //return req.user_id && req.user_id.toString();
      return req.nocUserId;
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.NOC.ATT_WATERBILL,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
  },

  [MULTER_FIELD_NAMES.NOC.CHEQUE_PHOTO]: {
    module: (req: any) => {
      return req.nocUserId;
      // return req.user_id && req.user_id.toString();
    },
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.NOC.CHEQUE_PHOTO,
        file.originalname
      ),
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

  [MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO]: {
    module: () => FOLDER_NAMES.SPONSORSHIP, // Directly use 'SPONSORSHIP' folder
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.SPONSORSHIP.PHOTO,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },
  [MULTER_FIELD_NAMES.BOOKINGTRANSACTION.PHOTO]: {
    module: () => FOLDER_NAMES.BOOKINGTRANSACTION, // Directly use 'SPONSORSHIP' folder
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.BOOKINGTRANSACTION.PHOTO,
        file.originalname
      ),
    maxSize: 2 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png"], // Restrict to image files
  },

  [MULTER_FIELD_NAMES.APPLY_JOB.RESUME]: {
    module: () => FOLDER_NAMES.RESUME, // Directly use 'SPONSORSHIP' folder
    fileNameGenerator: (_req: Request, file: Express.Multer.File) =>
      generateFileName(
        MEDIA_IDENTIFIER_KEY.APPLY_JOB.RESUME,
        file.originalname
      ),
    maxSize: 500 * 1024, // 500kb
    allowedTypes: ["application/pdf"], // Restrict to image files
  },
};

const userUploadMiddleware = userUploadsFileService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

const userComplaintMiddleware = userComplaintPhotoService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

const userWebDirectoryMiddleware = userWebDirectoryService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

const userBusinessCardProfileMiddleware =
  userBusinessCardService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);

const UserDigitalCardGalleryMiddleware =
  userDigitalCardGalleryService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);

const UserDigitalCardSliderMiddleware =
  userDigitalCardSliderService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);

const UserNocMiddleware = userNocService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

const UserSponsorshipMiddleware = userSponsorshipService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

const UserBookingTransactionMiddleware =
  userBookingTransactionService.multerMiddleware(FIELD_TO_FOLDER_MAPPING);

const userResumeMiddleware = userResumeService.multerMiddleware(
  FIELD_TO_FOLDER_MAPPING
);

export {
  userUploadMiddleware,
  userComplaintMiddleware,
  userWebDirectoryMiddleware,
  UserDigitalCardGalleryMiddleware,
  userBusinessCardProfileMiddleware,
  UserDigitalCardSliderMiddleware,
  UserNocMiddleware,
  UserSponsorshipMiddleware,
  UserBookingTransactionMiddleware,
  userResumeMiddleware,
};
