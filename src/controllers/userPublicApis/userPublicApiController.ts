import { AdminPhotoGalleryService } from "../../services/admin/adminPhotoGallery/adminPhotoGalleryService";
import { AdminVideoGalleryService } from "../../services/admin/adminVideoGallery/adminVideoGalleryService";
import { AdminCareerOpportunityService } from "../../services/admin/careerOpportunity/adminCareerOpportunityService";
import { DownloadAndCircularService } from "../../services/admin/downloadAndCircular/downloadAndCircularService";
import { EventService } from "../../services/admin/event/eventService";
import { SubTelephoneService } from "../../services/admin/subTelephone/subTelephoneService";
import { AboutService } from "../../services/cms/aboutService";
import { BusinessBulletinService } from "../../services/cms/businessBulletinService";
import { CommitteeMemberService } from "../../services/cms/committeeMemberService";
import { AdminContactUsService } from "../../services/cms/contactUsService";
import { CorporateSocialResponsibilityService } from "../../services/cms/corporateSocialResponsibilityService";
import { ForeignEmbassiesService } from "../../services/cms/foreignEmbassiesService";
import { HomeBannerService } from "../../services/cms/homeBannerService";
import { IndustriesService } from "../../services/cms/industriesService";
import { MaximizingVisibilityService } from "../../services/cms/maximizingVisibilityService";
import { MembershipBenefitsService } from "../../services/cms/membershipBenefitsService";
import { OurMissionService } from "../../services/cms/ourMissionService";
import { OurVisionService } from "../../services/cms/ourVisionService";
import { OverviewService } from "../../services/cms/overviewService";
import { PresidentMessageService } from "../../services/cms/presidentMessageService";
import { QuickLinkService } from "../../services/cms/quickLinkService";
import { RequiredDocumentsService } from "../../services/cms/requiredDocumentsService";
import { ServiceAndFacilityService } from "../../services/cms/serviceAndFacilityService";
import { TypeOfMembershipService } from "../../services/cms/typeOfMembershipService";
import { SponsorshipService } from "../../services/sponsorshipService";
import { MembershipFormService } from "../../services/user/membershipForm/membershipFormService";
import { CustomRequest } from "../../types/common";
import { IPaginationQuery } from "../../types/requests";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData } from "../../utils/responses";
import { Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

const getPresidentMessageList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const presidentMessageService = new PresidentMessageService

        const subTelephoneList = await presidentMessageService.getPresidentMessageList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'President Message List Success',
            API_RESPONSE_STATUS.SUCCESS,
            subTelephoneList

        );
    }
);

const getUpcomingEventList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const eventService = new EventService

        const eventList = await eventService.getUpcomingEventListPublic()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Upcoming Event List Success',
            API_RESPONSE_STATUS.SUCCESS,
            eventList



        );
    }
);

const getPastEventList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const eventService = new EventService

        const eventList = await eventService.getPastEventListPublic()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Past Event List Success',
            API_RESPONSE_STATUS.SUCCESS,
            eventList

        );
    }
);

const getSponsorshipApprovedAndActiveList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const sponsorshipService = new SponsorshipService


        const sponsorshipApprovedtList = await sponsorshipService.getSponsorshipApprovedAndActiveList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Sponsorship Approved List Success',
            API_RESPONSE_STATUS.SUCCESS,
            sponsorshipApprovedtList



        );
    }
);

const getActiveCircularList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const downloadAndCircularService = new DownloadAndCircularService
        const query = req.query;

        const circularList = await downloadAndCircularService.getActiveCircularList(query)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Circular List Success',
            API_RESPONSE_STATUS.SUCCESS,
            circularList



        );
    }
);

const getQuickLinkList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {

        const quickLinkService = new QuickLinkService


        const quickLinkList = await quickLinkService.getQuickLinkList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Quick Link List Success',
            API_RESPONSE_STATUS.SUCCESS,
            quickLinkList
        );
    }
);

const getBusinessBulletinList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const businessBulletinService = new BusinessBulletinService

        const businessBulletinList = await businessBulletinService.getBusinessBulletinList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Business Bulletin List Success',
            API_RESPONSE_STATUS.SUCCESS,
            businessBulletinList



        );
    }
);

const getPhotoGalleryList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const adminPhotoGalleryService = new AdminPhotoGalleryService

        const photoGalleryList = await adminPhotoGalleryService.getPhotoGalleryAllImages();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            "  Photo Gallery List Success",
            API_RESPONSE_STATUS.SUCCESS,
            photoGalleryList,
        );
    }
);

const getVideoGalleryList = asyncHandler(
    async (req: CustomRequest, res: Response) => {
        const adminVideoGalleryService = new AdminVideoGalleryService

        const videoGalleryList = await adminVideoGalleryService.getAdminVideoGalleryListUserSide();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            "Video Gallery List Success",
            API_RESPONSE_STATUS.SUCCESS,
            videoGalleryList,
        );
    }
);


const getSubTelephoneList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const subTelephoneService = new SubTelephoneService

        const subTelephoneList = await subTelephoneService.getTelephoneWithSubList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Telephone List Success',
            API_RESPONSE_STATUS.SUCCESS,
            subTelephoneList

        );
    }
);

const getForeignEmbassies = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const foreignEmbassiesService = new ForeignEmbassiesService


        const foreignEmbassies = await foreignEmbassiesService.getForeignEmbassies()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Foreign Embassies Photo Success',
            API_RESPONSE_STATUS.SUCCESS,
            foreignEmbassies



        );
    }
);

