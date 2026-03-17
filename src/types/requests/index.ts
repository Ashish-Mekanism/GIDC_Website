import { ObjectId } from 'mongoose';
import { ParsedQs } from 'qs';
import { ACTIONS, ROLE_PERMISSION } from '../../utils/constants';
export interface IRegisterUserBody {
  user_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  user_type: number;
}

export interface IRegisterUserByAdminBody {
  email: string;
  password: string;
  confirmPassword: string;
  user_type: number;
  roleName: IRoleAssignment[];
  user_name?: string;
}

export interface IUpdateSubAdminOrUserBody {
  password: string;
  //user_type:number;
  roleName: IRoleAssignment[];
}

// export interface IRole   {
//   role_Name?: string ;

// }

export interface IRoleAssignment {
  role_Name: keyof typeof ROLE_PERMISSION; // Restrict values to defined roles
  actions: (keyof typeof ACTIONS)[]; // Restrict actions to predefined ones
}

export interface IEmailVerifyBody {
  token: string;
  id: string;
}

export interface ILoginUserBody {
  user_name: string;
  //email: string;
  password: string;
}

export interface IResetPasswordRequestBody {
  email: string;
  user_name: string;
}
export interface IResetPasswordBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IBecomeAMemberBody {
  // userId:ObjectId|string;
  createdBy?: ObjectId;
  membership_Id: string;
  memberCompanyName: string;
  plotShedNo: string;
  roadNo: string;
  companyType: String;
  email: string;
  phone: string;
  mobile: string;
  representativeDetails: IRepresentative[];
  website: string;
  productName: string;
  companyCategory: string;
  gstNo: string;
  amcTenementNo: string;
  udyogAadharNo: string;
  torrentServiceNo: string;
  attachments: IAttachment;
  otherDocuments: IOtherDocument[];
  propertyDetails: IPropertyDetails[];
  // plotShedSize: IPlotShedSize;
  chequeDetails: IChequeDetails;
  receipt?: string;
  receiptPhoto?: string;
  user_name?: string;
}

export interface IChequeDetails {
  bankName: string;
  branchName: string;
  chequeNo: string;
  chequeDate: Date;
  chequeAmountNumber: number;
  chequeAmountWords: string;
  chequePhoto: string;
}
interface IPropertyDetails {
  plotShedSize: { type: String };
  waterConnectionNo: { type: String };
  connectionSizeMM: { type: String };
  areaSizeSqMtrs: { type: String };
}
export interface IRepresentative {
  name?: string;
  designation?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  photo?: string; // Optional
}

export interface IAttachment {
  allotmentLetter?: string;
  possessionLetter?: string;
  officeOrder?: string;
  transferOrder?: string;
}
export interface IOtherDocument {
  name: string;
  file?: string;
}

export interface IComplaintBody {
  membershipNo?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  photo?: string;
  companyName?: string;
  personName?: string;
  roadNo?: string;
  address?: string;
  serviceCategory?: ObjectId;
  serviceDetails?: string;
  waterConnectionNo?: string;
}

export interface IGetInTouchBody {
  name: string;
  phone: number;
  message: string;
  createdAt?: Date;
}

export interface IWebDirectoryBody {
  companyName: string;
  companyLogo?: string;
  personalPhone: Number;
  companyPhone: Number;
  personalEmail: string;
  companyEmail: string;
  companyProfile: string;
  productDetails: string;
  product: IProduct[];
  location: ILocation[];
  membershipNo: string;
}

interface ILocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
export interface IProduct {
  // _id?:ObjectId
  productName?: string;
  productImage?: string;
}

export interface IUpdateWebDirectoryBody {
  companyName: string;
  companyLogo?: string;
  personalPhone: Number;
  companyPhone: Number;
  personalEmail: string;
  companyEmail: string;
  companyProfile: string;
  productDetails: string;
  product: IProduct[];
  location: ILocation[];
  productIdToDelete?: string[];
  membershipNo: string;
}

export interface IBusinessCardBody {
  userId: ObjectId;
  name: string;
  organisation: string;
  websiteUrl: string;
  jobTitle: string;
  phone: string;
  officePhone: string;
  whatsappNo: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  socialMedia: ISocialMedia[];
  aboutProfile: string;
  profilePhoto?: string;
  active: Boolean;
}

interface ISocialMedia {
  facebookUrl?: string;
  twitterUrl?: string;
  googleUrl?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
  youtubeUrl?: string;
  pinterestUrl?: string;
  mapUrl?: string;
}

export interface IActiveInactiveBusinessCard {
  active?: boolean;
}
export interface IPaginationQuery extends ParsedQs {
  page?: string;
  perPage?: string;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: string | undefined;
}
export interface IDigitalCardGalleryBody {
  galleryName: string;
  digitalGalleryPhotos: string;
}

export interface IUpdateDigitalCardGalleryBody {
  galleryName?: string;
  digitalGalleryPhotos?: string;
  deleteGalleryPhotosId?: string;
  digitalCardGalleryId: string;
}

