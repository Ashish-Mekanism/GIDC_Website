import { NextFunction, Router } from 'express';
import userAuthRoutes from './auth';
import memebershipFormController from '../../../controllers/membershipForms/mebershipFormController';
import { resolveNocUserFolder, uploadNone } from '../../../utils/helper';
import { userAuth } from '../../../middlewares/auth';
import {
  userComplaintMiddleware,
  userUploadMiddleware,
} from '../../../middlewares/multer/multer';
import { MULTER_FIELD_NAMES } from '../../../utils/constants';
import complaintFormController from '../../../controllers/complaintForms/complaintFormController';
import getInTocuhController from '../../../controllers/getInTouch/getInTouchController';
import {
  UserBookingTransactionMiddleware,
  userBusinessCardProfileMiddleware,
  UserDigitalCardGalleryMiddleware,
  UserDigitalCardSliderMiddleware,
  UserNocMiddleware,
  userResumeMiddleware,
  UserSponsorshipMiddleware,
  userWebDirectoryMiddleware,
} from '../../../middlewares/multer/multer/userUploadMiddleware';

import businessCardController from '../../../controllers/businessCard/businessCardController';
import { userDigitalCardGalleryService } from '../../../services/fileService';
import webDirectoryController from '../../../controllers/webDirectory/webDirectoryController';
import careerOpportunityController from '../../../controllers/careerOpportunity/careerOpportunityController';
import validateRequest from '../../../middlewares/validate';
import registrationFormValidations from '../../../validations/registrationFormValidations';
import nocNoDueController from '../../../controllers/nocNoDue/nocNoDueController';
import sponsorshipController from '../../../controllers/sponsorship/sponsorshipController';
import userPublicRoutes from './public';
import bookEventController from '../../../controllers/bookEvent/bookEventController';
import applyJobController from '../../../controllers/applyJob/applyJobController';
import snedGridTestingController from '../../../controllers/sendMailToPastEventAttendeesController';
import sendJobSeekerDetailsController from '../../../controllers/sendJobSeekerDetailsController';
import preFilleDataController from '../../../controllers/preFilleDataController';
import userValidationss from '../../../validations/userValidationss';

const router = Router();
router.use('/auth', userAuthRoutes);

router.use('/public', userPublicRoutes);

router.post(
  '/become-member',
  userAuth.authenticate,
  //validateRequest(registrationFormValidations.membershipValidationSchema),
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
    {
      name: MULTER_FIELD_NAMES.USER.CHEQUE,
    },
  ]),
  memebershipFormController.becomeAMember
);

router.put(
  '/membership-form',
  userAuth.authenticate,
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
  memebershipFormController.updateMembershipForm
);

router.get(
  '/member-details',
  userAuth.authenticate,
  memebershipFormController.getMemberDetails
);

router.post(
  '/complaint',
  userAuth.authenticate,
  userComplaintMiddleware.array(MULTER_FIELD_NAMES.COMPLAINT.PHOTO, 3),
  complaintFormController.createComplaint
);
router.get(
  '/serviceCategoryList',
  userAuth.authenticate,
  complaintFormController.getServiceCategoryList
);

router.post('/getintouch', getInTocuhController.getIntouch);

router.post(
  '/web-directory',
  userAuth.authenticate,
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
  webDirectoryController.createWebDirectory
);

//web Directroy Open Api
router.get(
  '/web-directory/:companyName/:id',
  webDirectoryController.getWebDirectory
);

//Web Directory Auth Api
router.get(
  '/web-directory',
  userAuth.authenticate,
  webDirectoryController.getWebDirectoryWithAuth
);

router.put(
  '/web-directory/:id',
  userAuth.authenticate,
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
  webDirectoryController.updateWebDirectory
);

router.post(
  '/business-card',
  userAuth.authenticate,
  userBusinessCardProfileMiddleware.single(
    MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE
  ),
  businessCardController.createBusinessCard
);

router.put(
  '/business-card/:id',
  userAuth.authenticate,
  userBusinessCardProfileMiddleware.single(
    MULTER_FIELD_NAMES.BUSINESSCARD.PROFILE
  ),
  businessCardController.updateBusinessCard
);

router.post(
  '/active-inactive-businessCard/:id',
  userAuth.authenticate,
  businessCardController.activeInactiveBusinessCard
);

