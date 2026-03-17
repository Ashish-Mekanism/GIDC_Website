import { Router } from 'express';
import adminAuthRoutes from './auth';
import adminCmsRoutes from './cms';
import { adminAuth, adminOrSubAdminAuth } from '../../../middlewares/auth';
import adminMemberController from '../../../controllers/admin/v1/adminMemberController';
import { resolveNocUserFolder, uploadNone } from '../../../utils/helper';
import {
  userBusinessCardProfileMiddleware,
  userComplaintMiddleware,
  UserDigitalCardGalleryMiddleware,
  UserDigitalCardSliderMiddleware,
  UserNocMiddleware,
  UserSponsorshipMiddleware,
  userUploadMiddleware,
  userWebDirectoryMiddleware,
} from '../../../middlewares/multer/multer';
import {
  ACTIONS,
  MULTER_FIELD_NAMES,
  ROLE_PERMISSION,
} from '../../../utils/constants';
import serviceCategoryController from '../../../controllers/serviceCategory/serviceCategoryController';
import contractorController from '../../../controllers/contractor/contractorController';
import {
  adminCircularPhotoMiddleware,
  adminEventPhotoMiddleware,
  adminMembershipReceiptPhotoMiddleware,
  adminPhotoGalleryMiddleware,
  adminTelephonePhotoMiddleware,
  adminVideoGalleryMiddleware,
} from '../../../middlewares/multer/multer/adminUploadMiddleware';
import adminPhotoGalleryController from '../../../controllers/adminPhotoGallery/adminPhotoGalleryController';
import telephoneController from '../../../controllers/telephone/telephoneController';
import subTelephoneController from '../../../controllers/subTelephone/subTelephoneController';
import eventController from '../../../controllers/event/eventController';
import downloadAndCircularController from '../../../controllers/downloadAndCircular/downloadAndCircularController';
import sponsorshipController from '../../../controllers/sponsorship/sponsorshipController';
import adminUserController from '../../../controllers/admin/v1/adminUserController';
import { checkPermission } from '../../../middlewares/checkPermission';
import complaintFormController from '../../../controllers/complaintForms/complaintFormController';
import adminComplaintController from '../../../controllers/admin/v1/adminComplaintController';
import adminNocDueController from '../../../controllers/admin/v1/adminNocDueController';
import adminWebDirectoryController from '../../../controllers/admin/v1/adminWebDirectoryController';
import adminBusinessCardController from '../../../controllers/admin/v1/adminBusinessCardController';
import adminVideoGalleryController from '../../../controllers/adminVideoGallery/adminVideoGalleryController';
import getInTocuhController from '../../../controllers/getInTouch/getInTouchController';
import adminCareerOpportunityController from '../../../controllers/admin/v1/adminCareerOpportunityController';
import applyJobController from '../../../controllers/applyJob/applyJobController';
import adminApplyJobController from '../../../controllers/admin/v1/adminApplyJobController';
import { send } from 'process';
import sendMailToPastEventAttendeesController from '../../../controllers/sendMailToPastEventAttendeesController';
import sendJobSeekerDetailsController from '../../../controllers/sendJobSeekerDetailsController';
import { processCSV, processNonMemberCSV } from '../../../controllers/importMembersController';
import csvController from '../../../controllers/csvController';
import adminConfigController from '../../../controllers/admin/v1/adminConfigController';
import adminEmailTemplateController from '../../../controllers/admin/v1/adminEmailTemplateController';
import validateRequest from '../../../middlewares/validate';
import userValidationss from '../../../validations/userValidationss';

const router = Router();
// All Auth Related Routes
router.use('/auth', adminAuthRoutes);

//All CMS Related Routes
router.use('/cms', adminCmsRoutes);

//router.get('/membersRequest-list', adminOrSubAdminAuth.authenticate,checkPermission(ROLE_PERMISSION.GALLERY, ACTIONS.VIEW),adminMemberController.getMembersRequestList);

