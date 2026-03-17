
import { FOLDER_NAMES } from '../../utils/constants';
import FileService from './fileService';

const uploadsFileService = new FileService(FOLDER_NAMES.UPLOADS);
const userUploadsFileService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.USERS}`);
const userComplaintPhotoService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.COMPLAINT}`);
const userWebDirectoryService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.WEBDIRECTORY}`);
const userBusinessCardService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.BUSINESSCARD}`);
const userDigitalCardGalleryService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.DIGITALCARDGALLERY}`);
const userDigitalCardSliderService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.DIGITALCARDSLIDER}`);
const userNocService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.NOC}`);
const userSponsorshipService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.SPONSORSHIP}`);
const userBookingTransactionService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.BOOKINGTRANSACTION}`);
const userResumeService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.RESUME}`);

//ADMIN
const adminphotoGalleryService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.ADMINPHOTOGALLERY}`)
const adminVideoGalleryService =new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.ADMINVIDEOGALERY}`)
const adminTelephonePhotoService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.TELEPHONEPHOTO}`)
const adminEventPhotoService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.EVENT}`)
const adminCircularPhotoService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.CIRCULAR}`)
const adminQuickLinkService=new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.QUICKLINKICON}`)
const adminPresidentService=new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.PRESIDENTPHOTO}`)
const adminBusinessBulletinService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.BUSINESSBULLETIN}`)
const adminIndustriesService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.INDUSTRIES}`)
const adminServiceAndFacilityService =new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.SERVICEANDFACILITY}`)
const adminCommitteeMemberService=new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.COMMITTEEMEMBER}`)
const adminForeignEmbassiesPhotoService = new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.FOREIGNEMBASSIES}`)
const adminHomeBannerPhotoService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.HOMEBANNER}`)
const adminMembershipReceiptPhotoService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.MEMBERSHIPRECEIPT}`)
const adminOverviewImageService= new FileService(`${FOLDER_NAMES.UPLOADS}/${FOLDER_NAMES.OVERVIEW}`)
//userUploadsFileService.deleteFile('6784fc9e7ed5e5febcf51f0e','rep1.1737701640424-431554241.jpg')
export {
    uploadsFileService, userUploadsFileService, userComplaintPhotoService,
    userWebDirectoryService, userBusinessCardService,
    userDigitalCardGalleryService, userDigitalCardSliderService,userNocService,userBookingTransactionService,
    userResumeService,
    adminphotoGalleryService,adminTelephonePhotoService,adminEventPhotoService,
    adminCircularPhotoService,userSponsorshipService,adminQuickLinkService,
    adminPresidentService,adminBusinessBulletinService,adminVideoGalleryService,adminIndustriesService,
    adminServiceAndFacilityService,adminCommitteeMemberService,adminForeignEmbassiesPhotoService,
    adminHomeBannerPhotoService,adminMembershipReceiptPhotoService,adminOverviewImageService
};