export interface IDigitalCardSliderBody {
  digitalSliderPhotos?: string;
}

export interface IUpdateSliderGalleryBody {
  digitalSliderPhotos?: string;
  deleteSliderPhotosId?: string;
  digitalCardSliderId: string;
}

export interface ICareerOpportunityBody {
  jobTitle: string;
  jobType: string;
  jobDescription: string;
  jobLocation: string;
  companyAddress: string;
  applicationDeadline: Date;
  associationName: string;
  email: string;
  jobIndustry: string;
  requiredExperience: string;
  requiredPerson: string;
}

export interface IUpdateCareerOpportunityBody {
  applicationDeadline: Date;
}

export interface IDeleteCareerOpportunityBody {
  careerOpportunityId: string;
}

export interface IActiveInactiveMember {
  userId: string;
  action: number;
}

export interface IMemberApprovalBody {
  userId: string;
  action: number;
  receipt?: string;
  receiptPhoto?: string;
}

export interface INocAttachment {
  applicationLetter?: string;
  waterBill?: string;
  lightBill?: string;
  taxBill?: string;
  otherDocumentImage?: string;
  otherDocumentName?: string;
  gidc?: {
    gidcLetterRefNo?: string;
    gidcDate?: Date;
  };
  torrent?: {
    torrentServiceNo?: string;
    torrentNo?: string;
    torrentDate?: Date;
    torrentName?: string;
  };
  amcTaxBill?: {
    amcTaxTenamentNo?: string;
    amcTaxYear?: string;
    amcTaxPaidAmount?: string;
    amcTaxName: string;
  };
  water?: {
    waterConnectionNo?: string;
    waterBillNo?: string;
    waterBillDate?: Date;
    waterConsumptionPeriod?: string;
    waterBillName: string;
  };
  
  //otherDocuments?: { documentName: string; documentImage: string }[];
}

// Define the NOC Form interface
export interface INocFormBody {
  industryName: string;
  industryAddress: string;
  email: string;
  industryType: string;
  telephoneNo: string;
  membershipNo?: string;
  isMember: string;
  isContributionFiled: string;
  year: number;
  receiptNo: string;
  applicationType: [string];
  feeForWaterNoc: string;
  feeForOther: string;
  attachments: INocAttachment;
  chequeDetails: IChequeDetails;
  userContribution: IUserContribution;
  plotNo: string;
  gstNo: string;
  roadNo: string;
  publishDate: Date;
  isExported: boolean;
  user_name?: string;
}

// export interface IUpdateNocFormBody {
//   userContribution: IUserContribution;
// }

export interface IUpdateNocFormBody {
  industryName: string;
  industryAddress: string;
  email: string;
  industryType: string;
  telephoneNo: string;
  membershipNo?: string;
  isMember: string;
  isContributionFiled: string;
  year: number;
  receiptNo: string;
  applicationType: [string];
  feeForWaterNoc: string;
  feeForOther: string;
  attachments: INocAttachment;
  chequeDetails: IChequeDetails;
  userContribution: IUserContribution;
  plotNo: string;
  gstNo: string;
  roadNo: string;
  publishDate: Date;
  isExported: boolean;
  user_name?: string;

}
export interface IAddNocFormUserContributionBody {
  userContribution: IUserContribution;
}

export interface IUserContribution {
  name: string;
  plotNo: string;
  bank: string;
  chequeDate: string;
  chequeNo: string;
  chequeAmount: string;
}
export interface IServiceCategoryBody {
  ServiceCategoryName: string;
  active: boolean;
}

export interface IContractorBody {
  ServiceIds?: ObjectId | ObjectId[];
  ContractorName: string;
  ContractorEmail: string;
  active: boolean;
}

export interface IAdminPhotoGalleryBody {
  Heading: string;
  SeminarBy: string;
  Date: Date;
  Photos: string;
}

export interface IAdminVideoGalleryBody {
  Heading: string;
  Date: Date;
  Videos: string;
  Poster: string;
}
export interface IUpdateAdminPhotoGalleryBody {
  Heading: string;
  SeminarBy: string;
  Date: Date;
  Photos: string;
  deleteGalleryPhotosId?: string;
}

export interface IUpdateAdminVideoGalleryBody {
  Heading: string;
  Date: Date;
  Videos: string;
  deleteGalleryVideoId?: string;
  Poster: string;
}

export interface ITelephoneBody {
  Title: string;
}

export interface ISubTelephoneBody {
  Name?: string;
  Address?: string;
  Contact1?: number;
  Contact2?: number;
  Photo: string;
  TelephoneModelId?: string | ObjectId | undefined;
}

export interface IEventBody {
  EventTitle: string;
  Photo: string;
  Description: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  Registration: string;
  Speaker: string;
  Fee: number;
  Capacity: number;
  Location: IEventLocation[];
  UpiId: string;
  IsQrCode: string;
  IsUpi: string;
  QRCodePhoto?: string | null;
}

interface IEventLocation {
  LocationName: string;
  Address: string;
  City: string;
  State: string;
  PostCode: string;
  Country: string;
}