router.get(
  '/membersRequest-list',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_REQUEST, ACTIONS.VIEW),
  adminMemberController.getMembersRequestList
);

router.get(
  '/membersApproved-list',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_LIST, ACTIONS.VIEW),
  adminMemberController.getMembersApprovedList
);

router.get(
  '/member-details/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_LIST, ACTIONS.VIEW),
  adminMemberController.getMemberDetails
);

router.post(
  '/membership-form/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_FORM, ACTIONS.ADD),
  userUploadMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.USER.REP_1_PHOTO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.REP_2_PHOTO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_AL,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_OO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_PL,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_TO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_1,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_2,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_3,
    },
  ]),
  adminMemberController.createAMember
);

router.put(
  '/membership-form/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_FORM, ACTIONS.EDIT),
  userUploadMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.USER.REP_1_PHOTO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.REP_2_PHOTO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_AL,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_OO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_PL,
    },
    {
      name: MULTER_FIELD_NAMES.USER.ATT_TO,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_1,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_2,
    },
    {
      name: MULTER_FIELD_NAMES.USER.OTHER_DOC_3,
    },
  ]),
  adminMemberController.updateMembershipForm
);

router.post(
  '/active-inactive',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_LIST, ACTIONS.ACTIVE_INACTIVE),
  adminMemberController.memberActiveInactive
);

router.post(
  '/approve-member',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.MEMBER_LIST, ACTIONS.APPROVE_DECLINE),
  adminMembershipReceiptPhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.RECEIPT_PHOTO
  ),
  adminMemberController.approveMember
);

router.get(
  '/user-list',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.USERS, ACTIONS.VIEW),
  adminUserController.getUserList
);

//***********************************************************SERVICE CATEGORY *******************************************************************//

router.post(
  '/serviceCategory',
  uploadNone(),
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CATEGORY, ACTIONS.ADD),
  serviceCategoryController.createServiceCategory
);

router.put(
  '/serviceCategory/:id',
  uploadNone(),
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CATEGORY, ACTIONS.EDIT),

  serviceCategoryController.updateServiceCategory
);

router.get(
  '/serviceCategoryList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CATEGORY, ACTIONS.VIEW),
  serviceCategoryController.getServiceCategoryList
);

router.get(
  '/serviceCategoryListPublic',
  serviceCategoryController.getServiceCategoryList
);

//***********************************************************SERVICE CATEGORY END *******************************************************************//

//***********************************************************CONTRACTOR*******************************************************************//

router.post(
  '/contractor',
  uploadNone(),
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CONTRACTORS, ACTIONS.ADD),

  contractorController.createContractor
);

router.put(
  '/contractor/:id',
  uploadNone(),
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CONTRACTORS, ACTIONS.EDIT),

  contractorController.updateContractor
);

router.get(
  '/contractorList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CONTRACTORS, ACTIONS.VIEW),
  contractorController.getContractorList
);

router.get('/contractorListPublic', contractorController.getContractorList);
//***********************************************************CONTRACTOR END *******************************************************************//

//***********************************************************PHOTO GALLERY *******************************************************************//

router.post(
  '/photoGallery',
  adminOrSubAdminAuth.authenticate,
  adminPhotoGalleryMiddleware.array(MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY, 10),
  checkPermission(ROLE_PERMISSION.PHOTO_GALLERY, ACTIONS.ADD),

  adminPhotoGalleryController.adminPhotoGallery
);

router.get(
  '/photoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.PHOTO_GALLERY, ACTIONS.VIEW),

  adminPhotoGalleryController.getPhotoGallery
);

router.put(
  '/photoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.PHOTO_GALLERY, ACTIONS.EDIT),
  adminPhotoGalleryMiddleware.array(MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY, 10),
  adminPhotoGalleryController.updateadminPhotoGallery
);

router.delete(
  '/delete-photoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.PHOTO_GALLERY, ACTIONS.DELETE),
  adminPhotoGalleryController.deleteAdminPhotoGallery
);

