import { Router } from "express";
import userPublicApiController from "../../../controllers/userPublicApis/userPublicApiController";

const router = Router();


router.get('/presidentMessage', userPublicApiController.getPresidentMessageList)

router.get('/upcomingEventList', userPublicApiController.getUpcomingEventList)

router.get('/pastEventList', userPublicApiController.getPastEventList)

router.get('/sponsorshipApporvedList', userPublicApiController.getSponsorshipApprovedAndActiveList)

router.get('/circularList', userPublicApiController.getActiveCircularList)

router.get('/quickLinks', userPublicApiController.getQuickLinkList)

router.get('/businessBulletin', userPublicApiController.getBusinessBulletinList)

router.get('/photoGalleryList', userPublicApiController.getPhotoGalleryList)

router.get('/videoGalleryList', userPublicApiController.getVideoGalleryList)

router.get('/telephoneList', userPublicApiController.getSubTelephoneList)

router.get('/foreignEmbassies', userPublicApiController.getForeignEmbassies)

router.get('/contactUs', userPublicApiController.getContactUs)

router.get('/about', userPublicApiController.getAbout)

router.get('/overview', userPublicApiController.getOverview)

router.get('/ourVision', userPublicApiController.getOurVision)

router.get('/ourMission', userPublicApiController.getOurMission)

router.get('/maximizingVisibility', userPublicApiController.getMaximizingVisibility)

router.get('/industries', userPublicApiController.getIndustriesList)

router.get('/requiredDocuments', userPublicApiController.getRequiredDocuments)

router.get('/membershipBenefits', userPublicApiController.getMebershipBenefits)

router.get('/typeOfMembership', userPublicApiController.getTypeOfMembership)

router.get('/committeeMember', userPublicApiController.getCommitteeMemberList)

router.get('/serviceAndFacility', userPublicApiController.getServiceAndFacilityList)

router.get('/corporateSocialResponsibility', userPublicApiController.getCorporateSocialResponsibility)

router.get('/memberSearch',userPublicApiController.getMemberSearchPagination)
  
router.get('/event/:id', userPublicApiController.getEventDetails)

router.get('/homeBanner', userPublicApiController.getHomeBanner)

router.get('/jobPostedList', userPublicApiController.getCareerOpportunityList)

export default router; 