router.get(
  '/businessCard/:id',
  userAuth.authenticate,
  businessCardController.getBusinessCard
);

// E-CARD URL WITHOUT AUTH OPEN API
router.get('/e-card/:name/:id', businessCardController.getBusinessCard);

// E-CARD GALLERY URL WITHOUT AUTH OPEN API
router.get('/ecard-gallery/:id', businessCardController.getDigitalGalleries);

router.get(
  '/digitalCard-list',
  userAuth.authenticate,
  businessCardController.getDigitalCardList
);

//************************************************************DIGITAL CARD GALLARY **********************************************************/

router.get(
  '/digitalGallery-list/:id',
  userAuth.authenticate,
  businessCardController.getDigitalGalleryList
);
//Upload Digital Card Gallery
router.post(
  '/digitalCard-gallery/:id',
  userAuth.authenticate,
  UserDigitalCardGalleryMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY,
    10
  ),
  businessCardController.digitalCardGallery
);

router.get(
  '/digitalCardGallery-images/:id',
  userAuth.authenticate,
  businessCardController.getDigitalGalleryImages
);

//Update Digtial Card Gallery
router.put(
  '/update-digitalCard-gallery/:id',
  userAuth.authenticate,
  UserDigitalCardGalleryMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALGALLERY,
    10
  ),
  businessCardController.updateDigitalCardGallery
);

router.delete(
  '/delete-digitalCard-gallery/:id',
  userAuth.authenticate,
  businessCardController.deleteDigitalCardGallery
);

//************************************************************DIGITAL CARD GALLARY ENDS********************************************************/

//************************************************************DIGITAL CARD SLIDER ***********************************************************/
router.post(
  '/digitalCard-slider/:id',
  userAuth.authenticate,
  UserDigitalCardSliderMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER,
    10
  ),
  businessCardController.digitalCardSlider
);

router.put(
  '/update-digitalCard-slider/:id',
  userAuth.authenticate,
  UserDigitalCardSliderMiddleware.array(
    MULTER_FIELD_NAMES.BUSINESSCARD.DIGITALSLIDER,
    10
  ),
  businessCardController.updateDigitalSlider
);

router.get(
  '/digitalCardSlider-images/:id',
  userAuth.authenticate,
  businessCardController.getDigitalSliderImages
);

router.post(
  '/noc',
  userAuth.authenticate,resolveNocUserFolder,
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

  nocNoDueController.createNoc
);

router.post(
  '/sponsorship',
  UserSponsorshipMiddleware.single(MULTER_FIELD_NAMES.SPONSORSHIP.PHOTO),
  sponsorshipController.createSponsorship
);
// Sponsorship UPDATE,APPROVE SPONSORSHIP,SPONSORSHIP LIST AND ACTIVE/INACTIVE SPONSORSHIP IS IN ADMIN ROUTES

router.post(
  '/bookEvent',
  UserBookingTransactionMiddleware.single(
    MULTER_FIELD_NAMES.BOOKINGTRANSACTION.PHOTO
  ),
  bookEventController.bookEvent
);

router.post(
  '/careerOpportunity',
  userAuth.authenticate,
  uploadNone(),
  careerOpportunityController.careerOpportunity
);

router.get(
  '/postedJobList',
  userAuth.authenticate,
  careerOpportunityController.getPostedJobList
);

router.put(
  '/careerOpportunity/:id',
  userAuth.authenticate,
  uploadNone(),
  careerOpportunityController.updateCareerOpportunity
);

router.get(
  '/appliedJobSeekerList/:id',
  userAuth.authenticate,
  careerOpportunityController.getAppliedParticularJobSeekerList
);

router.delete(
  '/careerOpportunity/:id',
  userAuth.authenticate,
  careerOpportunityController.deleteCareerOpportunity
);

router.post(
  '/applyJob',
  userResumeMiddleware.single(MULTER_FIELD_NAMES.APPLY_JOB.RESUME),
  applyJobController.applyJob
);

router.post(
  '/sendJobSeekerDetails',
  userAuth.authenticate,
  sendJobSeekerDetailsController.sendJobSeekerDetails
);

router.get(
  '/prefilledData',
  userAuth.authenticate,
  preFilleDataController.getPreFilledData
);
export default router;