router.get(
  '/photoGalleryList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.PHOTO_GALLERY, ACTIONS.VIEW),
  adminPhotoGalleryController.getPhotoGalleryList
);

//***********************************************************PHOTO GALLERY END *******************************************************************//

//***********************************************************VIDEO GALLERY *******************************************************************//

// router.post('/videoGallery', adminOrSubAdminAuth.authenticate, adminVideoGalleryMiddleware.array(MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY, 10),
//     adminVideoGalleryController.adminVideoGallery)

router.post(
  '/videoGallery',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.VIDEO_GALLERY, ACTIONS.ADD),

  adminVideoGalleryMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY,
    },
    {
      name: MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL,
    },
  ]),
  adminVideoGalleryController.adminVideoGallery
);

router.get(
  '/videoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.VIDEO_GALLERY, ACTIONS.VIEW),
  adminVideoGalleryController.getVideoGallery
);

router.put(
  '/videoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.VIDEO_GALLERY, ACTIONS.EDIT),
  adminVideoGalleryMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY,
    },
    {
      name: MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL,
    },
  ]),
  adminVideoGalleryController.updateAdminVideoGallery
);

router.delete(
  '/videoGallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.VIDEO_GALLERY, ACTIONS.DELETE),
  adminVideoGalleryController.deleteAdminVideoGallery
);

router.get(
  '/videoGalleryList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.VIDEO_GALLERY, ACTIONS.VIEW),
  adminVideoGalleryController.getVideoGalleryList
);

//***********************************************************VIDEO GALLERY END *******************************************************************//

//*********************************************************** TELEPHONE *******************************************************************//
router.post(
  '/telephone',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.ADD),
  uploadNone(),
  telephoneController.createTelephone
);
router.put(
  '/telephone/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.EDIT),
  uploadNone(),
  telephoneController.updateTelephone
);
router.get(
  '/telephoneList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.VIEW),
  telephoneController.getTelephoneList
);
router.delete(
  '/telephone/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.DELETE),
  telephoneController.deleteTelephone
);
//*********************************************************** TELEPHONE END *******************************************************************//

//***********************************************************   SUB TELEPHONE   *******************************************************************//

router.post(
  '/subTelephone',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.ADD),
  adminTelephonePhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO
  ),
  subTelephoneController.createSubTelephone
);

router.put(
  '/subTelephone/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.EDIT),
  adminTelephonePhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO
  ),
  subTelephoneController.updateSubTelephone
);

router.get(
  '/subTelephoneList/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.VIEW),
  subTelephoneController.getSubTelephoneList
);

router.delete(
  '/subTelephone/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.TELEPHONE, ACTIONS.DELETE),
  subTelephoneController.deleteSubTelephone
);

//***********************************************************    SUB TELEPHONE END    *******************************************************************//

//***********************************************************       EVENT       *******************************************************************//

//router.post('/event', adminOrSubAdminAuth.authenticate, adminEventPhotoMiddleware.single(MULTER_FIELD_NAMES.ADMIN.EVENT), eventController.createEvent)

router.post(
  '/event',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.ADD),

  adminEventPhotoMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.ADMIN.EVENT,
    },
    {
      name: MULTER_FIELD_NAMES.ADMIN.QRCODE,
    },
  ]),
  eventController.createEvent
);

router.put(
  '/event/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.EDIT),
  adminEventPhotoMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.ADMIN.EVENT,
    },
    {
      name: MULTER_FIELD_NAMES.ADMIN.QRCODE,
    },
  ]),
  eventController.updateEvent
);

router.get(
  '/event/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.VIEW),
  eventController.getEventDetails
);

router.get(
  '/upComingEventList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.VIEW),
  eventController.getUpComingEventList
);

router.get(
  '/pastEventList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.VIEW),
  eventController.getPastEventList
);

router.get(
  '/eventAttendeesList/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.VIEW),
  eventController.getEventAttendeesList
);

