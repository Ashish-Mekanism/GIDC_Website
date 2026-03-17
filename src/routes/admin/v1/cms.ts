import { Router } from 'express';
import { adminOrSubAdminAuth } from '../../../middlewares/auth';
import {
  adminBusinessBulletinPhotoMiddleware,
  adminPresidentPhotoMiddleware,
  adminQuickLinkIconMiddleware,
} from '../../../middlewares/multer/multer';
import {
  ACTIONS,
  MULTER_FIELD_NAMES,
  ROLE_PERMISSION,
} from '../../../utils/constants';
import quickLinksController from '../../../controllers/cms/quickLinksController';
import presidentMessageController from '../../../controllers/cms/presidentMessageController';
import businessBulletinController from '../../../controllers/cms/businessBulletinController';
import { uploadNone } from '../../../utils/helper';
import contactUsController from '../../../controllers/cms/contactUsController';
import aboutControllers from '../../../controllers/cms/aboutControllers';
import overviewController from '../../../controllers/cms/overviewController';
import ourVisionController from '../../../controllers/cms/ourVisionController';
import ourMissionControler from '../../../controllers/cms/ourMissionController';
import maximizingVisibilityControler from '../../../controllers/cms/maximizingVisibilityController';
import {
  adminCommitteeMemberPhotoMiddleware,
  adminForeignEmbassiesPhotoMiddleware,
  adminHomeBannerPhotoMiddleware,
  adminIndustriesMiddleware,
  adminOverviewImageMiddleware,
  adminServiceAndFacilityMiddleware,
} from '../../../middlewares/multer/multer/adminUploadMiddleware';
import industriesController from '../../../controllers/cms/industriesController';
import serviceAndFacilityController from '../../../controllers/cms/serviceAndFacilityController';
import committeeController from '../../../controllers/cms/committeeController';
import committeeMemberController from '../../../controllers/cms/committeeMemberController';
import CorporateSocialResponsibilityController from '../../../controllers/cms/corporateSocialResponsibilityController';
import membershipBenefitsController from '../../../controllers/cms/membershipBenefitsController';
import requiredDocumentsController from '../../../controllers/cms/requiredDocumentsController';
import typeOfMembershipController from '../../../controllers/cms/typeOfMembershipController';
import foreignEmbassiesController from '../../../controllers/cms/foreignEmbassiesController';
import homeBannerController from '../../../controllers/cms/homeBannerController';
import { checkPermission } from '../../../middlewares/checkPermission';

const router = Router();
//****************************************************** QUICK LINK ******************************************************************************//
router.post(
  '/quickLink',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.ADD),
  adminQuickLinkIconMiddleware.single(MULTER_FIELD_NAMES.ADMIN.QUICKLINK),
  quickLinksController.createQuickLink
);

router.put(
  '/quickLink/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.EDIT),
  adminQuickLinkIconMiddleware.single(MULTER_FIELD_NAMES.ADMIN.QUICKLINK),
  quickLinksController.updateQuickLink
);

router.get(
  '/quickLinks',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.VIEW),
  quickLinksController.getQuickLinkList
);

router.delete(
  '/quickLink/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.DELETE),
  quickLinksController.deleteQuickLink
);

//****************************************************** QUICK LINK END ******************************************************************************//

//****************************************************** PRESIDENT MESSAGE ******************************************************************************//

router.post(
  '/presidentMessage',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.ADD),

  adminPresidentPhotoMiddleware.single(MULTER_FIELD_NAMES.ADMIN.PRESIDENT),
  presidentMessageController.createPresidentMessage
);

router.get(
  '/presidentMessage',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.VIEW),

  presidentMessageController.getPresidentMessageList
);

router.put(
  '/presidentMessage/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.EDIT),

  adminPresidentPhotoMiddleware.single(MULTER_FIELD_NAMES.ADMIN.PRESIDENT),
  presidentMessageController.updatePresidentMessage
);

