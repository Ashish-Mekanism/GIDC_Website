import mongoose, { ObjectId } from 'mongoose';
import { Interface } from 'readline';
import { ACTIONS, ROLE_PERMISSION } from '../../utils/constants';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  created_by?: ObjectId; // Link to Membership model
  is_Member?: boolean;
  //is_Admin?:boolean;
  user_type?: number;
  email_Verification_Token?: string;
  email_Verification_Token_Expiry?: Date;
  is_Email_Verified?: boolean;
  password_Forgot_Token_Expiry: Date;
  password_Forgot_Token?: string;
  reset_password_token?: string;
  reset_password_token_expiry: Date;
  approval_status: number;
  account_status: number;
  roleName: IRoleAssignment[];
  user_name: string;
  plotShedNo: string;
  waterConnectionNo: string;
  companyName: string;
}

export interface IBlackListToken extends Document {
  token: string;
  expiresAt: Date;
}

interface IRepresentative {
  name: string;
  designation: string;
  email: string;
  mobile: string;
  phone: string;
  photo?: string; // Optional
}

interface IAttachment {
  allotmentLetter: string;
  possessionLetter: string;
  officeOrder: string;
  transferOrder: string;
}

interface IOtherDocument {
  name: string;
  file: string;
}

// interface IPlotShedSize {
//   waterConnectionNo: string;
//   connectionSize: string;
//   shedNos: string;
//   areaSize: string;
// }

export interface IPropertyDetails {
  plotShedSize: { type: string };
  waterConnectionNo: { type: string };
  connectionSizeMM: { type: string };
  areaSizeSqMtrs: { type: string };
}