export interface IDownloadAndCircularBody {
  Heading: string;
  Description: string;
  Document?: string;
  Date: Date;
  Category?: string;
}
export interface IActiveInactiveCircular {
  downlaodAndCircularId: string;
  action: boolean;
}

export interface ISponsorshipBody {
  Name: string;
  Email: string;
  Phone: number;
  Note: string;
  Photo: string;
  StartDate: Date;
  EndDate: Date;
  Amount?: number;
  Url?: string;
}
export interface IActiveInactiveSponsorship {
  sponsorshipId: string;
  action: boolean;
}
export interface IActiveInactiveWebDirectory {
  webDirectoryId: string;
  action: boolean;
}

export interface ISponsorshipApprovalBody {
  sponsorshipId: string;
  action: number;
  amount: number;
}

export interface IAssignContractor {
  contractor: string;
}

export interface IComplaintStatusBody {
  status: string;
  complaintId: string;
}

// export interface IAdminGalleryPhotos {
//   fileName: string;
// }

export interface IQuickLinkBody {
  Icon: string;
  Title: string;
  Links: ILink[];
}

interface ILink {
  _id?: string | ObjectId;
  title: string;
  url: string;
}

export interface IPresidentMessageBody {
  Photo: string;
  Title: string;
  Sub_Title: string;
  Description: string;
}
export interface IBusinessBulletinBody {
  Photo: string;
  Title: string;
}
export interface IAdminContactUsBody {
  Address: string;
  PhoneNumber: string;
  Email: string;
  Linkedin: string;
  Facebook: string;
  Twitter: string;
}

export interface IAboutBody {
  Paragraph1: string;
  Paragraph2: string;
  Paragraph3: string;
}
export interface IOverviewBody {
  NoOfIndustriesInOdhav: number;
  NoOfMembers: number;
  AreaOfIndustrialEstate: number;
}

export interface IOurVisionBody {
  VisionDescription: string;
  Vision: string[];
}

export interface IOurMissionBody {
  MissionDescription: string;
  Mission: string[];
}
export interface IMaximizingVisibilityBody {
  maximizingVisibility?: string[] | undefined;
}

export interface IIndustriesBody {
  Photo: string;
  IndustriesName: string;
}
export interface IServiceAndFacilityBody {
  Photo: string;
  ServiceName: string;
  ServiceDescription: string;
}

export interface ICorporateSocialResponsibilityBody {
  CorporateSocialResponsibility1: string[];
  CorporateSocialResponsibility2: string[];
}

export interface ICommitteeBody {
  CommitteeName: string;
}

export interface ICommitteeMemberBody {
  Name?: string;
  Designation?: string;
  Photo: string;
  CommitteeModelId?: string | ObjectId | undefined;
}

export interface IMembershipBenefitsBody {
  MembershipBenefitDescription: string;
  MembershipBenefitDescription2?: string;
  MembershipBenefitDescription3?: string;
  MebershipBenefitsPoints: string[];
}

export interface IRequiredDocumentsBody {
  requiredDocuments?: string[] | undefined;
}

export interface ITypeOfMembershipBody {
  Title: string;
  Description1: string;
  Description2: string;
  MembershipPoints: string[];
}

export interface IForeignEmbassiesBody {
  Photos: string;
}

export interface IUpdateForeignEmbassiesBody {
  Photos: string;
  DeleteForeignEmbassiesPhotoId?: string;
}

export interface IHomeBannerBody {
  Photos: string;
}

export interface IUpdateHomeBannerBody {
  Photos: string;
  DeleteHomeBannerPhotoId?: string;
}

export interface IBookEventBody {
  eventId?: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  comment: string;
  transactionId: string;
  transactionPhoto: string;
  personCount: number;
}

export interface IActiveInactiveEvent {
  eventId: string;
  action: boolean;
}

export interface IApproveDeclineRegistration {
  action: number;
  bookingId: string;
  eventId: string;
}

export interface IJobPostApprovalBody {
  careerOpportunityId: string;
  action: number;
}

export interface IJobPostActiveInactive {
  careerOpportunityId: string;
  action: boolean;
}

export interface IApplyJobBody {
  careerOpportunityId?: ObjectId;
  name: string;
  email: string;
  industryJob: string;
  contactNo: string;
  currentAddress: string;
  resume: string; // Store the file path or URL to the uploaded resume
}

export interface ISendMailToPastEventAttendeesBody {
  eventId: string;
}
export interface ICreateConfigBody {
  key: string;
  value: any;
}
export interface IUpdateConfigBody {
  value: any;
}
export interface IEditEmailTemplateBody {
  subject: string;
  message: string;
  emailTo: string[];
}

export interface IAdminGenerateNewPasswordBody {
  newPassword: string;
  userId: string;
}

export interface IAboutUsImagesBody {
  OverviewImage?: string[];
  CorporateSocialResponsibilityImage?: string[];
  deleteOverviewImageIds?: string[];
  deleteCSRImageIds?: string[];
  aboutUsId?: string;
}