router.delete(
  '/presidentMessage/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.DELETE),

  presidentMessageController.deletePresidentMessage
);

//****************************************************** PRESIDENT MESSAGE END ******************************************************************************//

//****************************************************** BUSINESS BULLETIN ******************************************************************************//

router.post(
  '/businessBulletin',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.ADD),

  adminBusinessBulletinPhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.PRESIDENT
  ),
  businessBulletinController.createBusinessBulletin
);

router.put(
  '/businessBulletin/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.EDIT),

  adminBusinessBulletinPhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.PRESIDENT
  ),
  businessBulletinController.updateBusinessBulletin
);

router.get(
  '/businessBulletin',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.VIEW),

  businessBulletinController.getBusinessBulletinList
);

router.delete(
  '/businessBulletin/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.DELETE),

  businessBulletinController.deleteBusinessBulletin
);

//****************************************************** BUSINESS BULLETIN ******************************************************************************//

//****************************************************** CONTACT US ******************************************************************************//

router.post(
  '/contactUs',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_CONTACT_PAGE, ACTIONS.ADD),
  uploadNone(),
  contactUsController.createAdminContactUs
);

router.get(
  '/contactUs',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_CONTACT_PAGE, ACTIONS.VIEW),
  contactUsController.getContactUs
);

router.put(
  '/contactUs/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_CONTACT_PAGE, ACTIONS.EDIT),
  uploadNone(),
  contactUsController.updateAdminContactUs
);

//****************************************************** CONTACT US END ******************************************************************************//

//****************************************************** ABOUT ******************************************************************************//

router.post(
  '/about',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),

  uploadNone(),
  aboutControllers.createAbout
);

router.put(
  '/about/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),

  uploadNone(),
  aboutControllers.updateAbout
);

router.get(
  '/about',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),

  aboutControllers.getAbout
);

//****************************************************** ABOUT END ******************************************************************************//

//****************************************************** OVERVIEW ******************************************************************************//

router.post(
  '/overview',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),
  uploadNone(),
  overviewController.createOverview
);

router.put(
  '/overview/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),
  uploadNone(),
  overviewController.updateOverview
);

router.get(
  '/overview',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),
  overviewController.getOverview
);

//****************************************************** OVERVIEW END ******************************************************************************//

//****************************************************** OUR VISION ******************************************************************************//

router.post(
  '/ourVision',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),

  uploadNone(),
  ourVisionController.createOurVision
);
router.put(
  '/ourVision/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),

  uploadNone(),
  ourVisionController.updateOurVision
);
router.get(
  '/ourVision',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),

  ourVisionController.getOurVision
);

//****************************************************** OUR VISION END ******************************************************************************//

//****************************************************** OUR MISSION ******************************************************************************//

router.post(
  '/ourMission',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),
  uploadNone(),
  ourMissionControler.createOurMission
);
router.put(
  '/ourMission/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),
  uploadNone(),
  ourMissionControler.updateOurMission
);
router.get(
  '/ourMission',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),
  ourMissionControler.getOurMission
);

//****************************************************** OUR MISSION END ******************************************************************************//

//***************************************************** MAXIMIZING VISIBILITY ******************************************************************************//

router.post(
  '/maximizingVisibility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),

  uploadNone(),
  maximizingVisibilityControler.createMaximizingVisibility
);
router.put(
  '/maximizingVisibility/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),

  uploadNone(),
  maximizingVisibilityControler.updateMaximizingVisibility
);
router.get(
  '/maximizingVisibility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),
  maximizingVisibilityControler.getMaximizingVisibility
);

//***************************************************** MAXIMIZING VISIBILITY END ******************************************************************************//

//***************************************************** INDUSTRIES ******************************************************************************//

router.post(
  '/industry',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),

  adminIndustriesMiddleware.single(MULTER_FIELD_NAMES.ADMIN.INDUSTRIES),
  industriesController.createIndustry
);