router.post(
  '/event-activeInactive',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.ACTIVE_INACTIVE),
  eventController.eventActiveInactive
);

//***********************************************************       EVENT END     *******************************************************************//

//***********************************************************     DOWNLOAD CIRCULAR     *******************************************************************//

router.post(
  '/circular',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.ADD),
  adminCircularPhotoMiddleware.single(MULTER_FIELD_NAMES.ADMIN.CIRCULAR),
  downloadAndCircularController.createCircular
);

router.put(
  '/circular/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.EDIT),
  uploadNone(),
  downloadAndCircularController.updateCircular
);

router.get(
  '/circular/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.VIEW),
  downloadAndCircularController.getCircularDetails
);

router.get(
  '/circularList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.VIEW),
  downloadAndCircularController.getCircularList
);

router.post(
  '/circular-activeInactive',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.ACTIVE_INACTIVE),
  downloadAndCircularController.circularActiveInactive
);

//***********************************************************     DOWNLOAD CIRCULAR END     *******************************************************************//

//***********************************************************    SPONSORSHIP    *******************************************************************//
router.post(
  '/sponsorship',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_LIST, ACTIONS.ADD),
  UserSponsorshipMiddleware.single(MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO),
  sponsorshipController.createSponsorship
);

router.put(
  '/sponsorship/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_LIST, ACTIONS.EDIT),
  UserSponsorshipMiddleware.single(MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO),
  sponsorshipController.updateSponsorship
);

router.post(
  '/sponsorship-activeInactive',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_LIST, ACTIONS.ACTIVE_INACTIVE),

  sponsorshipController.sponsorshipActiveInactive
);

router.post(
  '/approve-sponsorship',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_REQUEST, ACTIONS.APPROVE_DECLINE),
  sponsorshipController.approveSponsorship
);

router.get(
  '/sponsorshipRequestList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_REQUEST, ACTIONS.VIEW),
  sponsorshipController.getSponsorshipRequestList
);

router.get(
  '/sponsorshipApporvedList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_LIST, ACTIONS.VIEW),
  sponsorshipController.getSponsorshipApprovedList
);

//***********************************************************   SPONSORSHIP END   *******************************************************************//

//***********************************************************     COMPLAINT     *******************************************************************//

// router.get('/complaint', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintFormList)


/// ADDED COMPLAINT IN ADMIN PANEL ADMIN CREATE COMPLAINT

router.post(
  '/complaint',
  adminOrSubAdminAuth.authenticate,
  userComplaintMiddleware.array(MULTER_FIELD_NAMES.COMPLAINT.PHOTO, 3),
  checkPermission(ROLE_PERMISSION.COMPLAINT, ACTIONS.ADD),
  adminComplaintController.createComplaintByAdmin
);


router.get(
  '/complaint',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_LIST, ACTIONS.VIEW),
  adminComplaintController.getComplaintFormList
);

// router.get('/complaintCompleted', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintCompletedFormList)
router.get(
  '/complaintCompleted',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_COMPLETED, ACTIONS.VIEW),
  adminComplaintController.getComplaintCompletedFormList
);

//router.get('/complaintCompleted/:id', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintCompletedForm)
router.get(
  '/complaint/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_LIST, ACTIONS.VIEW),
  adminComplaintController.getComplaintForm
);

//router.post('/assignContractor/:id', adminOrSubAdminAuth.authenticate, adminComplaintController.assignContractor)
router.post(
  '/assignContractor/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_LIST, ACTIONS.EDIT),
  adminComplaintController.assignContractor
);

// router.post('/complaintStatus', adminOrSubAdminAuth.authenticate, adminComplaintController.updateComplaintStatus)
router.post(
  '/complaintStatus',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_LIST, ACTIONS.EDIT),
  adminComplaintController.updateComplaintStatus
);

router.delete(
  '/complaint/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT_LIST, ACTIONS.DELETE),
  adminComplaintController.deleteComplaint
);
//***********************************************************     COMPLAINT END   *******************************************************************//

