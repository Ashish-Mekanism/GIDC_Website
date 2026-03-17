"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const mebershipFormController_1 = __importDefault(require("../../../controllers/membershipForms/mebershipFormController"));
const helper_1 = require("../../../utils/helper");
const auth_2 = require("../../../middlewares/auth");
const multer_1 = require("../../../middlewares/multer/multer");
const constants_1 = require("../../../utils/constants");
const complaintFormController_1 = __importDefault(require("../../../controllers/complaintForms/complaintFormController"));
const getInTouchController_1 = __importDefault(require("../../../controllers/getInTouch/getInTouchController"));
const userUploadMiddleware_1 = require("../../../middlewares/multer/multer/userUploadMiddleware");
const businessCardController_1 = __importDefault(require("../../../controllers/businessCard/businessCardController"));
const webDirectoryController_1 = __importDefault(require("../../../controllers/webDirectory/webDirectoryController"));
const careerOpportunityController_1 = __importDefault(require("../../../controllers/careerOpportunity/careerOpportunityController"));
const validate_1 = __importDefault(require("../../../middlewares/validate"));
const nocNoDueController_1 = __importDefault(require("../../../controllers/nocNoDue/nocNoDueController"));
const sponsorshipController_1 = __importDefault(require("../../../controllers/sponsorship/sponsorshipController"));
const public_1 = __importDefault(require("./public"));
const bookEventController_1 = __importDefault(require("../../../controllers/bookEvent/bookEventController"));
const applyJobController_1 = __importDefault(require("../../../controllers/applyJob/applyJobController"));
const sendJobSeekerDetailsController_1 = __importDefault(require("../../../controllers/sendJobSeekerDetailsController"));
const preFilleDataController_1 = __importDefault(require("../../../controllers/preFilleDataController"));
const userValidationss_1 = __importDefault(require("../../../validations/userValidationss"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/public', public_1.default);
router.post('/become-member', auth_2.userAuth.authenticate, 
//validateRequest(registrationFormValidations.membershipValidationSchema),
multer_1.userUploadMiddleware.fields([
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
    {
        name: constants_1.MULTER_FIELD_NAMES.USER.CHEQUE,
    },
]), mebershipFormController_1.default.becomeAMember);
router.put('/membership-form', auth_2.userAuth.authenticate, multer_1.userUploadMiddleware.fields([
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
]), mebershipFormController_1.default.updateMembershipForm);
router.get('/member-details', auth_2.userAuth.authenticate, mebershipFormController_1.default.getMemberDetails);
router.post('/complaint', auth_2.userAuth.authenticate, multer_1.userComplaintMiddleware.array(constants_1.MULTER_FIELD_NAMES.COMPLAINT.PHOTO, 3), complaintFormController_1.default.createComplaint);
router.get('/serviceCategoryList', auth_2.userAuth.authenticate, complaintFormController_1.default.getServiceCategoryList);
router.post('/getintouch', getInTouchController_1.default.getIntouch);
router.post('/web-directory', auth_2.userAuth.authenticate, userUploadMiddleware_1.userWebDirectoryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
        maxCount: 1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
        maxCount: 20,
    },
]), webDirectoryController_1.default.createWebDirectory);
//web Directroy Open Api
router.get('/web-directory/:companyName/:id', webDirectoryController_1.default.getWebDirectory);
//Web Directory Auth Api
router.get('/web-directory', auth_2.userAuth.authenticate, webDirectoryController_1.default.getWebDirectoryWithAuth);
router.put('/web-directory/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.userWebDirectoryMiddleware.fields([
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.COMPANY_LOGO,
        maxCount: 1,
    },
    {
        name: constants_1.MULTER_FIELD_NAMES.WEBDIRECTORY.PRODUCT_PHOTO,
        maxCount: 10,
    },
]), webDirectoryController_1.default.updateWebDirectory);
router.post('/business-card', auth_2.userAuth.authenticate, userUploadMiddleware_1.userBusinessCardProfileMiddleware.single(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE), businessCardController_1.default.createBusinessCard);
router.put('/business-card/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.userBusinessCardProfileMiddleware.single(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE), businessCardController_1.default.updateBusinessCard);
router.post('/active-inactive-businessCard/:id', auth_2.userAuth.authenticate, businessCardController_1.default.activeInactiveBusinessCard);
router.get('/businessCard/:id', auth_2.userAuth.authenticate, businessCardController_1.default.getBusinessCard);
// E-CARD URL WITHOUT AUTH OPEN API
router.get('/e-card/:name/:id', businessCardController_1.default.getBusinessCard);
// E-CARD GALLERY URL WITHOUT AUTH OPEN API
router.get('/ecard-gallery/:id', businessCardController_1.default.getDigitalGalleries);
router.get('/digitalCard-list', auth_2.userAuth.authenticate, businessCardController_1.default.getDigitalCardList);
//************************************************************DIGITAL CARD GALLARY **********************************************************/
router.get('/digitalGallery-list/:id', auth_2.userAuth.authenticate, businessCardController_1.default.getDigitalGalleryList);
//Upload Digital Card Gallery
router.post('/digitalCard-gallery/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.UserDigitalCardGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY, 10), businessCardController_1.default.digitalCardGallery);
router.get('/digitalCardGallery-images/:id', auth_2.userAuth.authenticate, businessCardController_1.default.getDigitalGalleryImages);
//Update Digtial Card Gallery
router.put('/update-digitalCard-gallery/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.UserDigitalCardGalleryMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY, 10), businessCardController_1.default.updateDigitalCardGallery);
router.delete('/delete-digitalCard-gallery/:id', auth_2.userAuth.authenticate, businessCardController_1.default.deleteDigitalCardGallery);
//************************************************************DIGITAL CARD GALLARY ENDS********************************************************/
//************************************************************DIGITAL CARD SLIDER ***********************************************************/
router.post('/digitalCard-slider/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.UserDigitalCardSliderMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER, 10), businessCardController_1.default.digitalCardSlider);
router.put('/update-digitalCard-slider/:id', auth_2.userAuth.authenticate, userUploadMiddleware_1.UserDigitalCardSliderMiddleware.array(constants_1.MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER, 10), businessCardController_1.default.updateDigitalSlider);
router.get('/digitalCardSlider-images/:id', auth_2.userAuth.authenticate, businessCardController_1.default.getDigitalSliderImages);
router.post('/noc', auth_2.userAuth.authenticate, helper_1.resolveNocUserFolder, userUploadMiddleware_1.UserNocMiddleware.fields([
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
]), (0, validate_1.default)(userValidationss_1.default.nocFormSchema), nocNoDueController_1.default.createNoc);
router.post('/sponsorship', userUploadMiddleware_1.UserSponsorshipMiddleware.single(constants_1.MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO), sponsorshipController_1.default.createSponsorship);
// Sponsorship UPDATE,APPROVE SPONSORSHIP,SPONSORSHIP LIST AND ACTIVE/INACTIVE SPONSORSHIP IS IN ADMIN ROUTES
router.post('/bookEvent', userUploadMiddleware_1.UserBookingTransactionMiddleware.single(constants_1.MULTER_FIELD_NAMES.BOOKINGTRANSACTION.PHOTO), bookEventController_1.default.bookEvent);
router.post('/careerOpportunity', auth_2.userAuth.authenticate, (0, helper_1.uploadNone)(), careerOpportunityController_1.default.careerOpportunity);
router.get('/postedJobList', auth_2.userAuth.authenticate, careerOpportunityController_1.default.getPostedJobList);
router.put('/careerOpportunity/:id', auth_2.userAuth.authenticate, (0, helper_1.uploadNone)(), careerOpportunityController_1.default.updateCareerOpportunity);
router.get('/appliedJobSeekerList/:id', auth_2.userAuth.authenticate, careerOpportunityController_1.default.getAppliedParticularJobSeekerList);
router.delete('/careerOpportunity/:id', auth_2.userAuth.authenticate, careerOpportunityController_1.default.deleteCareerOpportunity);
router.post('/applyJob', userUploadMiddleware_1.userResumeMiddleware.single(constants_1.MULTER_FIELD_NAMES.APPLY_JOB.RESUME), applyJobController_1.default.applyJob);
router.post('/sendJobSeekerDetails', auth_2.userAuth.authenticate, sendJobSeekerDetailsController_1.default.sendJobSeekerDetails);
router.get('/prefilledData', auth_2.userAuth.authenticate, preFilleDataController_1.default.getPreFilledData);
exports.default = router;