const getContactUs = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminContactUsService = new AdminContactUsService


        const getContactUsSuccess = await adminContactUsService.getContactUs()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Contact Us Success',
            API_RESPONSE_STATUS.SUCCESS,
            getContactUsSuccess



        );
    }
);

const getAbout = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const aboutService = new AboutService


        const getAboutSuccess = await aboutService.getAbout()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'About Success',
            API_RESPONSE_STATUS.SUCCESS,
            getAboutSuccess



        );
    }
);

const getOverview = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const overviewService = new OverviewService


        const getOverviewSuccess = await overviewService.getOverview()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Overview Success',
            API_RESPONSE_STATUS.SUCCESS,
            getOverviewSuccess



        );
    }
);

const getOurVision = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const ourVisionService = new OurVisionService


        const getOurVisionSuccess = await ourVisionService.getOurVision()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Our Vision Success',
            API_RESPONSE_STATUS.SUCCESS,
            getOurVisionSuccess



        );
    }
);

const getOurMission = asyncHandler(
    async (req: CustomRequest<Request>, res: Response) => {
        const ourMissionService = new OurMissionService;


        const getOurMissionSuccess = await ourMissionService.getOurMission();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            "Our Mission Success",
            API_RESPONSE_STATUS.SUCCESS,
            getOurMissionSuccess
        );
    }
);

const getMaximizingVisibility = asyncHandler(
    async (req: CustomRequest<Request>, res: Response) => {
        const maximizingVisibilityService = new MaximizingVisibilityService;

        const getMaximizingVisibilitySuccess = await maximizingVisibilityService.getMaximizingVisibility();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            "Maximizing Visibility Success",
            API_RESPONSE_STATUS.SUCCESS,
            getMaximizingVisibilitySuccess
        );
    }
);

const getIndustriesList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const industriesService = new IndustriesService

        const industriesList = await industriesService.getIndustriesList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Industrie List Success',
            API_RESPONSE_STATUS.SUCCESS,
            industriesList



        );
    }
);

const getRequiredDocuments = asyncHandler(
    async (req: CustomRequest<Request>, res: Response) => {
        const requiredDocumentsService = new RequiredDocumentsService;


        const getMaximizingVisibilitySuccess = await requiredDocumentsService.getRequiredDocuments();

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            "Required Documents Success",
            API_RESPONSE_STATUS.SUCCESS,
            getMaximizingVisibilitySuccess
        );
    }
);

const getMebershipBenefits = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const membershipBenefitsService = new MembershipBenefitsService

        const getMebershipBenefitsSuccess = await membershipBenefitsService.getMebershipBenefits()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Mebership Benefits Success',
            API_RESPONSE_STATUS.SUCCESS,
            getMebershipBenefitsSuccess



        );
    }
);

const getTypeOfMembership = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const typeOfMembershipService = new TypeOfMembershipService

        const getTypeOfMembershipSuccess = await typeOfMembershipService.getTypeOfMembership()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Type Of Membership Success',
            API_RESPONSE_STATUS.SUCCESS,
            getTypeOfMembershipSuccess



        );
    }
);

const getCommitteeMemberList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const committeeMemberService = new CommitteeMemberService

        const CommitteeModelList = await committeeMemberService.getAllCommitteeMemberLists()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Committee Model List Success',
            API_RESPONSE_STATUS.SUCCESS,
            CommitteeModelList



        );
    }
);

const getServiceAndFacilityList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const serviceAndFacilityService = new ServiceAndFacilityService


        const serviceAndFacilityList = await serviceAndFacilityService.getServiceAndFacilityList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Service And Facility  List Success',
            API_RESPONSE_STATUS.SUCCESS,
            serviceAndFacilityList


        );
    }
);

const getCorporateSocialResponsibility = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const corporateSocialResponsibilityService = new CorporateSocialResponsibilityService


        const getCorporateSocialResponsibilitySuccess = await corporateSocialResponsibilityService.getCorporateSocialResponsibility()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Corporate Social Responsibility Success',
            API_RESPONSE_STATUS.SUCCESS,
            getCorporateSocialResponsibilitySuccess



        );
    }
);

const getMemberSearchPagination = asyncHandler(
    async (
        req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
        res: Response
    ) => {
        const membershipFormService = new MembershipFormService;
        const reqQuery = req.query
        const userid = req?.user_id

        const UserId = req?.params.id

        const getDigitalCardList = await membershipFormService.getPaginatedMembers(reqQuery)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Digital Card List Success',
            API_RESPONSE_STATUS.SUCCESS,
            getDigitalCardList



        );
    }
);

const getEventDetails = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const eventService = new EventService

        const userid = req?.user_id
        const eventId = req.params.id
        console.log(userid, " userid");
        console.log(eventId, " eventId");



        const photoGallery = await eventService.getEventDetails(eventId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Photo Gallery Success',
            API_RESPONSE_STATUS.SUCCESS,
            photoGallery



        );
    }
);

const getHomeBanner = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const homeBannerService = new HomeBannerService

        const userid = req?.user_id

        const foreignEmbassies = await homeBannerService.getHomeBanner()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Home Banner Photo Success',
            API_RESPONSE_STATUS.SUCCESS,
            foreignEmbassies



        );
    }
);

const getCareerOpportunityList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const adminCareerOpportunityService = new AdminCareerOpportunityService

        const careerOpportunityList = await adminCareerOpportunityService.getCareerOpportunityList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Career Oppoetunities List Success',
            API_RESPONSE_STATUS.SUCCESS,
            careerOpportunityList

        );
    }
);


export default {
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
}