export interface IMembership extends Document {
  userId: ObjectId;
  created_by?: ObjectId;
  approved_by?: ObjectId;
  membership_Id: string;
  memberCompanyName: string;
  plotShedNo: string;
  roadNo: string;
  companyType: string;
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
  // plotShedSize: IPlotShedSize;
  propertyDetails: IPropertyDetails[];
  chequeDetails: IChequeDetails;
  receipt: string;
  receiptPhoto: string;
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

export interface IComplaint extends Document {
  userId?: ObjectId;
  membershipNo?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  complaint_photo?: string;
  companyName?: string;
  personName?: string;
  roadNo?: string;
  address?: string;
  serviceCategory: ObjectId;
  serviceDetails?: string;
  status: number;
  assignContractor: ObjectId;
  ServiceCategoryName: string;
  assignedContractorAt: Date;
  completedServiceAt: Date;
  deletedAt: Date;
  serviceNumber?: number;
  waterConnectionNo: string;
  isExported: boolean;
  isCreatedByAdmin: boolean;
  createdByAdminId: ObjectId;
}

export interface IGetInTouch extends Document {
  name: string;
  phone: number;
  message: string;
  createdAt?: Date;
}

export interface IWebDirectory {
  userId: ObjectId;
  created_by: ObjectId;
  companyName: string;
  companyLogo?: string;
  personalPhone: number;
  companyPhone: number;
  personalEmail: string;
  companyEmail: string;
  companyProfile: string;
  productDetails: string;
  product: IProduct[];
  location: ILocation[];
  active: boolean;
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
  //_id?:ObjectId;
  productName?: string;
  productImage?: string;
}

export interface IBusinessCard extends Document {
  created_by: ObjectId;
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
  profilePhoto: string;
  active: boolean;
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

export interface IDigitalCardGallery {
  created_by: ObjectId;
  digitalCardId: ObjectId;
  galleryName: string;
  photos: IGalleryPhotos[];
}

interface IGalleryPhotos {
  fileName: string;
}

export interface IDigitalCardSlider {
  created_by: ObjectId;
  digitalCardId: ObjectId;
  photos: ISliderPhotos[];
}

interface ISliderPhotos {
  fileName: string;
}

export interface ICareerOpportunity extends Document {
  userId: ObjectId;
  jobTitle: string;
  jobType: string;
  jobDescription: string;
  jobLocation: string;
  companyAddress: string;
  applicationDeadline: Date;
  associationName: string;
  email: string;
  jobIndustry: string;
  approveStatus: number;
  active: boolean;
  isDeleted: boolean;
  requiredExperience: string;
  requiredPerson: string;
}

// Define the Attachment object
interface Attachment {
  applicationLetter?: string;
  waterBill?: string;
  lightBill?: string;
  taxBill?: string;
  otherDocumentImage: string;
  otherDocumentName: string;
  gidc: {
    gidcLetterRefNo: string;
    gidcDate: Date;
  };
  torrent: {
    torrentServiceNo: string;
    torrentNo: string;
    torrentDate: Date;
    torrentName: string;
  };
  amcTaxBill: {
    amcTaxTenamentNo: string;
    amcTaxYear: string;
    amcTaxPaidAmount: string;
    amcTaxName: string;
  };
  water: {
    waterConnectionNo: string;
    waterBillNo: string;
    waterBillDate: Date;
    waterConsumptionPeriod: string;
    waterBillName: string;
  };
  // otherDocuments?: { documentName: string; documentImage: string }[];
}

// Define the NOC Form interface
export interface INocForm extends Document {
  _id: ObjectId;
  userId: ObjectId;
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
  attachments: Attachment;
  chequeDetails: IChequeDetails;
  userContribution: IUserContribution;
  plotNo: string;
  refNo: string;
  gstNo: string;
  roadNo: string;
  publishDate: Date;
  isExported: boolean;
  user_name?: string;
}

export interface IUserContribution {
  name: string;
  plotNo: string;
  bank: string;
  chequeDate: string;
  chequeNo: string;
  chequeAmount: string;
}
export interface IRole {
  role_Name?: ObjectId | string | undefined;
}
export interface IRoleAssignment {
  role_Name: keyof typeof ROLE_PERMISSION; // Restrict values to defined roles
  actions: (keyof typeof ACTIONS)[]; // Restrict actions to predefined ones
}

export interface IAction {
  Action?: ObjectId | string | undefined;
}

export interface ITelephone extends Document {
  Title: string;
  CreatedBy: ObjectId;
  Active: boolean;
}

export interface ISubTelephone extends Document {
  TelephoneModelId: ObjectId;
  CreatedBy: ObjectId;
  Name: string;
  Address: string;
  Contact1: number;
  Contact2: number;
  Photo: string;
}

export interface IServiceCategory extends Document {
  ServiceCategoryName: string;
  active: boolean;
  key: string;
}

export interface IContractor extends Document {
  ServiceIds: ObjectId;
  ContractorName: string;
  active: boolean;
  ContractorEmail: string;
  isExported: boolean;
}

export interface IAdminPhotoGallery extends Document {
  CreatedBy: ObjectId;
  Heading: string;
  SeminarBy: string;
  Date: Date;
  Photos: IAdminGalleryPhotos[];
}

interface IAdminGalleryPhotos {
  fileName: string;
}

export interface IAdminVideoGallery extends Document {
  CreatedBy: ObjectId;
  Heading: string;
  Date: Date;
  Poster: string;
  Videos: IAdminVideosPhotos[];
}

interface IAdminVideosPhotos {
  fileName: string;
}

export interface IEvent extends Document {
  CreatedBy: ObjectId;
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
  Active: boolean;
  QRCodePhoto: string;
  UpiId: string;
  IsUpi: boolean;
  IsQrCode: boolean;
}

interface IEventLocation {
  LocationName: string;
  Address: string;
  City: string;
  State: string;
  PostCode: string;
  Country: string;
}

export interface IDownloadAndCircular extends Document {
  CreatedBy: ObjectId;
  Heading: string;
  Description: string;
  Document: string;
  Date: Date;
  Active: boolean;
  Category: string;
}
export interface ISponsorship extends Document {
  CreatedBy: ObjectId;
  Name: string;
  Email: string;
  Phone: number;
  Note: string;
  Approved: number;
  Photo: string;
  Active: boolean;
  StartDate: Date;
  EndDate: Date;
  Amount: number;
  Url: string;
}

export interface IQuickLink {
  CreatedBy: ObjectId;
  Icon: string;
  Title: string;
  Links: ILink[];
}

export interface ILink {
  _id?: string | ObjectId;
  title: string;
  url: string;
}

export interface IPresidentMessage extends Document {
  CreatedBy: ObjectId;
  Photo: string;
  Title: string;
  Sub_Title: string;
  Description: string;
}

export interface IBusinessBulletin extends Document {
  CreatedBy: ObjectId;
  Photo: string;
  Title: string;
}

export interface IAdminContactUs extends Document {
  CreatedBy: ObjectId;
  Address: string;
  PhoneNumber: string;
  Email: string;
  Linkedin: string;
  Facebook: string;
  Twitter: string;
}

export interface IAbout extends Document {
  CreatedBy: ObjectId;
  Paragraph1: string;
  Paragraph2: string;
  Paragraph3: string;
}

export interface IOverview extends Document {
  CreatedBy: ObjectId;
  NoOfIndustriesInOdhav: number;
  NoOfMembers: number;
  AreaOfIndustrialEstate: number;
}

export interface IOurVision extends Document {
  CreatedBy: ObjectId;
  VisionDescription: string;
  Vision: string[];
}

export interface IOurMission extends Document {
  CreatedBy: ObjectId;
  MissionDescription: string;
  Mission: string[];
}

export interface IMaximizingVisibility extends Document {
  CreatedBy: ObjectId;
  maximizingVisibility: string[];
}

export interface IIndustries extends Document {
  CreatedBy: ObjectId;
  Photo: string;
  IndustriesName: string;
}

export interface IServiceAndFacility extends Document {
  CreatedBy: ObjectId;
  Photo: string;
  ServiceName: string;
  ServiceDescription: string;
}

export interface ICorporateSocialResponsibility extends Document {
  CreatedBy: ObjectId;
  CorporateSocialResponsibility1: string[];
  CorporateSocialResponsibility2: string[];
}

export interface ICommittee extends Document {
  CommitteeName: string;
  CreatedBy: ObjectId;
}
export interface ICommitteeMember extends Document {
  CommitteeModelId: ObjectId;
  CreatedBy: ObjectId;
  Name: string;
  Designation: string;
  Photo: string;
}

export interface IMembershipBenefits extends Document {
  CreatedBy: ObjectId;
  MembershipBenefitDescription: string;
  MembershipBenefitDescription2: string;
  MembershipBenefitDescription3: string;
  MebershipBenefitsPoints: string[];
}

export interface IRequiredDocuments extends Document {
  CreatedBy: ObjectId;
  requiredDocuments: string[];
}

export interface ITypeOfMembership extends Document {
  CreatedBy: ObjectId;
  Title: string;
  Description1: string;
  Description2: string;
  MembershipPoints: string[];
}
export interface IForeignEmbassies extends Document {
  CreatedBy: ObjectId;
  Photos: IForeignEmbassiesPhotos[];
}

export interface IAboutUsImages extends Document {
  CreatedBy: ObjectId;
  OverviewImage: IAboutUsImagesOverviewImage[];
  CorporateSocialResponsibilityImage: IAboutUsImagesCorporateSocialResponsibilityImage[];
}

interface IForeignEmbassiesPhotos {
  fileName: string;
}

interface IAboutUsImagesOverviewImage {
  fileName: string;
}
interface IAboutUsImagesCorporateSocialResponsibilityImage {
  fileName: string;
} 

export interface IHomeBanner extends Document {
  CreatedBy: ObjectId;
  Photos: IHomeBannerPhotos[];
}
interface IHomeBannerPhotos {
  fileName: string;
}

export interface IBookEvent extends Document {
  userId: ObjectId;
  eventId: ObjectId;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  comment: string;
  transactionId: string;
  transactionPhoto: string;
  status: string;
  personCount: number;
}

export interface IApplyJob extends Document {
  careerOpportunityId: ObjectId;
  name: string;
  email: string;
  industryJob: string;
  contactNo: string;
  currentAddress: string;
  resume: string; // Store the file path or URL to the uploaded resume
}

export interface IConfig extends Document {
  key: string;
  value: any;
}

export interface IEmailTemplate extends Document {
  key: string;
  subject: string;
  message: string;
  emailTo: [string];
}

