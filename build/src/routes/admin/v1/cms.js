"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middlewares/auth");
const multer_1 = require("../../../middlewares/multer/multer");
const constants_1 = require("../../../utils/constants");
const quickLinksController_1 = __importDefault(require("../../../controllers/cms/quickLinksController"));
const presidentMessageController_1 = __importDefault(require("../../../controllers/cms/presidentMessageController"));
const businessBulletinController_1 = __importDefault(require("../../../controllers/cms/businessBulletinController"));
const helper_1 = require("../../../utils/helper");
const contactUsController_1 = __importDefault(require("../../../controllers/cms/contactUsController"));
const aboutControllers_1 = __importDefault(require("../../../controllers/cms/aboutControllers"));
const overviewController_1 = __importDefault(require("../../../controllers/cms/overviewController"));
const ourVisionController_1 = __importDefault(require("../../../controllers/cms/ourVisionController"));
const ourMissionController_1 = __importDefault(require("../../../controllers/cms/ourMissionController"));
const maximizingVisibilityController_1 = __importDefault(require("../../../controllers/cms/maximizingVisibilityController"));
const adminUploadMiddleware_1 = require("../../../middlewares/multer/multer/adminUploadMiddleware");
const industriesController_1 = __importDefault(require("../../../controllers/cms/industriesController"));
const serviceAndFacilityController_1 = __importDefault(require("../../../controllers/cms/serviceAndFacilityController"));
const committeeController_1 = __importDefault(require("../../../controllers/cms/committeeController"));
const committeeMemberController_1 = __importDefault(require("../../../controllers/cms/committeeMemberController"));
const corporateSocialResponsibilityController_1 = __importDefault(require("../../../controllers/cms/corporateSocialResponsibilityController"));
const membershipBenefitsController_1 = __importDefault(require("../../../controllers/cms/membershipBenefitsController"));
const requiredDocumentsController_1 = __importDefault(require("../../../controllers/cms/requiredDocumentsController"));
const typeOfMembershipController_1 = __importDefault(require("../../../controllers/cms/typeOfMembershipController"));
const foreignEmbassiesController_1 = __importDefault(require("../../../controllers/cms/foreignEmbassiesController"));
const homeBannerController_1 = __importDefault(require("../../../controllers/cms/homeBannerController"));
const checkPermission_1 = require("../../../middlewares/checkPermission");
const router = (0, express_1.Router)();
//****************************************************** QUICK LINK ******************************************************************************//
router.post('/quickLink', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.ADD), multer_1.adminQuickLinkIconMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.QUICKLINK), quickLinksController_1.default.createQuickLink);
router.put('/quickLink/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.EDIT), multer_1.adminQuickLinkIconMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.QUICKLINK), quickLinksController_1.default.updateQuickLink);
router.get('/quickLinks', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.VIEW), quickLinksController_1.default.getQuickLinkList);
router.delete('/quickLink/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.DELETE), quickLinksController_1.default.deleteQuickLink);
//****************************************************** QUICK LINK END ******************************************************************************//
//****************************************************** PRESIDENT MESSAGE ******************************************************************************//
router.post('/presidentMessage', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.ADD), multer_1.adminPresidentPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.PRESIDENT), presidentMessageController_1.default.createPresidentMessage);
router.get('/presidentMessage', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.VIEW), presidentMessageController_1.default.getPresidentMessageList);
router.put('/presidentMessage/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.EDIT), multer_1.adminPresidentPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.PRESIDENT), presidentMessageController_1.default.updatePresidentMessage);
router.delete('/presidentMessage/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.DELETE), presidentMessageController_1.default.deletePresidentMessage);
//****************************************************** PRESIDENT MESSAGE END ******************************************************************************//
//****************************************************** BUSINESS BULLETIN ******************************************************************************//
router.post('/businessBulletin', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.ADD), multer_1.adminBusinessBulletinPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.PRESIDENT), businessBulletinController_1.default.createBusinessBulletin);
router.put('/businessBulletin/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.EDIT), multer_1.adminBusinessBulletinPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.PRESIDENT), businessBulletinController_1.default.updateBusinessBulletin);
router.get('/businessBulletin', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.VIEW), businessBulletinController_1.default.getBusinessBulletinList);
router.delete('/businessBulletin/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.DELETE), businessBulletinController_1.default.deleteBusinessBulletin);
//****************************************************** BUSINESS BULLETIN ******************************************************************************//
//****************************************************** CONTACT US ******************************************************************************//
router.post('/contactUs', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_CONTACT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), contactUsController_1.default.createAdminContactUs);
router.get('/contactUs', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_CONTACT_PAGE, constants_1.ACTIONS.VIEW), contactUsController_1.default.getContactUs);
router.put('/contactUs/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_CONTACT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), contactUsController_1.default.updateAdminContactUs);
//****************************************************** CONTACT US END ******************************************************************************//
//****************************************************** ABOUT ******************************************************************************//
router.post('/about', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), aboutControllers_1.default.createAbout);
router.put('/about/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), aboutControllers_1.default.updateAbout);
router.get('/about', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), aboutControllers_1.default.getAbout);
//****************************************************** ABOUT END ******************************************************************************//
//****************************************************** OVERVIEW ******************************************************************************//
router.post('/overview', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), overviewController_1.default.createOverview);
router.put('/overview/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), overviewController_1.default.updateOverview);
router.get('/overview', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), overviewController_1.default.getOverview);
//****************************************************** OVERVIEW END ******************************************************************************//
//****************************************************** OUR VISION ******************************************************************************//
router.post('/ourVision', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), ourVisionController_1.default.createOurVision);
router.put('/ourVision/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), ourVisionController_1.default.updateOurVision);
router.get('/ourVision', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), ourVisionController_1.default.getOurVision);
//****************************************************** OUR VISION END ******************************************************************************//
//****************************************************** OUR MISSION ******************************************************************************//
router.post('/ourMission', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), ourMissionController_1.default.createOurMission);
router.put('/ourMission/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), ourMissionController_1.default.updateOurMission);
router.get('/ourMission', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), ourMissionController_1.default.getOurMission);
//****************************************************** OUR MISSION END ******************************************************************************//
//***************************************************** MAXIMIZING VISIBILITY ******************************************************************************//
router.post('/maximizingVisibility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), maximizingVisibilityController_1.default.createMaximizingVisibility);
router.put('/maximizingVisibility/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), maximizingVisibilityController_1.default.updateMaximizingVisibility);
router.get('/maximizingVisibility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), maximizingVisibilityController_1.default.getMaximizingVisibility);
//***************************************************** MAXIMIZING VISIBILITY END ******************************************************************************//
//***************************************************** INDUSTRIES ******************************************************************************//
router.post('/industry', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminIndustriesMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.INDUSTRIES), industriesController_1.default.createIndustry);
router.get('/industries', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), industriesController_1.default.getIndustriesList);
router.put('/industry/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminIndustriesMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.INDUSTRIES), industriesController_1.default.updateIndustry);
router.delete('/industry/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.DELETE), industriesController_1.default.deleteIndustry);
//***************************************************** INDUSTRIES END ******************************************************************************//
//***************************************************** SERVICE & FACILITY ******************************************************************************//
router.post('/serviceAndFacility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminServiceAndFacilityMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY), serviceAndFacilityController_1.default.createServiceAndFacility);
router.get('/serviceAndFacility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), serviceAndFacilityController_1.default.getServiceAndFacilityList);
router.put('/serviceAndFacility/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminServiceAndFacilityMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY), serviceAndFacilityController_1.default.updateServiceAndFacility);
router.delete('/serviceAndFacility/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.DELETE), serviceAndFacilityController_1.default.deleteServiceAndFacility);
//***************************************************** SERVICE & FACILITY ******************************************************************************//
//************************************************** CORPORATE SOCIAL RESPONSIBILITY ******************************************************************************//
router.post('/corporateSocialResponsibility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), corporateSocialResponsibilityController_1.default.createCorporateSocialResponsibility);
router.put('/corporateSocialResponsibility/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), corporateSocialResponsibilityController_1.default.updateCorporateSocialResponsibility);
router.get('/corporateSocialResponsibility', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), corporateSocialResponsibilityController_1.default.getCorporateSocialResponsibility);
//************************************************** CORPORATE SOCIAL RESPONSIBILITY END ******************************************************************************//
//************************************************** COMMITTEE ******************************************************************************//
router.post('/committee', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), committeeController_1.default.createCommittee);
router.put('/committee/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), committeeController_1.default.updateCommittee);
router.get('/committeeList', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), committeeController_1.default.getCommitteeList);
router.delete('/committee/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.DELETE), committeeController_1.default.deleteCommittee);
//************************************************** COMMITTEE END ******************************************************************************//
//************************************************** COMMITTEE MEMBER ******************************************************************************//
router.post('/committeeMember', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminCommitteeMemberPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER), committeeMemberController_1.default.createCommitteeMember);
router.put('/committeeMember/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminCommitteeMemberPhotoMiddleware.single(constants_1.MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER), committeeMemberController_1.default.updateCommitteeMember);
router.get('/committeeMember/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.VIEW), committeeMemberController_1.default.getCommitteeMemberList);
router.delete('/committeeMember/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_ABOUT_PAGE, constants_1.ACTIONS.DELETE), committeeMemberController_1.default.deleteCommitteeMember);
//************************************************** COMMITTEE MEMBER END ******************************************************************************//
//************************************************** MEMBERSHIP BENEFITS POINTS ******************************************************************************//
router.post('/membershipBenefits', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), membershipBenefitsController_1.default.createMebershipBenefits);
router.put('/membershipBenefits/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), membershipBenefitsController_1.default.updateMebershipBenefits);
router.get('/membershipBenefits', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.VIEW), membershipBenefitsController_1.default.getMebershipBenefits);
//************************************************** MEMBERSHIP BENEFITS POINTS END ******************************************************************************//
//************************************************** REQUIRED DOCUMENTS ******************************************************************************//
router.post('/requiredDocuments', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), requiredDocumentsController_1.default.createRequiredDocuments);
router.put('/requiredDocuments/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), requiredDocumentsController_1.default.updateRequiredDocuments);
router.get('/requiredDocuments', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.VIEW), requiredDocumentsController_1.default.getRequiredDocuments);
//************************************************** REQUIRED DOCUMENTS END ******************************************************************************//
//************************************************** TYPE OF MEMBERSHIP ******************************************************************************//
router.post('/typeOfMembership', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.ADD), (0, helper_1.uploadNone)(), typeOfMembershipController_1.default.createTypeOfMembership);
router.put('/typeOfMembership/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.EDIT), (0, helper_1.uploadNone)(), typeOfMembershipController_1.default.updateTypeOfMembership);
router.get('/typeOfMembership', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.VIEW), typeOfMembershipController_1.default.getTypeOfMembership);
router.delete('/typeOfMembership/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, constants_1.ACTIONS.DELETE), typeOfMembershipController_1.default.deleteTypeOfMembership);
//************************************************** TYPE OF MEMBERSHIP END ******************************************************************************//
//************************************************** FOREIGN EMBASSIES******************************************************************************//
router.post('/foreignEmbassies', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminForeignEmbassiesPhotoMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES, 10), foreignEmbassiesController_1.default.createForeignEmbassies);
router.put('/foreignEmbassies/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminForeignEmbassiesPhotoMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES, 10), foreignEmbassiesController_1.default.updateForeignEmbassies);
router.get('/foreignEmbassies', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, constants_1.ACTIONS.VIEW), foreignEmbassiesController_1.default.getForeignEmbassies);
//************************************************** FOREIGN EMBASSIES END******************************************************************************//
//************************************************** HOME BANNER ******************************************************************************//
router.post('/homeBanner', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.ADD), adminUploadMiddleware_1.adminHomeBannerPhotoMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.HOMEBANNER, 10), homeBannerController_1.default.createHomeBanner);
router.put('/homeBanner/:id', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.EDIT), adminUploadMiddleware_1.adminHomeBannerPhotoMiddleware.array(constants_1.MULTER_FIELD_NAMES.ADMIN.HOMEBANNER, 10), homeBannerController_1.default.updateHomeBanner);
router.get('/homeBanner', auth_1.adminOrSubAdminAuth.authenticate, (0, checkPermission_1.checkPermission)(constants_1.ROLE_PERMISSION.CMS_HOME_PAGE, constants_1.ACTIONS.VIEW), homeBannerController_1.default.getHomeBanner);
//************************************************** HOME BANNER END ******************************************************************************//
router.post('/aboutUsImage', auth_1.adminOrSubAdminAuth.authenticate, 
// checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.ADD),
adminUploadMiddleware_1.adminOverviewImageMiddleware.fields([
    { name: constants_1.MULTER_FIELD_NAMES.OVERVIEW.IMAGE, maxCount: 2 },
    { name: constants_1.MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE, maxCount: 4 },
]), overviewController_1.default.createAboutUsImages);
router.put('/aboutUsImage', auth_1.adminOrSubAdminAuth.authenticate, 
// checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.ADD),
adminUploadMiddleware_1.adminOverviewImageMiddleware.fields([
    { name: constants_1.MULTER_FIELD_NAMES.OVERVIEW.IMAGE, maxCount: 2 },
    { name: constants_1.MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE, maxCount: 4 },
]), overviewController_1.default.updateAboutUsImage);
router.get('/aboutUsImage', 
// checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.VIEW),
overviewController_1.default.getAboutUsImages);
exports.default = router;