//***********************************************************    NOC    *******************************************************************//

// router.get('/nocList', adminOrSubAdminAuth.authenticate, adminNocDueController.getNocList)
router.get(
  '/nocList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.VIEW),
  adminNocDueController.getNocList
);

// router.get('/noc/:id', adminOrSubAdminAuth.authenticate, adminNocDueController.getNocDetails)
router.get(
  '/noc/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.VIEW),
  adminNocDueController.getNocDetails
);

// router.put(
//   '/noc/:id',
//   adminOrSubAdminAuth.authenticate,
//   checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.EDIT),
//   uploadNone(),
//   adminNocDueController.updateNoc
// );


router.put(
  '/noc/:id',
  adminOrSubAdminAuth.authenticate,resolveNocUserFolder,
  UserNocMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.NOC.ATT_APPLICATION_LETTER,
    },
    {
      name: MULTER_FIELD_NAMES.NOC.ATT_LIGHTBILL,
    },
    {
      name: MULTER_FIELD_NAMES.NOC.ATT_OTHER_DOC,
    },
    {
      name: MULTER_FIELD_NAMES.NOC.ATT_TAXBILL,
    },
    {
      name: MULTER_FIELD_NAMES.NOC.ATT_WATERBILL,
    },
    {
      name: MULTER_FIELD_NAMES.NOC.CHEQUE_PHOTO,
    },
  ]),

  validateRequest(userValidationss.nocFormSchema),

  adminNocDueController.updateNoc
);

router.post(
  '/noc',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.ADD),
  uploadNone(),
  adminNocDueController.addNocUserContribution
);

router.get(
  '/nocUserContributionList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.VIEW),
  adminNocDueController.getNocUserContributionList
);

router.delete(
  '/noc/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.DELETE),
  adminNocDueController.deleteNoc
)
//***********************************************************    NOC END   *******************************************************************//

//***********************************************************    WEB-DIRECTORY   *******************************************************************//

router.post(
  '/webDirectory',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.ADD),
  userWebDirectoryMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
      maxCount: 1,
    },
    {
      name: MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
      maxCount: 20,
    },
  ]),
  adminWebDirectoryController.adminCreateWebDirectory
);

// router.get('/webDirectory', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.getAdminWebDirectoryList)
router.get(
  '/webDirectory',
  adminOrSubAdminAuth.authenticate,

  checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.VIEW),
  adminWebDirectoryController.getAdminWebDirectoryList
);

//router.get('/webDirectory/:id', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.getWebDirectoryById,)
router.get(
  '/webDirectory/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.VIEW),
  adminWebDirectoryController.getWebDirectoryById
);

router.put(
  '/webDirectory/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.EDIT),
  userWebDirectoryMiddleware.fields([
    {
      name: MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
      maxCount: 1,
    },
    {
      name: MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
      maxCount: 10,
    },
  ]),
  adminWebDirectoryController.updateWebDirectory
);

//router.post('/webDirectory-activeInactive', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.webDirectoryActiveInactive)
router.post(
  '/webDirectory-activeInactive',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.ACTIVE_INACTIVE),
  adminWebDirectoryController.webDirectoryActiveInactive
);

//***********************************************************    WEB-DIRECTORY END  ********************************************************//

//***********************************************************    E-CARD   ********************************************************//
router.post(
  '/business-card',
  adminOrSubAdminAuth.authenticate,

  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.ADD),

  userBusinessCardProfileMiddleware.single(
    MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE
  ),
  adminBusinessCardController.createBusinessCard
);

router.put(
  '/business-card/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.EDIT),

  userBusinessCardProfileMiddleware.single(
    MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE
  ),
  adminBusinessCardController.updateBusinessCard
);

router.get(
  '/businessCard/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),

  adminBusinessCardController.getBusinessCard
);