router.get(
  '/industries',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),

  industriesController.getIndustriesList
);

router.put(
  '/industry/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),

  adminIndustriesMiddleware.single(MULTER_FIELD_NAMES.ADMIN.INDUSTRIES),
  industriesController.updateIndustry
);

router.delete(
  '/industry/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.DELETE),

  industriesController.deleteIndustry
);

//***************************************************** INDUSTRIES END ******************************************************************************//

//***************************************************** SERVICE & FACILITY ******************************************************************************//

router.post(
  '/serviceAndFacility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),
  adminServiceAndFacilityMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY
  ),
  serviceAndFacilityController.createServiceAndFacility
);

router.get(
  '/serviceAndFacility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),
  serviceAndFacilityController.getServiceAndFacilityList
);

router.put(
  '/serviceAndFacility/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),
  adminServiceAndFacilityMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.SERVICEANDFACILITY
  ),
  serviceAndFacilityController.updateServiceAndFacility
);

router.delete(
  '/serviceAndFacility/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.DELETE),
  serviceAndFacilityController.deleteServiceAndFacility
);

//***************************************************** SERVICE & FACILITY ******************************************************************************//

//************************************************** CORPORATE SOCIAL RESPONSIBILITY ******************************************************************************//

router.post(
  '/corporateSocialResponsibility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),
  uploadNone(),
  CorporateSocialResponsibilityController.createCorporateSocialResponsibility
);
router.put(
  '/corporateSocialResponsibility/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),
  uploadNone(),
  CorporateSocialResponsibilityController.updateCorporateSocialResponsibility
);
router.get(
  '/corporateSocialResponsibility',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),
  CorporateSocialResponsibilityController.getCorporateSocialResponsibility
);

//************************************************** CORPORATE SOCIAL RESPONSIBILITY END ******************************************************************************//

//************************************************** COMMITTEE ******************************************************************************//

router.post(
  '/committee',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),
  uploadNone(),
  committeeController.createCommittee
);
router.put(
  '/committee/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),

  uploadNone(),
  committeeController.updateCommittee
);
router.get(
  '/committeeList',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),

  committeeController.getCommitteeList
);
router.delete(
  '/committee/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.DELETE),
  committeeController.deleteCommittee
);

//************************************************** COMMITTEE END ******************************************************************************//

//************************************************** COMMITTEE MEMBER ******************************************************************************//

router.post(
  '/committeeMember',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.ADD),

  adminCommitteeMemberPhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER
  ),
  committeeMemberController.createCommitteeMember
);

router.put(
  '/committeeMember/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.EDIT),
  adminCommitteeMemberPhotoMiddleware.single(
    MULTER_FIELD_NAMES.ADMIN.COMMITTEEMEMBER
  ),
  committeeMemberController.updateCommitteeMember
);

router.get(
  '/committeeMember/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.VIEW),

  committeeMemberController.getCommitteeMemberList
);

router.delete(
  '/committeeMember/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_ABOUT_PAGE, ACTIONS.DELETE),
  committeeMemberController.deleteCommitteeMember
);

//************************************************** COMMITTEE MEMBER END ******************************************************************************//

//************************************************** MEMBERSHIP BENEFITS POINTS ******************************************************************************//

router.post(
  '/membershipBenefits',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.ADD),

  uploadNone(),
  membershipBenefitsController.createMebershipBenefits
);
router.put(
  '/membershipBenefits/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.EDIT),
  uploadNone(),
  membershipBenefitsController.updateMebershipBenefits
);
router.get(
  '/membershipBenefits',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.VIEW),
  membershipBenefitsController.getMebershipBenefits
);

//************************************************** MEMBERSHIP BENEFITS POINTS END ******************************************************************************//

//************************************************** REQUIRED DOCUMENTS ******************************************************************************//

