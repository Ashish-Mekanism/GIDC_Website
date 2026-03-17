"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const cms_1 = __importDefault(require("./cms"));
const auth_2 = require("../../../middlewares/auth");
const adminMemberController_1 = __importDefault(require("../../../controllers/admin/v1/adminMemberController"));
const helper_1 = require("../../../utils/helper");
const multer_1 = require("../../../middlewares/multer/multer");
const constants_1 = require("../../../utils/constants");
const serviceCategoryController_1 = __importDefault(require("../../../controllers/serviceCategory/serviceCategoryController"));
const contractorController_1 = __importDefault(require("../../../controllers/contractor/contractorController"));
const adminUploadMiddleware_1 = require("../../../middlewares/multer/multer/adminUploadMiddleware");
const adminPhotoGalleryController_1 = __importDefault(require("../../../controllers/adminPhotoGallery/adminPhotoGalleryController"));
const telephoneController_1 = __importDefault(require("../../../controllers/telephone/telephoneController"));
const subTelephoneController_1 = __importDefault(require("../../../controllers/subTelephone/subTelephoneController"));
const eventController_1 = __importDefault(require("../../../controllers/event/eventController"));
const downloadAndCircularController_1 = __importDefault(require("../../../controllers/downloadAndCircular/downloadAndCircularController"));
const sponsorshipController_1 = __importDefault(require("../../../controllers/sponsorship/sponsorshipController"));
const adminUserController_1 = __importDefault(require("../../../controllers/admin/v1/adminUserController"));
const checkPermission_1 = require("../../../middlewares/checkPermission");
const adminComplaintController_1 = __importDefault(require("../../../controllers/admin/v1/adminComplaintController"));
const adminNocDueController_1 = __importDefault(require("../../../controllers/admin/v1/adminNocDueController"));
const adminWebDirectoryController_1 = __importDefault(require("../../../controllers/admin/v1/adminWebDirectoryController"));
const adminBusinessCardController_1 = __importDefault(require("../../../controllers/admin/v1/adminBusinessCardController"));
const adminVideoGalleryController_1 = __importDefault(require("../../../controllers/adminVideoGallery/adminVideoGalleryController"));
const getInTouchController_1 = __importDefault(require("../../../controllers/getInTouch/getInTouchController"));
const adminCareerOpportunityController_1 = __importDefault(require("../../../controllers/admin/v1/adminCareerOpportunityController"));
const adminApplyJobController_1 = __importDefault(require("../../../controllers/admin/v1/adminApplyJobController"));
const sendMailToPastEventAttendeesController_1 = __importDefault(require("../../../controllers/sendMailToPastEventAttendeesController"));
const sendJobSeekerDetailsController_1 = __importDefault(require("../../../controllers/sendJobSeekerDetailsController"));
const importMembersController_1 = require("../../../controllers/importMembersController");
const csvController_1 = __importDefault(require("../../../controllers/csvController"));
const adminConfigController_1 = __importDefault(require("../../../controllers/admin/v1/adminConfigController"));
const adminEmailTemplateController_1 = __importDefault(require("../../../controllers/admin/v1/adminEmailTemplateController"));
const validate_1 = __importDefault(require("../../../middlewares/validate"));
const userValidationss_1 = __importDefault(require("../../../validations/userValidationss"));
const router = (0, express_1.Router)();
// All Auth Related Routes
router.use('/auth', auth_1.default);
//All CMS Related Routes
router.use('/cms', cms_1.default);
//router.get('/membersRequest-list', adminOrSubAdminAuth.authenticate,checkPermission(ROLE_PERMISSION.GALLERY, ACTIONS.VIEW),adminMemberController.getMembersRequestList);
router.get('/membersRequest-list', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_REQUEST, constants_1.ACTIONS.VIEW), adminMemberController_1.default.getMembersRequestList);
router.get('/membersApproved-list', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_LIST, constants_1.ACTIONS.VIEW), adminMemberController_1.default.getMembersApprovedList);
router.get('/member-details/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_LIST, constants_1.ACTIONS.VIEW), adminMemberController_1.default.getMemberDetails);
router.post('/membership-form/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_FORM, constants_1.ACTIONS.ADD), multer_1.userUploadMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.REP_1_PHOTO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.REP_2_PHOTO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_AL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_OO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_PL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_TO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_2,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_3,
    },
]), adminMemberController_1.default.createAMember);
router.put('/membership-form/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_FORM, constants_1.ACTIONS.EDIT), multer_1.userUploadMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.REP_1_PHOTO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.REP_2_PHOTO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_AL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_OO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_PL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.ATT_TO,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_2,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.OTHER_DOC_3,
    },
]), adminMemberController_1.default.updateMembershipForm);
router.post('/active-inactive', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_LIST, constants_1.ACTIONS.ACTIVE_INACTIVE), adminMemberController_1.default.memberActiveInactive);
router.post('/approve-member', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.MEMBER_LIST, constants_1.ACTIONS.APPROVE_DECLINE), adminUploadMiddleware_1.adminMembershipReceiptPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.RECEIPT_PHOTO), adminMemberController_1.default.approveMember);
router.get('/user-list', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.USERS, constants_1.ACTIONS.VIEW), adminUserController_1.default.getUserList);
//***********************************************************SERVICE CATEGORY *******************************************************************//
router.post('/serviceCategory', (0, helper_1.uploadNone)(), auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CATEGORY, constants_1.ACTIONS.ADD), serviceCategoryController_1.default.createServiceCategory);
router.put('/serviceCategory/:id', (0, helper_1.uploadNone)(), auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CATEGORY, constants_1.ACTIONS.EDIT), serviceCategoryController_1.default.updateServiceCategory);
router.get('/serviceCategoryList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CATEGORY, constants_1.ACTIONS.VIEW), serviceCategoryController_1.default.getServiceCategoryList);
router.get('/serviceCategoryListPublic', serviceCategoryController_1.default.getServiceCategoryList);
//***********************************************************SERVICE CATEGORY END *******************************************************************//
//***********************************************************CONTRACTOR*******************************************************************//
router.post('/contractor', (0, helper_1.uploadNone)(), auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CONTRACTORS, constants_1.ACTIONS.ADD), contractorController_1.default.createContractor);
router.put('/contractor/:id', (0, helper_1.uploadNone)(), auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CONTRACTORS, constants_1.ACTIONS.EDIT), contractorController_1.default.updateContractor);
router.get('/contractorList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CONTRACTORS, constants_1.ACTIONS.VIEW), contractorController_1.default.getContractorList);
router.get('/contractorListPublic', contractorController_1.default.getContractorList);
//***********************************************************CONTRACTOR END *******************************************************************//
//***********************************************************PHOTO GALLERY *******************************************************************//
router.post('/photoGallery', auth_2.adminOrSubAdminAuth.authenticate, adminUploadMiddleware_1.adminPhotoGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY, 10), (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.PHOTO_GALLERY, constants_1.ACTIONS.ADD), adminPhotoGalleryController_1.default.adminPhotoGallery);
router.get('/photoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.PHOTO_GALLERY, constants_1.ACTIONS.VIEW), adminPhotoGalleryController_1.default.getPhotoGallery);
router.put('/photoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.PHOTO_GALLERY, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminPhotoGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.PHOTOGALLERY, 10), adminPhotoGalleryController_1.default.updateadminPhotoGallery);
router.delete('/delete-photoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.PHOTO_GALLERY, constants_1.ACTIONS.DELETE), adminPhotoGalleryController_1.default.deleteAdminPhotoGallery);
router.get('/photoGalleryList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.PHOTO_GALLERY, constants_1.ACTIONS.VIEW), adminPhotoGalleryController_1.default.getPhotoGalleryList);
//***********************************************************PHOTO GALLERY END *******************************************************************//
//***********************************************************VIDEO GALLERY *******************************************************************//
// router.post('/videoGallery', adminOrSubAdminAuth.authenticate, adminVideoGalleryMiddleware.array(MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY, 10),
//     adminVideoGalleryController.adminVideoGallery)
router.post('/videoGallery', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.VIDEO_GALLERY, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminVideoGalleryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL,
    },
]), adminVideoGalleryController_1.default.adminVideoGallery);
router.get('/videoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.VIDEO_GALLERY, constants_1.ACTIONS.VIEW), adminVideoGalleryController_1.default.getVideoGallery);
router.put('/videoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.VIDEO_GALLERY, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminVideoGalleryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.VIDEOGALLERY_THUMBNAIL,
    },
]), adminVideoGalleryController_1.default.updateAdminVideoGallery);
router.delete('/videoGallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.VIDEO_GALLERY, constants_1.ACTIONS.DELETE), adminVideoGalleryController_1.default.deleteAdminVideoGallery);
router.get('/videoGalleryList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.VIDEO_GALLERY, constants_1.ACTIONS.VIEW), adminVideoGalleryController_1.default.getVideoGalleryList);
//***********************************************************VIDEO GALLERY END *******************************************************************//
//*********************************************************** TELEPHONE *******************************************************************//
router.post('/telephone', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), telephoneController_1.default.createTelephone);
router.put('/telephone/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), telephoneController_1.default.updateTelephone);
router.get('/telephoneList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.VIEW), telephoneController_1.default.getTelephoneList);
router.delete('/telephone/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.DELETE), telephoneController_1.default.deleteTelephone);
//*********************************************************** TELEPHONE END *******************************************************************//
//***********************************************************   SUB TELEPHONE   *******************************************************************//
router.post('/subTelephone', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminTelephonePhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO), subTelephoneController_1.default.createSubTelephone);
router.put('/subTelephone/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminTelephonePhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.TELEPHONE_LIST_PHOTO), subTelephoneController_1.default.updateSubTelephone);
router.get('/subTelephoneList/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.VIEW), subTelephoneController_1.default.getSubTelephoneList);
router.delete('/subTelephone/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.TELEPHONE, constants_1.ACTIONS.DELETE), subTelephoneController_1.default.deleteSubTelephone);
//***********************************************************    SUB TELEPHONE END    *******************************************************************//
//***********************************************************       EVENT       *******************************************************************//
//router.post('/event', adminOrSubAdminAuth.authenticate, adminEventPhotoMiddleware.single(MULTER_FIELD_NAMES.ADMIN.EVENT), eventController.createEvent)
router.post('/event', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminEventPhotoMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE,
    },
]), eventController_1.default.createEvent);
router.put('/event/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminEventPhotoMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE,
    },
]), eventController_1.default.updateEvent);
router.get('/event/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.VIEW), eventController_1.default.getEventDetails);
router.get('/upComingEventList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.VIEW), eventController_1.default.getUpComingEventList);
router.get('/pastEventList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.VIEW), eventController_1.default.getPastEventList);
router.get('/eventAttendeesList/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.VIEW), eventController_1.default.getEventAttendeesList);
router.post('/event-activeInactive', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.ACTIVE_INACTIVE), eventController_1.default.eventActiveInactive);
//***********************************************************       EVENT END     *******************************************************************//
//***********************************************************     DOWNLOAD CIRCULAR     *******************************************************************//
router.post('/circular', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminCircularPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.CIRCULAR), downloadAndCircularController_1.default.createCircular);
router.put('/circular/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), downloadAndCircularController_1.default.updateCircular);
router.get('/circular/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.VIEW), downloadAndCircularController_1.default.getCircularDetails);
router.get('/circularList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.VIEW), downloadAndCircularController_1.default.getCircularList);
router.post('/circular-activeInactive', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.ACTIVE_INACTIVE), downloadAndCircularController_1.default.circularActiveInactive);
//***********************************************************     DOWNLOAD CIRCULAR END     *******************************************************************//
//***********************************************************    SPONSORSHIP    *******************************************************************//
router.post('/sponsorship', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_LIST, constants_1.ACTIONS.ADD), multer_1.UserSponsorshipMiddleware.single(constants_1.MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO), sponsorshipController_1.default.createSponsorship);
router.put('/sponsorship/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_LIST, constants_1.ACTIONS.EDIT), multer_1.UserSponsorshipMiddleware.single(constants_1.MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO), sponsorshipController_1.default.updateSponsorship);
router.post('/sponsorship-activeInactive', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_LIST, constants_1.ACTIONS.ACTIVE_INACTIVE), sponsorshipController_1.default.sponsorshipActiveInactive);
router.post('/approve-sponsorship', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_REQUEST, constants_1.ACTIONS.APPROVE_DECLINE), sponsorshipController_1.default.approveSponsorship);
router.get('/sponsorshipRequestList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_REQUEST, constants_1.ACTIONS.VIEW), sponsorshipController_1.default.getSponsorshipRequestList);
router.get('/sponsorshipApporvedList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_LIST, constants_1.ACTIONS.VIEW), sponsorshipController_1.default.getSponsorshipApprovedList);
//***********************************************************   SPONSORSHIP END   *******************************************************************//
//***********************************************************     COMPLAINT     *******************************************************************//
// router.get('/complaint', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintFormList)
/// ADDED COMPLAINT IN ADMIN PANEL ADMIN CREATE COMPLAINT
router.post('/complaint', auth_2.adminOrSubAdminAuth.authenticate, multer_1.userComplaintMiddleware.array(constants_1.MULTER_FIELD_NAMES.COMPLAINT.PHOTO, 3), (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT, constants_1.ACTIONS.ADD), adminComplaintController_1.default.createComplaintByAdmin);
router.get('/complaint', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_LIST, constants_1.ACTIONS.VIEW), adminComplaintController_1.default.getComplaintFormList);
// router.get('/complaintCompleted', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintCompletedFormList)
router.get('/complaintCompleted', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_COMPLETED, constants_1.ACTIONS.VIEW), adminComplaintController_1.default.getComplaintCompletedFormList);
//router.get('/complaintCompleted/:id', adminOrSubAdminAuth.authenticate, adminComplaintController.getComplaintCompletedForm)
router.get('/complaint/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_LIST, constants_1.ACTIONS.VIEW), adminComplaintController_1.default.getComplaintForm);
//router.post('/assignContractor/:id', adminOrSubAdminAuth.authenticate, adminComplaintController.assignContractor)
router.post('/assignContractor/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_LIST, constants_1.ACTIONS.EDIT), adminComplaintController_1.default.assignContractor);
// router.post('/complaintStatus', adminOrSubAdminAuth.authenticate, adminComplaintController.updateComplaintStatus)
router.post('/complaintStatus', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_LIST, constants_1.ACTIONS.EDIT), adminComplaintController_1.default.updateComplaintStatus);
router.delete('/complaint/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT_LIST, constants_1.ACTIONS.DELETE), adminComplaintController_1.default.deleteComplaint);
//***********************************************************     COMPLAINT END   *******************************************************************//
//***********************************************************    NOC    *******************************************************************//
// router.get('/nocList', adminOrSubAdminAuth.authenticate, adminNocDueController.getNocList)
router.get('/nocList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.VIEW), adminNocDueController_1.default.getNocList);
// router.get('/noc/:id', adminOrSubAdminAuth.authenticate, adminNocDueController.getNocDetails)
router.get('/noc/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.VIEW), adminNocDueController_1.default.getNocDetails);
// router.put(
//   '/noc/:id',
//   adminOrSubAdminAuth.authenticate,
//   checkPermission(ROLE_PERMISSION.NOC_NO_DUE, ACTIONS.EDIT),
//   uploadNone(),
//   adminNocDueController.updateNoc
// );
router.put('/noc/:id', auth_2.adminOrSubAdminAuth.authenticate, helper_1.resolveNocUserFolder, multer_1.UserNocMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.ATT_APPLICATION_LETTER,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.ATT_LIGHTBILL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.ATT_OTHER_DOC,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.ATT_TAXBILL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.ATT_WATERBILL,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.NOC.CHEQUE_PHOTO,
    },
]), (0, validate_1.default)(userValidationss_1.default.nocFormSchema), adminNocDueController_1.default.updateNoc);
router.post('/noc', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), adminNocDueController_1.default.addNocUserContribution);
router.get('/nocUserContributionList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.VIEW), adminNocDueController_1.default.getNocUserContributionList);
router.delete('/noc/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.DELETE), adminNocDueController_1.default.deleteNoc);
//***********************************************************    NOC END   *******************************************************************//
//***********************************************************    WEB-DIRECTORY   *******************************************************************//
router.post('/webDirectory', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.ADD), multer_1.userWebDirectoryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
        maxCount: 1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
        maxCount: 20,
    },
]), adminWebDirectoryController_1.default.adminCreateWebDirectory);
// router.get('/webDirectory', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.getAdminWebDirectoryList)
router.get('/webDirectory', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.VIEW), adminWebDirectoryController_1.default.getAdminWebDirectoryList);
//router.get('/webDirectory/:id', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.getWebDirectoryById,)
router.get('/webDirectory/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.VIEW), adminWebDirectoryController_1.default.getWebDirectoryById);
router.put('/webDirectory/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.EDIT), multer_1.userWebDirectoryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
        maxCount: 1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
        maxCount: 10,
    },
]), adminWebDirectoryController_1.default.updateWebDirectory);
//router.post('/webDirectory-activeInactive', adminOrSubAdminAuth.authenticate, adminWebDirectoryController.webDirectoryActiveInactive)
router.post('/webDirectory-activeInactive', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.ACTIVE_INACTIVE), adminWebDirectoryController_1.default.webDirectoryActiveInactive);
//***********************************************************    WEB-DIRECTORY END  ********************************************************//
//***********************************************************    E-CARD   ********************************************************//
router.post('/business-card', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.ADD), multer_1.userBusinessCardProfileMiddleware.single(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE), adminBusinessCardController_1.default.createBusinessCard);
router.put('/business-card/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.EDIT), multer_1.userBusinessCardProfileMiddleware.single(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE), adminBusinessCardController_1.default.updateBusinessCard);
router.get('/businessCard/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getBusinessCard);
router.get('/businessCardList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getBusinessCardList);
router.get('/digitalGallery-list/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getDigitalGalleryList);
router.post('/digitalCard-gallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.ADD), multer_1.UserDigitalCardGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY, 10), adminBusinessCardController_1.default.digitalCardGallery);
router.get('/digitalCardGallery-images/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getDigitalGalleryImages);
//Update Digtial Card Gallery
router.put('/update-digitalCard-gallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.EDIT), multer_1.UserDigitalCardGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY, 10), adminBusinessCardController_1.default.updateDigitalCardGallery);
router.delete('/delete-digitalCard-gallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.DELETE), adminBusinessCardController_1.default.deleteDigitalCardGallery);
router.get('/digitalCard-list/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getDigitalCardList);
router.post('/digitalCard-slider/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.EDIT), multer_1.UserDigitalCardSliderMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER, 10), adminBusinessCardController_1.default.digitalCardSlider);
router.put('/update-digitalCard-slider/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.EDIT), multer_1.UserDigitalCardSliderMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER, 10), adminBusinessCardController_1.default.updateDigitalSlider);
router.get('/digitalCardSlider-images/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.VIEW), adminBusinessCardController_1.default.getDigitalSliderImages);
router.delete('/delete-digitalCard-gallery/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.E_CARD_MANAGEMENT, constants_1.ACTIONS.DELETE), adminBusinessCardController_1.default.deleteDigitalCardGallery);
// E-CARD URL WITHOUT AUTH OPEN API
router.get('/e-card/:name/:id', adminBusinessCardController_1.default.getBusinessCard);
// E-CARD GALLERY URL WITHOUT AUTH OPEN API
router.get('/ecard-gallery/:id', adminBusinessCardController_1.default.getDigitalGalleries);
//***********************************************************    E-CARD END  ********************************************************//
router.get('/getInTouch', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CONTACT_US, constants_1.ACTIONS.VIEW), getInTouchController_1.default.getInTouchList);
router.post('/approveDeclineEventRegistration', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.APPROVE_DECLINE), eventController_1.default.approveDeclineEventRegistration);
router.get('/pendingPostedjob', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.VIEW), adminCareerOpportunityController_1.default.getPostedPendingJobList);
router.get('/approvedPostedjob', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.VIEW), adminCareerOpportunityController_1.default.getPostedApprovedJobList);
router.post('/approveDeclineJob', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.APPROVE_DECLINE), adminCareerOpportunityController_1.default.jobApproveDecline);
router.post('/activeInactiveJob', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.ACTIVE_INACTIVE), adminCareerOpportunityController_1.default.activeInactiveJobPost);
router.get('/deletePostedJobList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.DELETE), adminCareerOpportunityController_1.default.getDeletedJobList);
router.get('/appliedJobSeekerList', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SEEKERS, constants_1.ACTIONS.VIEW), adminApplyJobController_1.default.getAppliedJobSeekerList);
router.get('/appliedJobSeekerList/:id', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SEEKERS, constants_1.ACTIONS.VIEW), adminApplyJobController_1.default.getAppliedParticularJobSeekerList);
//// EMAIL ///
router.post('/sendEmailToPastEventAttendees', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.SEND_EMAIL), sendMailToPastEventAttendeesController_1.default.sendEventReminderToPastAttendees);
router.post('/sendJobSeekerDetails', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SEEKERS, constants_1.ACTIONS.SEND_EMAIL), sendJobSeekerDetailsController_1.default.sendJobSeekerDetails);
router.post('/import-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, importMembersController_1.processCSV)();
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Import failed:', err);
        res
            .status(500)
            .json({ status: 'error', message: 'CSV processing failed.', error: err });
    }
}));
router.post('/import-nonmember-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, importMembersController_1.processNonMemberCSV)();
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Import failed:', err);
        res
            .status(500)
            .json({ status: 'error', message: 'CSV processing failed.', error: err });
    }
}));
router.post('/export-users', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.USERS, constants_1.ACTIONS.EXPORT), csvController_1.default.exportUsersToExcel);
//*********************************************************** ADMIN CONFIG *******************************************************************//
router.post('/config', auth_2.adminAuth.authenticate, adminConfigController_1.default.createConfig);
router.get('/config/:key', auth_2.adminAuth.authenticate, adminConfigController_1.default.getConfig);
router.put('/config/:key', auth_2.adminAuth.authenticate, adminConfigController_1.default.editConfig);
router.get('/config', auth_2.adminAuth.authenticate, adminConfigController_1.default.getAllConfig);
router.delete('/config/:key', auth_2.adminAuth.authenticate, adminConfigController_1.default.deleteConfig);
//*********************************************************** ADMIN CONFIG  END *******************************************************************//
router.get('/email-template/serviceRequests', auth_2.adminAuth.authenticate, adminEmailTemplateController_1.default.getServiceRequestsEmailTemplates);
router.get('/email-template/events', auth_2.adminAuth.authenticate, adminEmailTemplateController_1.default.getEventsEmailTemplates);
router.put('/email-template/:key', auth_2.adminAuth.authenticate, adminEmailTemplateController_1.default.editEmailTemplate);
/////////////// EXPORT DATA API ///
router.post('/export/csv/servicerequest', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.COMPLAINT, constants_1.ACTIONS.EXPORT), csvController_1.default.serviceRequestExportToExcel);
router.post('/export/csv/noc', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.NOC_NO_DUE, constants_1.ACTIONS.EXPORT), csvController_1.default.nocNoDueExportToExcel);
router.post('/export/csv/seekers', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SEEKERS, constants_1.ACTIONS.EXPORT), csvController_1.default.seekerExcel);
router.post('/export/csv/sponsorship', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SPONSORSHIP_LIST, constants_1.ACTIONS.EXPORT), csvController_1.default.sponsorshipExcel);
router.post('/export/csv/careeropportunity', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CAREER_OPPORTUNITIES, constants_1.ACTIONS.EXPORT), csvController_1.default.careerOpportunityExcel);
router.post('/export/csv/appliedjobs', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.SEEKERS, constants_1.ACTIONS.EXPORT), csvController_1.default.appliedJobsExcel);
router.post('/export/csv/users', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.USERS, constants_1.ACTIONS.EXPORT), csvController_1.default.usersExcel);
router.post('/export/csv/events', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.USERS, constants_1.ACTIONS.EXPORT), csvController_1.default.allEventsListExcel);
router.post('/export/csv/circulars', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.DOWNLOAD_CIRCULAR, constants_1.ACTIONS.EXPORT), csvController_1.default.circularsExcel);
router.post('/export/csv/webdirectory', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.WEB_DIRECTORY, constants_1.ACTIONS.EXPORT), csvController_1.default.webDirectoryExcel);
router.post('/export/csv/event-attendees', auth_2.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.EVENT, constants_1.ACTIONS.EXPORT), csvController_1.default.eventAttendeesExcel);
exports.default = router;