router.get(
  '/businessCardList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),

  adminBusinessCardController.getBusinessCardList
);

router.get(
  '/digitalGallery-list/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),
  adminBusinessCardController.getDigitalGalleryList
);

router.post(
  '/digitalCard-gallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.ADD),
  UserDigitalCardGalleryMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY,
    10
  ),
  adminBusinessCardController.digitalCardGallery
);

router.get(
  '/digitalCardGallery-images/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),

  adminBusinessCardController.getDigitalGalleryImages
);

//Update Digtial Card Gallery
router.put(
  '/update-digitalCard-gallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.EDIT),
  UserDigitalCardGalleryMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY,
    10
  ),

  adminBusinessCardController.updateDigitalCardGallery
);

router.delete(
  '/delete-digitalCard-gallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.DELETE),
  adminBusinessCardController.deleteDigitalCardGallery
);

router.get(
  '/digitalCard-list/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),

  adminBusinessCardController.getDigitalCardList
);

router.post(
  '/digitalCard-slider/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.EDIT),
  UserDigitalCardSliderMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER,
    10
  ),

  adminBusinessCardController.digitalCardSlider
);

router.put(
  '/update-digitalCard-slider/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.EDIT),
  UserDigitalCardSliderMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER,
    10
  ),
  adminBusinessCardController.updateDigitalSlider
);

router.get(
  '/digitalCardSlider-images/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.VIEW),
  adminBusinessCardController.getDigitalSliderImages
);

router.delete(
  '/delete-digitalCard-gallery/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.E_CARD_MANAGEMENT, ACTIONS.DELETE),

  adminBusinessCardController.deleteDigitalCardGallery
);

// E-CARD URL WITHOUT AUTH OPEN API
router.get('/e-card/:name/:id', adminBusinessCardController.getBusinessCard);

// E-CARD GALLERY URL WITHOUT AUTH OPEN API
router.get(
  '/ecard-gallery/:id',
  adminBusinessCardController.getDigitalGalleries
);

//***********************************************************    E-CARD END  ********************************************************//

router.get(
  '/getInTouch',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CONTACT_US, ACTIONS.VIEW),
  getInTocuhController.getInTouchList
);

router.post(
  '/approveDeclineEventRegistration',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.APPROVE_DECLINE),
  eventController.approveDeclineEventRegistration
);

router.get(
  '/pendingPostedjob',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CAREER_OPPORTUNITIES, ACTIONS.VIEW),
  adminCareerOpportunityController.getPostedPendingJobList
);
router.get(
  '/approvedPostedjob',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CAREER_OPPORTUNITIES, ACTIONS.VIEW),
  adminCareerOpportunityController.getPostedApprovedJobList
);
router.post(
  '/approveDeclineJob',
  adminOrSubAdminAuth.authenticate,
  checkPermission(
    ROLE_PERMISSION.CAREER_OPPORTUNITIES,
    ACTIONS.APPROVE_DECLINE
  ),
  adminCareerOpportunityController.jobApproveDecline
);
router.post(
  '/activeInactiveJob',
  adminOrSubAdminAuth.authenticate,
  checkPermission(
    ROLE_PERMISSION.CAREER_OPPORTUNITIES,
    ACTIONS.ACTIVE_INACTIVE
  ),
  adminCareerOpportunityController.activeInactiveJobPost
);
router.get(
  '/deletePostedJobList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CAREER_OPPORTUNITIES, ACTIONS.DELETE),
  adminCareerOpportunityController.getDeletedJobList
);

router.get(
  '/appliedJobSeekerList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SEEKERS, ACTIONS.VIEW),

  adminApplyJobController.getAppliedJobSeekerList
);
router.get(
  '/appliedJobSeekerList/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SEEKERS, ACTIONS.VIEW),
  adminApplyJobController.getAppliedParticularJobSeekerList
);

//// EMAIL ///
router.post(
  '/sendEmailToPastEventAttendees',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.SEND_EMAIL),
  sendMailToPastEventAttendeesController.sendEventReminderToPastAttendees
);