router.post(
  '/requiredDocuments',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.ADD),

  uploadNone(),
  requiredDocumentsController.createRequiredDocuments
);
router.put(
  '/requiredDocuments/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.EDIT),

  uploadNone(),
  requiredDocumentsController.updateRequiredDocuments
);
router.get(
  '/requiredDocuments',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.VIEW),

  requiredDocumentsController.getRequiredDocuments
);

//************************************************** REQUIRED DOCUMENTS END ******************************************************************************//

//************************************************** TYPE OF MEMBERSHIP ******************************************************************************//

router.post(
  '/typeOfMembership',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.ADD),
  uploadNone(),
  typeOfMembershipController.createTypeOfMembership
);
router.put(
  '/typeOfMembership/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.EDIT),
  uploadNone(),
  typeOfMembershipController.updateTypeOfMembership
);
router.get(
  '/typeOfMembership',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.VIEW),
  typeOfMembershipController.getTypeOfMembership
);
router.delete(
  '/typeOfMembership/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_MEMBERSHIP_PAGE, ACTIONS.DELETE),
  typeOfMembershipController.deleteTypeOfMembership
);

//************************************************** TYPE OF MEMBERSHIP END ******************************************************************************//

//************************************************** FOREIGN EMBASSIES******************************************************************************//
router.post(
  '/foreignEmbassies',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.ADD),
  adminForeignEmbassiesPhotoMiddleware.array(
    MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES,
    10
  ),
  foreignEmbassiesController.createForeignEmbassies
);
router.put(
  '/foreignEmbassies/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.EDIT),
  adminForeignEmbassiesPhotoMiddleware.array(
    MULTER_FIELD_NAMES.ADMIN.FOREIGNEMBASSIES,
    10
  ),
  foreignEmbassiesController.updateForeignEmbassies
);
router.get(
  '/foreignEmbassies',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.VIEW),
  foreignEmbassiesController.getForeignEmbassies
);

//************************************************** FOREIGN EMBASSIES END******************************************************************************//

//************************************************** HOME BANNER ******************************************************************************//
router.post(
  '/homeBanner',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.ADD),
  adminHomeBannerPhotoMiddleware.array(MULTER_FIELD_NAMES.ADMIN.HOMEBANNER, 10),
  homeBannerController.createHomeBanner
);
router.put(
  '/homeBanner/:id',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.EDIT),
  adminHomeBannerPhotoMiddleware.array(MULTER_FIELD_NAMES.ADMIN.HOMEBANNER, 10),
  homeBannerController.updateHomeBanner
);
router.get(
  '/homeBanner',
  adminOrSubAdminAuth.authenticate,
  checkPermission(ROLE_PERMISSION.CMS_HOME_PAGE, ACTIONS.VIEW),
  homeBannerController.getHomeBanner
);

//************************************************** HOME BANNER END ******************************************************************************//


router.post(
  '/aboutUsImage',
  adminOrSubAdminAuth.authenticate,
 // checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.ADD),
  adminOverviewImageMiddleware.fields([
    { name: MULTER_FIELD_NAMES.OVERVIEW.IMAGE, maxCount: 2},
    { name: MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE, maxCount: 4 },
  ]),
  overviewController.createAboutUsImages
);
router.put(
  '/aboutUsImage',
  adminOrSubAdminAuth.authenticate,
 // checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.ADD),
  adminOverviewImageMiddleware.fields([
    { name: MULTER_FIELD_NAMES.OVERVIEW.IMAGE, maxCount: 2},
    { name: MULTER_FIELD_NAMES.CORPORATE_SOCIAL_RESPONSIBILITY.IMAGE, maxCount: 4 },
  ]),
  overviewController.updateAboutUsImage
);

router.get(
  '/aboutUsImage',
 // checkPermission(ROLE_PERMISSION.CMS_DOWNLOAD_PAGE, ACTIONS.VIEW),
  overviewController.getAboutUsImages
);


export default router;
