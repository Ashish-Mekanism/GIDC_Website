import { ObjectId } from 'mongoose';
import Sponsorship from '../models/Sponsorship';
import { ISponsorshipBody } from '../types/requests';
import {
  ACCOUNT_STATUS,
  FOLDER_NAMES,
  RESPONSE_CODE,
  SPONSORSHIP_APPROVAL_STATUS,
  SPONSORSHIP_STATUS,
} from '../utils/constants';
import ApiError from '../utils/ApiError';
import FileHelper from './fileService/fileHelper';
import FileService from './fileService/fileService';
import { toObjectId } from '../utils/helper';
import { ISponsorship } from '../types/models';

export class SponsorshipService {
  fileHelper = new FileHelper();
  fileService = new FileService();

  async createSponsorship(
    payload: Partial<ISponsorshipBody>,
    file: any,
    CreatedBy: ObjectId | undefined
  ): Promise<ISponsorshipBody> {
    console.log(payload, 'payload');

    const updatedPayload = {
      ...payload,
      Approved: SPONSORSHIP_APPROVAL_STATUS.PENDING,
      Active: false,
      Photo: file?.filename || null,
      CreatedBy,
    };

    return await Sponsorship.create(updatedPayload);
  }

  async updateSponsorship(
    payload: Partial<ISponsorshipBody>,
    sponsorshipId: string,
    file: any
  ): Promise<ISponsorshipBody> {
    console.log(file, 'Received file object');

    // Find existing business card
    const sponsorship = await Sponsorship.findById(toObjectId(sponsorshipId));
    if (!sponsorship) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Sponsorship not found',
        {},
        false
      );
    }

    // Prepare old file path for deletion if it exists
    // let oldFilePath = businessCard.profilePhoto
    //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
    //   : null;
    let oldFilePath = `uploads/Sponsorship/${FOLDER_NAMES.SPONSORSHIP}/${sponsorship.Photo}`;
    let newPhoto = file ? file.filename : sponsorship.Photo;

    console.log(oldFilePath, 'oldFilePath');

    // Update payload
    const updatedPayload = {
      ...payload,
      Photo: newPhoto,
    };

    // Update business card in database
    const updatedSponsorship = (await Sponsorship.findByIdAndUpdate(
      sponsorshipId,
      updatedPayload,
      { new: true }
    ).lean()) as ISponsorship;

    // Delete old profile photo if a new one is uploaded
    if (file && sponsorship.Photo) {
      // Check if oldFilePath exists before deleting
      if (oldFilePath) {
        await this.fileHelper.deleteFile(oldFilePath);
      }
    }

    return updatedSponsorship;
  }

  async activeInactiveSponsorship(sponsorshipId: string, action: boolean) {
    const sponsorship_Id = toObjectId(sponsorshipId);
    const sponsorship = await Sponsorship.findById(sponsorship_Id);

    if (!sponsorship) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Sponsorship not found',
        {},
        false
      );
    }

    console.log(action, 'action received');

    // Determine new status based on the action
    const newStatus = action
      ? SPONSORSHIP_STATUS.ACTIVE
      : SPONSORSHIP_STATUS.INACTIVE;

    // If user is already in the desired state, return early
    if (sponsorship.Active === newStatus) {
      return {
        success: false,
        message: `User account is already ${action ? 'active' : 'deactivated'}.`,
      };
    }

    // Update user status
    await Sponsorship.findByIdAndUpdate(sponsorshipId, { Active: newStatus });

    return {
      success: true,
      message: `Sponsorship has been ${action ? 'activated' : 'deactivated'} successfully.`,
    };
  }

  async sponsorshipApproval(
    sponsorship_Id: string,
    action: number,
    amount: number
  ) {
    const sponsorshipId = toObjectId(sponsorship_Id);
    const sponsorship = await Sponsorship.findById(sponsorshipId);

    if (!sponsorship) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Sponsorship not found',
        {},
        false
      );
    }

    // Determine new status based on the action
    let newStatus;
    if (action === SPONSORSHIP_APPROVAL_STATUS.APPROVED) {
      newStatus = SPONSORSHIP_APPROVAL_STATUS.APPROVED;
    } else if (action === SPONSORSHIP_APPROVAL_STATUS.DECLINED) {
      newStatus = SPONSORSHIP_APPROVAL_STATUS.DECLINED;
    } else {
      newStatus = SPONSORSHIP_APPROVAL_STATUS.PENDING;
    }
    console.log(newStatus, 'newStatus');
    // If user is already in the desired state, return early
    if (sponsorship.Approved === newStatus) {
      return {
        success: false,
        message: `Sponsorshipis already ${
          action === SPONSORSHIP_APPROVAL_STATUS.APPROVED
            ? 'approved'
            : action === SPONSORSHIP_APPROVAL_STATUS.DECLINED
              ? 'declined'
              : 'pending'
        }.`,
      };
    }

    // Update user status
    await Sponsorship.findByIdAndUpdate(sponsorship_Id, {
      Approved: newStatus,
      Amount: amount,
    });

    return {
      success: true,
      message: `Sponsorship has been ${
        action === SPONSORSHIP_APPROVAL_STATUS.APPROVED
          ? 'approved'
          : action === SPONSORSHIP_APPROVAL_STATUS.DECLINED
            ? 'declined'
            : 'set to pending'
      } successfully.`,
    };
  }

  async getSponsorshipRequestList(): Promise<any> {
    // Fetch all events
    const sponsorships = await Sponsorship.find({
      Approved: SPONSORSHIP_APPROVAL_STATUS.PENDING,
    }).lean();
    const totalCount = await Sponsorship.countDocuments();
    return {
      data: sponsorships.map(sponsorship => ({
        ...sponsorship,
        Url: sponsorship?.Url || '#',
        DocumentUrl:
          typeof sponsorship.Photo === 'string'
            ? this.fileService.getFilePathFromDatabase(
                FOLDER_NAMES.SPONSORSHIP,
                [FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo]
              )
            : null, // Handle cases where Photo is missing
      })),
      totalCount: totalCount,
    };
  }

  async getSponsorshipApprovedList(): Promise<any> {
    // Fetch all events
    const sponsorships = await Sponsorship.find({
      Approved: SPONSORSHIP_APPROVAL_STATUS.APPROVED,
    }).lean();
    const totalCount = await Sponsorship.countDocuments();
    return {
      data: sponsorships.map(sponsorship => ({
        ...sponsorship,
        Url: sponsorship?.Url || '#',
        DocumentUrl:
          typeof sponsorship.Photo === 'string'
            ? this.fileService.getFilePathFromDatabase(
                FOLDER_NAMES.SPONSORSHIP,
                [FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo]
              )
            : null, // Handle cases where Photo is missing
      })),
      totalCount: totalCount,
    };
  }

  async getSponsorshipApprovedAndActiveList(): Promise<any> {
    // Fetch all events
    const sponsorships = await Sponsorship.find({
      Approved: SPONSORSHIP_APPROVAL_STATUS.APPROVED,
      Active: SPONSORSHIP_STATUS.ACTIVE,
    }).lean();
    const totalCount = await Sponsorship.countDocuments();
    return {
      data: sponsorships.map(sponsorship => ({
        // ...sponsorship,
        Url: sponsorship?.Url || '#',
        Photo:
          typeof sponsorship.Photo === 'string'
            ? this.fileService.getFilePathFromDatabase(
                FOLDER_NAMES.SPONSORSHIP,
                [FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo]
              )
            : null, // Handle cases where Photo is missing
      })),
      totalCount: totalCount,
    };
  }
}
