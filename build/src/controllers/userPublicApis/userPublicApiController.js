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
const adminPhotoGalleryService_1 = require("../../services/admin/adminPhotoGallery/adminPhotoGalleryService");
const adminVideoGalleryService_1 = require("../../services/admin/adminVideoGallery/adminVideoGalleryService");
const adminCareerOpportunityService_1 = require("../../services/admin/careerOpportunity/adminCareerOpportunityService");
const downloadAndCircularService_1 = require("../../services/admin/downloadAndCircular/downloadAndCircularService");
const eventService_1 = require("../../services/admin/event/eventService");
const subTelephoneService_1 = require("../../services/admin/subTelephone/subTelephoneService");
const aboutService_1 = require("../../services/cms/aboutService");
const businessBulletinService_1 = require("../../services/cms/businessBulletinService");
const committeeMemberService_1 = require("../../services/cms/committeeMemberService");
const contactUsService_1 = require("../../services/cms/contactUsService");
const corporateSocialResponsibilityService_1 = require("../../services/cms/corporateSocialResponsibilityService");
const foreignEmbassiesService_1 = require("../../services/cms/foreignEmbassiesService");
const homeBannerService_1 = require("../../services/cms/homeBannerService");
const industriesService_1 = require("../../services/cms/industriesService");
const maximizingVisibilityService_1 = require("../../services/cms/maximizingVisibilityService");
const membershipBenefitsService_1 = require("../../services/cms/membershipBenefitsService");
const ourMissionService_1 = require("../../services/cms/ourMissionService");
const ourVisionService_1 = require("../../services/cms/ourVisionService");
const overviewService_1 = require("../../services/cms/overviewService");
const presidentMessageService_1 = require("../../services/cms/presidentMessageService");
const quickLinkService_1 = require("../../services/cms/quickLinkService");
const requiredDocumentsService_1 = require("../../services/cms/requiredDocumentsService");
const serviceAndFacilityService_1 = require("../../services/cms/serviceAndFacilityService");
const typeOfMembershipService_1 = require("../../services/cms/typeOfMembershipService");
const sponsorshipService_1 = require("../../services/sponsorshipService");
const membershipFormService_1 = require("../../services/user/membershipForm/membershipFormService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const constants_1 = require("../../utils/constants");
const responses_1 = require("../../utils/responses");
const getPresidentMessageList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const presidentMessageService = new presidentMessageService_1.PresidentMessageService;
    const subTelephoneList = yield presidentMessageService.getPresidentMessageList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'President Message List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subTelephoneList);
}));
const getUpcomingEventList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService;
    const eventList = yield eventService.getUpcomingEventListPublic();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Upcoming Event List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventList);
}));
const getPastEventList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService;
    const eventList = yield eventService.getPastEventListPublic();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Past Event List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventList);
}));
const getSponsorshipApprovedAndActiveList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorshipService = new sponsorshipService_1.SponsorshipService;
    const sponsorshipApprovedtList = yield sponsorshipService.getSponsorshipApprovedAndActiveList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sponsorship Approved List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, sponsorshipApprovedtList);
}));
const getActiveCircularList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const downloadAndCircularService = new downloadAndCircularService_1.DownloadAndCircularService;
    const query = req.query;
    const circularList = yield downloadAndCircularService.getActiveCircularList(query);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Circular List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, circularList);
}));
const getQuickLinkList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quickLinkService = new quickLinkService_1.QuickLinkService;
    const quickLinkList = yield quickLinkService.getQuickLinkList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Quick Link List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, quickLinkList);
}));
const getBusinessBulletinList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const businessBulletinService = new businessBulletinService_1.BusinessBulletinService;
    const businessBulletinList = yield businessBulletinService.getBusinessBulletinList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Business Bulletin List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, businessBulletinList);
}));
const getPhotoGalleryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminPhotoGalleryService = new adminPhotoGalleryService_1.AdminPhotoGalleryService;
    const photoGalleryList = yield adminPhotoGalleryService.getPhotoGalleryAllImages();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "  Photo Gallery List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, photoGalleryList);
}));
const getVideoGalleryList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminVideoGalleryService = new adminVideoGalleryService_1.AdminVideoGalleryService;
    const videoGalleryList = yield adminVideoGalleryService.getAdminVideoGalleryListUserSide();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Video Gallery List Success", constants_1.API_RESPONSE_STATUS.SUCCESS, videoGalleryList);
}));
const getSubTelephoneList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subTelephoneService = new subTelephoneService_1.SubTelephoneService;
    const subTelephoneList = yield subTelephoneService.getTelephoneWithSubList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Telephone List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, subTelephoneList);
}));
const getForeignEmbassies = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foreignEmbassiesService = new foreignEmbassiesService_1.ForeignEmbassiesService;
    const foreignEmbassies = yield foreignEmbassiesService.getForeignEmbassies();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Foreign Embassies Photo Success', constants_1.API_RESPONSE_STATUS.SUCCESS, foreignEmbassies);
}));
const getContactUs = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminContactUsService = new contactUsService_1.AdminContactUsService;
    const getContactUsSuccess = yield adminContactUsService.getContactUs();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Contact Us Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getContactUsSuccess);
}));
const getAbout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const aboutService = new aboutService_1.AboutService;
    const getAboutSuccess = yield aboutService.getAbout();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'About Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getAboutSuccess);
}));
const getOverview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const overviewService = new overviewService_1.OverviewService;
    const getOverviewSuccess = yield overviewService.getOverview();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Overview Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getOverviewSuccess);
}));
const getOurVision = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ourVisionService = new ourVisionService_1.OurVisionService;
    const getOurVisionSuccess = yield ourVisionService.getOurVision();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Our Vision Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getOurVisionSuccess);
}));
const getOurMission = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ourMissionService = new ourMissionService_1.OurMissionService;
    const getOurMissionSuccess = yield ourMissionService.getOurMission();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Our Mission Success", constants_1.API_RESPONSE_STATUS.SUCCESS, getOurMissionSuccess);
}));
const getMaximizingVisibility = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const maximizingVisibilityService = new maximizingVisibilityService_1.MaximizingVisibilityService;
    const getMaximizingVisibilitySuccess = yield maximizingVisibilityService.getMaximizingVisibility();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Maximizing Visibility Success", constants_1.API_RESPONSE_STATUS.SUCCESS, getMaximizingVisibilitySuccess);
}));
const getIndustriesList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const industriesService = new industriesService_1.IndustriesService;
    const industriesList = yield industriesService.getIndustriesList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Industrie List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, industriesList);
}));
const getRequiredDocuments = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredDocumentsService = new requiredDocumentsService_1.RequiredDocumentsService;
    const getMaximizingVisibilitySuccess = yield requiredDocumentsService.getRequiredDocuments();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Required Documents Success", constants_1.API_RESPONSE_STATUS.SUCCESS, getMaximizingVisibilitySuccess);
}));
const getMebershipBenefits = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipBenefitsService = new membershipBenefitsService_1.MembershipBenefitsService;
    const getMebershipBenefitsSuccess = yield membershipBenefitsService.getMebershipBenefits();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Mebership Benefits Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getMebershipBenefitsSuccess);
}));
const getTypeOfMembership = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const typeOfMembershipService = new typeOfMembershipService_1.TypeOfMembershipService;
    const getTypeOfMembershipSuccess = yield typeOfMembershipService.getTypeOfMembership();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Type Of Membership Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getTypeOfMembershipSuccess);
}));
const getCommitteeMemberList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const committeeMemberService = new committeeMemberService_1.CommitteeMemberService;
    const CommitteeModelList = yield committeeMemberService.getAllCommitteeMemberLists();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Committee Model List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, CommitteeModelList);
}));
const getServiceAndFacilityList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceAndFacilityService = new serviceAndFacilityService_1.ServiceAndFacilityService;
    const serviceAndFacilityList = yield serviceAndFacilityService.getServiceAndFacilityList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Service And Facility  List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, serviceAndFacilityList);
}));
const getCorporateSocialResponsibility = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const corporateSocialResponsibilityService = new corporateSocialResponsibilityService_1.CorporateSocialResponsibilityService;
    const getCorporateSocialResponsibilitySuccess = yield corporateSocialResponsibilityService.getCorporateSocialResponsibility();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Corporate Social Responsibility Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getCorporateSocialResponsibilitySuccess);
}));
const getMemberSearchPagination = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const membershipFormService = new membershipFormService_1.MembershipFormService;
    const reqQuery = req.query;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const UserId = req === null || req === void 0 ? void 0 : req.params.id;
    const getDigitalCardList = yield membershipFormService.getPaginatedMembers(reqQuery);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Digital Card List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, getDigitalCardList);
}));
const getEventDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const eventId = req.params.id;
    console.log(userid, " userid");
    console.log(eventId, " eventId");
    const photoGallery = yield eventService.getEventDetails(eventId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Photo Gallery Success', constants_1.API_RESPONSE_STATUS.SUCCESS, photoGallery);
}));
const getHomeBanner = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const homeBannerService = new homeBannerService_1.HomeBannerService;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const foreignEmbassies = yield homeBannerService.getHomeBanner();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Home Banner Photo Success', constants_1.API_RESPONSE_STATUS.SUCCESS, foreignEmbassies);
}));
const getCareerOpportunityList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminCareerOpportunityService = new adminCareerOpportunityService_1.AdminCareerOpportunityService;
    const careerOpportunityList = yield adminCareerOpportunityService.getCareerOpportunityList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Career Oppoetunities List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, careerOpportunityList);
}));
exports.default = {
    getPresidentMessageList,
    getUpcomingEventList,
    getPastEventList,
    getSponsorshipApprovedAndActiveList,
    getActiveCircularList,
    getQuickLinkList,
    getBusinessBulletinList,
    getPhotoGalleryList,
    getSubTelephoneList,
    getForeignEmbassies,
    getContactUs,
    getAbout,
    getOverview,
    getOurVision,
    getOurMission,
    getMaximizingVisibility,
    getIndustriesList,
    getRequiredDocuments,
    getMebershipBenefits,
    getTypeOfMembership,
    getCommitteeMemberList,
    getServiceAndFacilityList,
    getCorporateSocialResponsibility,
    getMemberSearchPagination,
    getEventDetails,
    getVideoGalleryList,
    getHomeBanner,
    getCareerOpportunityList,
};
