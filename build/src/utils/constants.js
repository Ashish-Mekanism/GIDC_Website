"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIRCULAR_LIST_CATEGORIES = exports.DEFAULT_PASSWORD_LENGTH = exports.InitialEmailTemplates = exports.EMAIL_TEMPLATE_ALLOWED_TAGS = exports.TAGS = exports.EmailTemplateFallBackSubjectAndMessage = exports.EventsEmailKeys = exports.ServiceRequestEmailKeys = exports.InitialConfigs = exports.BaseConfigKeys = exports.UNIQUE_COUNTER_ID = exports.OLD_WORDPRESS_CONTRACTORS_MAPPER = exports.OLD_WORDPRESS_SERVICE_CATEGORIES_MAPPER = exports.DEFAULT_SERVICE_CATEGORIES = exports.JOB_STATUS = exports.JOB_POSTING_STATUS = exports.JOB_LOCATION = exports.EVENT_REGISTRATION_STATUS = exports.WEBDIRECTORY_STATUS = exports.COMPLAINT_STATUS_QUERY = exports.COMPLAINT_STATUS_NAME = exports.COMPLAINT_STATUS = exports.ACTIONS = exports.ROLE_PERMISSION = exports.EVENT_STATUS = exports.CIRCULAR_STATUS = exports.SPONSORSHIP_STATUS = exports.SPONSORSHIP_APPROVAL_STATUS = exports.REGISTRATION = exports.USER_TYPE = exports.OTHER_FEES = exports.FEE_FOR_WATER_NOC = exports.APPLICATION_TYPE = exports.YES_NO = exports.MEMBER_APPROVAL_STATUS = exports.JOB_TYPE = exports.paginationDefaultValues = exports.MEDIA_IDENTIFIER_KEY = exports.MULTER_FIELD_NAMES = exports.FOLDER_NAMES = exports.COMPANY_TYPE = exports.API_RESPONSE_STATUS = exports.ACCOUNT_STATUS = exports.dbModelMapping = exports.DbModel = exports.cryptoTokenExpiry = exports.cryptoTokenLength = exports.NODE_ENVIRONMENT = exports.RESPONSE_CODE = void 0;
const http_status_codes_1 = require("http-status-codes");
exports.RESPONSE_CODE = {
    SUCCESS: http_status_codes_1.StatusCodes.OK,
    CREATED: http_status_codes_1.StatusCodes.CREATED,
    ACCEPTED: http_status_codes_1.StatusCodes.ACCEPTED,
    NO_CONTENT: http_status_codes_1.StatusCodes.NO_CONTENT,
    MOVED_PERMANENTLY: http_status_codes_1.StatusCodes.MOVED_PERMANENTLY,
    BAD_REQUEST: http_status_codes_1.StatusCodes.BAD_REQUEST,
    UNAUTHORIZED: http_status_codes_1.StatusCodes.UNAUTHORIZED,
    FORBIDDEN: http_status_codes_1.StatusCodes.FORBIDDEN,
    NOT_FOUND: http_status_codes_1.StatusCodes.NOT_FOUND,
    METHOD_NOT_ALLOWED: http_status_codes_1.StatusCodes.METHOD_NOT_ALLOWED,
    INTERNAL_SERVER_ERROR: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
    SERVICE_UNAVAILABLE: http_status_codes_1.StatusCodes.SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT: http_status_codes_1.StatusCodes.GATEWAY_TIMEOUT,
    CONFLICT: http_status_codes_1.StatusCodes.CONFLICT,
    UNPROCESSABLE_ENTITY: http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY,
};
exports.NODE_ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    STAGING: 'staging',
};
exports.cryptoTokenLength = 20;
exports.cryptoTokenExpiry = {
    unit: 'seconds',
    duration: 120,
};
exports.DbModel = {
    User: 'User',
    BlackListToken: 'BlackListToken',
    Membership: 'Membership',
    Complaint: 'Complaint',
    GetInTouch: 'GetInTouch',
    DigitalCardGallery: 'DigitalCardGallery',
    DigitalCardSlider: 'DigitalCardSlider',
    CareerOpportunity: ' CareerOpportunity',
    WebDirectory: 'WebDirectory',
    BusinessCard: 'BusinessCard',
    NocNoDue: 'NocNoDue',
    Role: 'Role',
    ServiceCategory: 'ServiceCategory',
    Contractor: 'Contractor',
    AdminPhotoGallery: 'AdminPhotoGallery',
    AdminVideoGallery: 'AdminVideoGallery',
    Telephone: 'Telephone',
    SubTelephone: 'SubTelephone',
    Event: 'Event',
    DownloadAndCircular: 'DownloadAndCircular',
    Sponsorship: 'Sponsorship',
    Action: 'Action',
    QuickLink: 'QuickLink',
    PresidentMessage: 'PresidentMessage',
    BusinessBulletin: 'BusinessBulletin',
    AdminContactUs: 'AdminContactUs',
    Overview: 'Overview',
    About: 'About',
    OurVision: 'OurVision',
    OurMission: 'OurMission',
    MaximizingVisibility: 'MaximizingVisibility',
    Industries: 'Industries',
    ServiceAndFacility: 'ServiceAndFacility',
    CorporateSocialResponsibility: 'CorporateSocialResponsibility',
    Committee: 'Committee',
    CommitteeMember: 'CommitteeMember',
    MembershipBenefits: ' MembershipBenefits',
    RequiredDocuments: 'RequiredDocuments',
    TypeOfMembership: ' TypeOfMembership',
    ForeignEmbassies: 'ForeignEmbassies',
    BookEvent: 'BookEvent',
    HomeBanner: 'HomeBanner',
    ApplyJob: 'ApplyJob',
    Config: 'Config',
    EmailTemplate: 'EmailTemplate',
    AboutUsSchema: 'AboutUsSchema',
};
exports.dbModelMapping = {
    User: 'users',
};
exports.ACCOUNT_STATUS = {
    // DELETED: 0,
    ACTIVE: 1,
    DEACTIVATED: 0,
};
exports.API_RESPONSE_STATUS = {
    SUCCESS: true,
    FAIL: false,
};
exports.COMPANY_TYPE = {
    PROPRIETOR: 'Proprietor',
    PARTNERSHIP: 'Partnership',
    PVT_LTD: 'Pvt. Ltd.',
    LTD: 'Ltd.',
    OTHER: 'Other',
};
exports.FOLDER_NAMES = {
    UPLOADS: 'uploads',
    USERS: 'users',
    COMPLAINT: 'complaint',
    WEBDIRECTORY: 'webDirectory',
    BUSINESSCARD: 'businessCard',
    DIGITALCARDGALLERY: 'digitalCardGallery',
    DIGITALCARDSLIDER: 'digitalCardSlider',
    NOC: 'noc',
    ADMINPHOTOGALLERY: 'adminPhotoGallery',
    ADMINVIDEOGALERY: 'adminVideoGallery',
    TELEPHONEPHOTO: 'telephone',
    EVENT: 'event',
    CIRCULAR: 'circular',
    SPONSORSHIP: 'sponsorship',
    QUICKLINKICON: 'quickLinkIcon',
    PRESIDENTPHOTO: 'presidentPhoto',
    BUSINESSBULLETIN: 'businessBulletin',
    INDUSTRIES: 'industries',
    SERVICEANDFACILITY: 'ServiceAndFacility',
    COMMITTEEMEMBER: 'CommitteeMember',
    FOREIGNEMBASSIES: 'foreignEmbassies',
    HOMEBANNER: 'homeBanner',
    BOOKINGTRANSACTION: 'bookingTransaction',
    MEMBERSHIPRECEIPT: 'membershipReceipt',
    RESUME: 'resume',
    OVERVIEW: 'overview',
};
exports.MULTER_FIELD_NAMES = {
    USER: {
        REP_1_PHOTO: 'representativeDetails[0][photo]',
        REP_2_PHOTO: 'representativeDetails[1][photo]',
        ATT_AL: 'attachments.allotmentLetter',
        ATT_PL: 'attachments.possessionLetter',
        ATT_OO: 'attachments.officeOrder',
        ATT_TO: 'attachments.transferOrder',
        OTHER_DOC_1: 'otherDocuments[0][file]',
        OTHER_DOC_2: 'otherDocuments[1][file]',
        OTHER_DOC_3: 'otherDocuments[2][file]',
        CHEQUE: 'chequeDetails.chequePhoto1',
    },
    COMPLAINT: {
        PHOTO: 'complaint_photo',
    },
    WEBDIRECTORY: {
        COMPANY_LOGO: 'companyLogo',
        PRODUCT_PHOTO: 'productImage',
    },
    BUSINESSCARD: {
        PROFILE: 'profilePhoto',
        DIGITALGALLERY: 'digitalGalleryPhotos',
        DIGITALSLIDER: 'digitalSliderPhotos',
    },
    NOC: {
        ATT_APPLICATION_LETTER: 'attachments[applicationLetter]',
        ATT_WATERBILL: 'attachments[waterBill]',
        ATT_LIGHTBILL: 'attachments[lightBill]',
        ATT_TAXBILL: 'attachments[taxBill]',
        ATT_OTHER_DOC: 'attachments[otherDocumentImage]',
        CHEQUE_PHOTO: 'chequeDetails.chequePhoto',
    },
    ADMIN: {
        PHOTOGALLERY: 'Photos',
        VIDEOGALLERY: 'Videos',
        VIDEOGALLERY_THUMBNAIL: 'Poster',
        TELEPHONE_LIST_PHOTO: 'Photo',
        EVENT: 'Photo',
        QRCODE: 'QRCodePhoto',
        CIRCULAR: 'Document',
        QUICKLINK: 'Icon',
        PRESIDENT: 'Photo',
        BUSINESS_BULLETIN: 'Photo',
        INDUSTRIES: 'IndustryPhoto',
        SERVICEANDFACILITY: 'Photo',
        COMMITTEEMEMBER: 'Photo',
        FOREIGNEMBASSIES: 'Photos',
        HOMEBANNER: 'Photos',
        RECEIPT_PHOTO: 'receiptPhoto',
    },
    SPONSORSHIP: {
        PHOTO: 'Photo',
    },
    BOOKINGTRANSACTION: {
        PHOTO: 'transactionPhoto',
    },
    APPLY_JOB: {
        RESUME: 'resume',
    },
    OVERVIEW: {
        IMAGE: 'overviewImage',
    },
    CORPORATE_SOCIAL_RESPONSIBILITY: {
        IMAGE: 'corpoImage',
    },
};
exports.MEDIA_IDENTIFIER_KEY = {
    ADMIN: {
        PHOTOGALLERY: 'photoGallery',
        VIDEOGALLERY: 'videoGallery',
        VIDEOGALLERY_THUMBNAIL: 'videoThumbnail',
        TELEPHONE_LIST_PHOTO: 'telephonePhoto',
        EVENT: 'event',
        QRCODE: 'QRCode',
        CIRCULAR: 'Doc',
        QUICKLINK: 'Icon',
        PRESIDENT: 'Photo',
        BUSINESS_BULLETIN: 'Photo',
        INDUSTRIES: 'Photo',
        SERVICEANDFACILITY: 'Photo',
        COMMITTEEMEMBER: 'Photo',
        FOREIGNEMBASSIES: 'Photo',
        HOMEBANNER: 'Photo',
        RECEIPT_PHOTO: 'receiptPhoto',
    },
    USER: {
        REP1: 'rep1',
        REP2: 'rep2',
        ATT_AL: 'att_al',
        ATT_PL: 'att_pl',
        ATT_OO: 'att_oo',
        ATT_TO: 'att_to',
        OTHER_DOC_1: 'otherDoc1',
        OTHER_DOC_2: 'otherDoc2',
        OTHER_DOC_3: 'otherDoc3',
        CHEQUE: 'chequePhoto',
    },
    COMPLAINT: {
        PHOTO: 'complaint',
    },
    WEBDIRECTORY: {
        COMPANY_LOGO: 'company_logo',
        PRODUCT_PHOTO: 'product_photo',
    },
    BUSINESSCARD: {
        PROFILE: 'profile',
        DIGITALGALLERY: 'digiGallery',
        DIGITALSLIDER: 'digitalSlider',
    },
    NOC: {
        ATT_APPLICATION_LETTER: 'att_appLetter',
        ATT_WATERBILL: 'att_waterBill',
        ATT_LIGHTBILL: 'att_lightBill',
        ATT_TAXBILL: 'att_taxBill',
        ATT_OTHER_DOC: 'att_otherDoc',
        CHEQUE_PHOTO: 'chequePhoto',
    },
    SPONSORSHIP: {
        PHOTO: 'Photo',
    },
    BOOKINGTRANSACTION: {
        PHOTO: 'transactionPhoto',
    },
    APPLY_JOB: {
        RESUME: 'resume',
    },
    ABOUTUS: {
        OVERVIEWIMAGE: 'overviewImage',
        CORPOIMAGE: 'corpoImage',
    },
    // CORPORATE_SOCIAL_RESPONSIBILITY:{
    //   IMAGE: 'corpoImage',
    // },
};
exports.paginationDefaultValues = {
    page: 1,
    perPage: 10,
    sortBy: 'createdAt',
    sortOrder: -1,
};
exports.JOB_TYPE = {
    FULLTIME: 'Full-time',
    PARTTIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    OTHER: 'Other',
};
exports.MEMBER_APPROVAL_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    DECLINED: 2,
};
exports.YES_NO = {
    YES: 'Yes',
    NO: 'No',
};
exports.APPLICATION_TYPE = {
    NOC_WATER: 'N.O.C. Water',
    PERMISSION: '2(R) Permission',
    GIDC_TRANSFER: 'G.I.D.C. Name Transfer',
    LEASE_DEED: 'Lease Deed',
    CONVIENCE_DEED: 'Convience Deed',
    OTHER: 'Other',
};
exports.FEE_FOR_WATER_NOC = {
    MEMBER_FEE: '500',
    NON_MEMBER_FEE: '1000',
};
exports.OTHER_FEES = {
    MEMBER_FEE: '1000',
    NON_MEMBER_FEE: '2000',
};
exports.USER_TYPE = {
    SUPER_ADMIN: 1,
    SUB_ADMIN: 2,
    USER: 3,
};
exports.REGISTRATION = {
    PAID: 'PAID',
    FREE: 'FREE',
};
exports.SPONSORSHIP_APPROVAL_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    DECLINED: 2,
};
exports.SPONSORSHIP_STATUS = {
    // DELETED: 0,
    ACTIVE: true,
    INACTIVE: false,
};
exports.CIRCULAR_STATUS = {
    // DELETED: 0,
    ACTIVE: true,
    INACTIVE: false,
};
exports.EVENT_STATUS = {
    // DELETED: 0,
    ACTIVE: true,
    INACTIVE: false,
};
exports.ROLE_PERMISSION = {
    // CMS: 'CMS',
    // GALLERY: 'GALLERY',
    COMPLAINT: 'COMPLAINT',
    WEB_DIRECTORY: 'WEB_DIRECTORY',
    EVENT: 'EVENT',
    SPONSORSHIP_REQUEST: 'SPONSORSHIP_REQUEST',
    SPONSORSHIP_LIST: 'SPONSORSHIP_LIST',
    TELEPHONE: 'TELEPHONE',
    USERS: 'USERS',
    MEMBER_REQUEST: 'MEMBER_REQUEST',
    MEMBER_FORM: 'MEMBER_FORM',
    MEMBER_LIST: 'MEMBER_LIST',
    NOC_NO_DUE: 'NOC_NO_DUE',
    CATEGORY: 'CATEGORY',
    CONTRACTORS: 'CONTRACTORS',
    DOWNLOAD_CIRCULAR: 'DOWNLOAD_CIRCULAR',
    E_CARD_MANAGEMENT: 'E_CARD_MANAGEMENT',
    PHOTO_GALLERY: 'PHOTO_GALLERY',
    VIDEO_GALLERY: 'VIDEO_GALLERY',
    COMPLAINT_LIST: 'COMPLAINT_LIST',
    COMPLAINT_COMPLETED: 'COMPLAINT_COMPLETED',
    CONTACT_US: 'CONTACT_US',
    CAREER_OPPORTUNITIES: 'CAREER_OPPORTUNITIES',
    SEEKERS: 'SEEKERS',
    CMS_HOME_PAGE: 'CMS_HOME_PAGE',
    CMS_ABOUT_PAGE: 'CMS_ABOUT_PAGE',
    CMS_CONTACT_PAGE: 'CMS_CONTACT_PAGE',
    CMS_MEMBERSHIP_PAGE: 'CMS_MEMBERSHIP_PAGE',
    CMS_DOWNLOAD_PAGE: 'CMS_DOWNLOAD_PAGE',
};
exports.ACTIONS = {
    ADD: 'ADD',
    VIEW: 'VIEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    PRINT: 'PRINT',
    APPROVE_DECLINE: 'APPROVE_DECLINE',
    ACTIVE_INACTIVE: 'ACTIVE_INACTIVE',
    SEND_EMAIL: 'SEND_EMAIL',
    EXPORT: 'EXPORT',
};
exports.COMPLAINT_STATUS = {
    PENDING: 0,
    ASSIGN: 1,
    COMPLETED: 2,
    DELETED: 3,
};
exports.COMPLAINT_STATUS_NAME = {
    [exports.COMPLAINT_STATUS.PENDING]: 'PENDING',
    [exports.COMPLAINT_STATUS.ASSIGN]: 'ASSIGN',
    [exports.COMPLAINT_STATUS.COMPLETED]: 'COMPLETED',
    [exports.COMPLAINT_STATUS.DELETED]: 'DELETED',
};
exports.COMPLAINT_STATUS_QUERY = {
    PENDING_ASSIGNED: 1,
    COMPLETED: 2,
};
exports.WEBDIRECTORY_STATUS = {
    ACTIVE: true,
    INACTIVE: false,
};
exports.EVENT_REGISTRATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    DECLINED: 'declined',
};
exports.JOB_LOCATION = {
    ONSITE: 'Onsite',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
};
exports.JOB_POSTING_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    DECLINED: 2,
};
exports.JOB_STATUS = {
    // DELETED: 0,
    ACTIVE: true,
    INACTIVE: false,
};
exports.DEFAULT_SERVICE_CATEGORIES = [
    {
        name: 'Cleaning',
        key: 'cleaning_service',
        isSystem: true,
    },
    {
        name: 'Drainage',
        key: 'draining_service',
        isSystem: true,
    },
    {
        name: 'Water Supply',
        key: 'water_supply',
        isSystem: true,
    },
    {
        name: 'Street Light',
        key: 'street_light',
        isSystem: true,
    },
    {
        name: 'ROAD AND BUILDING',
        key: 'road_and_building',
        isSystem: false,
    },
    {
        name: 'Water Meter (Water Supply)',
        key: 'water_meter',
        isSystem: false,
    },
    {
        name: 'Others',
        key: 'others',
        isSystem: false,
    },
];
// sql id and name
exports.OLD_WORDPRESS_SERVICE_CATEGORIES_MAPPER = {
    '11': 'Water Supply',
    '10': 'Others',
    '3': 'Cleaning',
    '4': 'Street Light',
    '9': 'Drainage',
    '13': 'ROAD AND BUILDING',
    '14': 'Water Meter (Water Supply)',
};
exports.OLD_WORDPRESS_CONTRACTORS_MAPPER = {
    '27': 'Hirenbhai Jadav',
    '26': 'Prafulbhai',
    '20': 'Dharam Electrical',
    '24': 'Bhavesh Patel',
    '21': 'SELF',
    '22': 'Jivanbhai Makwana',
    '23': 'Dhulabhai Vaghela (Rajubhai)',
    '25': 'Harshad Parmar',
    '28': 'MOHANBHAI BHAVSAR',
};
exports.UNIQUE_COUNTER_ID = {
    COMPLAINT_SEQUENCE_NUMBER: 'complaint_service_number',
};
exports.BaseConfigKeys = {
    EMAIL_CONFIG: 'email_config',
    SEND_GRID_CONFIG: 'send_grid_config',
};
exports.InitialConfigs = [
    {
        key: exports.BaseConfigKeys.EMAIL_CONFIG,
        value: {
            host: '',
            port: '',
            secure: false,
            authUser: '',
            authPassword: '',
            fromName: '',
            fromEmail: '',
            tls_rejectUnauthorized: false,
        },
    },
    {
        key: exports.BaseConfigKeys.SEND_GRID_CONFIG,
        value: {
            api_key: '',
        },
    },
];
exports.ServiceRequestEmailKeys = {
    /// SEND TO USER ADMIN AND CONTRACTORS TO THAT SERVICE CATEGORY
    SERVICE_REQUEST_RECEIVED_USER: 'service_request_received_user', // to all the contractors who have that service category and user
    SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR: 'service_request_received_admin_contractor',
    SERVICE_REQUEST_ASSIGNED_USER: 'service_request_assigned_user',
    SERVICE_REQUEST_ASSIGNED_CONTRACTOR: 'service_request_assigned_contractor',
    SERVICE_REQUEST_FINISHED: 'service_request_finished',
};
exports.EventsEmailKeys = {
    EVENT_REQUEST_APPROVED: 'event_request_approved',
    EVENT_REQUEST_DECLINED: 'event_request_declined',
    EVENT_REQUEST_RECEIVED_USER: 'event_request_received_user',
    EVENT_REQUEST_RECEIVED_ADMIN: 'event_request_received_admin',
};
exports.EmailTemplateFallBackSubjectAndMessage = {
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER]: {
        subject: 'Your Service Request Has Been Assigned',
        message: 'We’re pleased to let you know that your service request has been assigned to one of our team members. They’ll be reaching out shortly to begin the process.',
    },
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR]: {
        subject: 'You have been assigned for the service request',
        message: '',
    },
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER]: {
        subject: 'Your Service Request Has Been Received',
        message: 'Thanks for submitting your service request. We’ve received it and our team is currently reviewing the details. You’ll get updates from us soon.',
    },
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR]: {
        subject: 'A New Service Request Has Been Submitted',
        message: 'A user has submitted a new service request. Please review the request and assign it to an appropriate team member.',
    },
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED]: {
        subject: 'Your Service Request Is Complete',
        message: 'Great news! Your service request has been successfully completed. If you have any feedback or need further assistance, feel free to reach out.',
    },
    [exports.EventsEmailKeys.EVENT_REQUEST_APPROVED]: {
        subject: 'Your event request has been approved 🎉',
        message: 'Hey there! Good news — your event request has been approved. Stay tuned for more details!',
    },
    [exports.EventsEmailKeys.EVENT_REQUEST_DECLINED]: {
        subject: 'Your event request was declined ❌',
        message: 'Sorry, your event request didn’t make the cut this time. Feel free to try again or contact support.',
    },
    [exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_ADMIN]: {
        subject: 'New event request received 📩',
        message: 'Heads up! A new event request just came in. Please review and take action.',
    },
    [exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_USER]: {
        subject: 'We got your event request 🙌',
        message: 'Thanks for submitting your event request. We’ll review it and get back to you soon!',
    },
};
exports.TAGS = {
    COMPLAINT: [
        {
            value: '{{ComplaintMembershipNo}}',
            field: 'membershipNo',
            label: 'Membership Number',
        },
        {
            value: '{{ComplaintEmail}}',
            field: 'email',
            label: 'Email Address',
        },
        {
            value: '{{ComplaintMobile}}',
            field: 'mobile',
            label: 'Mobile Number',
        },
        {
            value: '{{ComplaintPhone}}',
            field: 'phone',
            label: 'Phone Number',
        },
        {
            value: '{{ComplaintCompanyName}}',
            field: 'companyName',
            label: 'Company Name',
        },
        {
            value: '{{ComplaintPersonName}}',
            field: 'personName',
            label: 'Person Name',
        },
        {
            value: '{{ComplaintRoadNo}}',
            field: 'roadNo',
            label: 'Road Number',
        },
        {
            value: '{{ComplaintAddress}}',
            field: 'address',
            label: 'Address',
        },
        {
            value: '{{ComplaintServiceDetails}}',
            field: 'serviceDetails',
            label: 'Service Details',
        },
        {
            value: '{{ComplaintServiceNumber}}',
            field: 'serviceNumber',
            label: 'Service Number',
        },
        {
            value: '{{ComplaintServiceCategoryName}}',
            field: 'ServiceCategoryName',
            label: 'Service Category Name',
        },
        {
            value: '{{waterConnectionNo}}',
            field: 'waterConnectionNo',
            label: 'Water Connection Number',
        },
        {
            value: '{{ComplaintCreatedAt}}',
            field: 'createdAt',
            label: 'Created At',
        },
    ],
    USER: [
        {
            value: '{{UserEmail}}',
            field: 'email',
            label: 'User Email',
        },
    ],
    CONTRACTOR: [
        {
            value: '{{ContractorEmail}}',
            field: 'ContractorEmail',
            label: 'Contractor Email',
        },
        {
            value: '{{ContractorName}}',
            field: 'ContractorName',
            label: 'Contractor Name',
        },
    ],
    EVENT: [
        {
            value: '{{EventTitle}}',
            field: 'EventTitle',
            label: 'Event Title',
        },
        {
            value: '{{EventId}}',
            field: '_id',
            label: 'Event Id',
        },
        // {
        //   value: '{{EventDescription}}',
        //   field: 'Description',
        //   label: 'Event Description',
        // },
        {
            value: '{{EventDate}}',
            field: 'Date',
            label: 'Event Date',
        },
        {
            value: '{{EventStartTime}}',
            field: 'StartTime',
            label: 'Start Time',
        },
        {
            value: '{{EventEndTime}}',
            field: 'EndTime',
            label: 'End Time',
        },
        {
            value: '{{EventType}}',
            field: 'Registration',
            label: 'Registration Type',
        },
        {
            value: '{{EventSpeaker}}',
            field: 'Speaker',
            label: 'Event Speaker',
        },
        {
            value: '{{EventCapacity}}',
            field: 'Capacity',
            label: 'Event Capacity',
        },
        {
            value: '{{EventFee}}',
            field: 'Fee',
            label: 'Event Fee',
        },
        {
            value: '{{EventLocationName}}',
            field: 'Location.LocationName',
            label: 'Location Name',
        },
        {
            value: '{{EventLocationAddress}}',
            field: 'Location.Address',
            label: 'Location Address',
        },
        // {
        //   value: '{{EventLocationCity}}',
        //   field: 'Location.City',
        //   label: 'Location City',
        // },
        // {
        //   value: '{{EventLocationState}}',
        //   field: 'Location.State',
        //   label: 'Location State',
        // },
        {
            value: '{{EventLocationPostcode}}',
            field: 'Location.PostCode',
            label: 'Location Postcode',
        },
        {
            value: '{{EventLocationCountry}}',
            field: 'Location.Country',
            label: 'Location Country',
        },
    ],
    USER_BOOKING: [
        {
            value: '{{UserBookingEventDate}}',
            field: 'eventDate',
            label: 'Event Date',
        },
        {
            value: '{{UserBookingUserName}}',
            field: 'name',
            label: 'User Name',
        },
        {
            value: '{{UserBookingUserEmail}}',
            field: 'email',
            label: 'User Email',
        },
        {
            value: '{{UserBookingUserPhone}}',
            field: 'phone',
            label: 'User Phone',
        },
        {
            value: '{{UserBookingUserCompanyName}}',
            field: 'companyName',
            label: 'Company Name',
        },
        {
            value: '{{UserBookingUserPersonCount}}',
            field: 'personCount',
            label: 'Number of Attendees',
        },
        {
            value: '{{UserBookingComment}}',
            field: 'comment',
            label: 'User Comment',
        },
        {
            value: '{{UserBookingTransactionId}}',
            field: 'transactionId',
            label: 'Transaction ID',
        },
        // {
        //   value: '{{UserBookingTransactionPhoto}}',
        //   field: 'transactionPhoto',
        //   label: 'Transaction Photo URL',
        // },
        // {
        //   value: '{{UserBookingStatus}}',
        //   field: 'status',
        //   label: 'Booking Status',
        // },
    ],
};
exports.EMAIL_TEMPLATE_ALLOWED_TAGS = {
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER]: [
        ...exports.TAGS.COMPLAINT,
        ...exports.TAGS.USER,
    ],
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR]: [
        ...exports.TAGS.COMPLAINT,
        ...exports.TAGS.USER,
        ...exports.TAGS.CONTRACTOR,
    ],
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED]: [
        ...exports.TAGS.COMPLAINT,
        ...exports.TAGS.USER,
    ],
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR]: [
        ...exports.TAGS.COMPLAINT,
        ...exports.TAGS.USER,
    ],
    [exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER]: [
        ...exports.TAGS.COMPLAINT,
        ...exports.TAGS.USER,
    ],
    [exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_USER]: [
        ...exports.TAGS.USER_BOOKING,
        ...exports.TAGS.EVENT,
    ],
    [exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_ADMIN]: [
        ...exports.TAGS.USER_BOOKING,
        ...exports.TAGS.EVENT,
    ],
    [exports.EventsEmailKeys.EVENT_REQUEST_APPROVED]: [
        ...exports.TAGS.USER_BOOKING,
        ...exports.TAGS.EVENT,
    ],
    [exports.EventsEmailKeys.EVENT_REQUEST_DECLINED]: [
        ...exports.TAGS.USER_BOOKING,
        ...exports.TAGS.EVENT,
    ],
};
exports.InitialEmailTemplates = [
    /// SERVICE REQUEST
    {
        key: exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR,
        subject: '',
        message: '',
        emailTo: [],
    },
    {
        key: exports.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_USER,
        subject: '',
        message: '',
    },
    {
        key: exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER,
        subject: '',
        message: '',
    },
    {
        key: exports.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR,
        subject: '',
        message: '',
    },
    {
        key: exports.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED,
        subject: '',
        message: '',
    },
    //// EVENT REQUEST
    {
        key: exports.EventsEmailKeys.EVENT_REQUEST_APPROVED,
        subject: '',
        message: '',
    },
    {
        key: exports.EventsEmailKeys.EVENT_REQUEST_DECLINED,
        subject: '',
        message: '',
    },
    {
        key: exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_ADMIN,
        subject: '',
        message: '',
        emailTo: [],
    },
    {
        key: exports.EventsEmailKeys.EVENT_REQUEST_RECEIVED_USER,
        subject: '',
        message: '',
    },
];
exports.DEFAULT_PASSWORD_LENGTH = 6;
exports.CIRCULAR_LIST_CATEGORIES = {
    CIRCULARS: 'circulars',
    OIA_FORM: 'oia-form',
    DOWNLOADS: 'downloads',
    OTHERS: 'others',
};
