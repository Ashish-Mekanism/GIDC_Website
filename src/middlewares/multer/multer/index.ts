import { adminPhotoGalleryMiddleware,adminVideoGalleryMiddleware, adminEventPhotoMiddleware,
     adminTelephonePhotoMiddleware,adminCircularPhotoMiddleware,adminQuickLinkIconMiddleware,
     adminPresidentPhotoMiddleware,adminBusinessBulletinPhotoMiddleware,adminIndustriesMiddleware,
     adminServiceAndFacilityMiddleware,adminCommitteeMemberPhotoMiddleware,adminForeignEmbassiesPhotoMiddleware,
     adminHomeBannerPhotoMiddleware } from './adminUploadMiddleware';

import {
    userUploadMiddleware, userComplaintMiddleware,
    userWebDirectoryMiddleware, userBusinessCardProfileMiddleware,
    UserDigitalCardGalleryMiddleware, UserDigitalCardSliderMiddleware,
    UserNocMiddleware,UserSponsorshipMiddleware,

} from './userUploadMiddleware';

export {
    userUploadMiddleware, userComplaintMiddleware,
    userWebDirectoryMiddleware, userBusinessCardProfileMiddleware,
    UserDigitalCardGalleryMiddleware, UserDigitalCardSliderMiddleware, UserNocMiddleware, adminPhotoGalleryMiddleware, adminEventPhotoMiddleware,
    adminTelephonePhotoMiddleware,adminCircularPhotoMiddleware,UserSponsorshipMiddleware,
    adminQuickLinkIconMiddleware,adminPresidentPhotoMiddleware,adminBusinessBulletinPhotoMiddleware,adminVideoGalleryMiddleware,
    adminIndustriesMiddleware,adminServiceAndFacilityMiddleware,adminCommitteeMemberPhotoMiddleware,adminForeignEmbassiesPhotoMiddleware,
    adminHomeBannerPhotoMiddleware
};