router.post(
  '/sendJobSeekerDetails',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SEEKERS, ACTIONS.SEND_EMAIL),
  sendJobSeekerDetailsController.sendJobSeekerDetails
);

router.post('/import-users', async (req, res) => {
  try {
    const result = await processCSV();
    res.status(200).json(result);
  } catch (err) {
    console.error('Import failed:', err);
    res
      .status(500)
      .json({ status: 'error', message: 'CSV processing failed.', error: err });
  }
});
router.post('/import-nonmember-users', async (req, res) => {
  try {
    const result = await processNonMemberCSV();
    res.status(200).json(result);
  } catch (err) {
    console.error('Import failed:', err);
    res
      .status(500)
      .json({ status: 'error', message: 'CSV processing failed.', error: err });
  }
});

router.post(
  '/export-users',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.USERS, ACTIONS.EXPORT),
  csvController.exportUsersToExcel
);

//*********************************************************** ADMIN CONFIG *******************************************************************//
router.post(
  '/config',
  adminAuth.authenticate,

  adminConfigController.createConfig
);
router.get(
  '/config/:key',
  adminAuth.authenticate,
  adminConfigController.getConfig
);

router.put(
  '/config/:key',
  adminAuth.authenticate,
  adminConfigController.editConfig
);
router.get(
  '/config',
  adminAuth.authenticate,
  adminConfigController.getAllConfig
);
router.delete(
  '/config/:key',
  adminAuth.authenticate,
  adminConfigController.deleteConfig
);
//*********************************************************** ADMIN CONFIG  END *******************************************************************//

router.get(
  '/email-template/serviceRequests',
  adminAuth.authenticate,
  adminEmailTemplateController.getServiceRequestsEmailTemplates
);
router.get(
  '/email-template/events',
  adminAuth.authenticate,
  adminEmailTemplateController.getEventsEmailTemplates
);

router.put(
  '/email-template/:key',
  adminAuth.authenticate,
  adminEmailTemplateController.editEmailTemplate
);

/////////////// EXPORT DATA API ///

router.post(
  '/export/csv/servicerequest',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.COMPLAINT, ACTIONS.EXPORT),
  csvController.serviceRequestExportToExcel
);
router.post(
  '/export/csv/noc',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.EXPORT),
  csvController.nocNoDueExportToExcel
);
router.post(
  '/export/csv/seekers',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SEEKERS, ACTIONS.EXPORT),

  csvController.seekerExcel
);
router.post(
  '/export/csv/sponsorship',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SPONSORSHIP_LIST, ACTIONS.EXPORT),

  csvController.sponsorshipExcel
);
router.post(
  '/export/csv/careeropportunity',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CAREER_OPPORTUNITIES, ACTIONS.EXPORT),

  csvController.careerOpportunityExcel
);
router.post(
  '/export/csv/appliedjobs',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.SEEKERS, ACTIONS.EXPORT),
  csvController.appliedJobsExcel
);
router.post(
  '/export/csv/users',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.USERS, ACTIONS.EXPORT),
  csvController.usersExcel
);
router.post(
  '/export/csv/events',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.USERS, ACTIONS.EXPORT),
  csvController.allEventsListExcel
);

router.post(
  '/export/csv/circulars',
    adminOrSubAdminAuth.authenticate,
    checkPermission(ROLE_PERMISSION.DOWNLOAD_CIRCULAR, ACTIONS.EXPORT),
    csvController.circularsExcel
);
router.post(
  '/export/csv/webdirectory',
    adminOrSubAdminAuth.authenticate,
    checkPermission(ROLE_PERMISSION.WEB_DIRECTORY, ACTIONS.EXPORT),
    csvController.webDirectoryExcel
);



router.post(
  '/export/csv/event-attendees',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.EVENT, ACTIONS.EXPORT),
  csvController.eventAttendeesExcel
);
export default router;
