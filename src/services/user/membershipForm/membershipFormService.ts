import { ObjectId, Types } from 'mongoose';
import MembershipModel from '../../../models/MembersRegistrastionForm';
import { MembershipFormRepository } from '../../../repository/membershipFormRepository';
import {
  IAttachment,
  IBecomeAMemberBody,
  IChequeDetails,
  IOtherDocument,
  IRepresentative,
} from '../../../types/requests';
import ApiError from '../../../utils/ApiError';
import { FOLDER_NAMES, RESPONSE_CODE } from '../../../utils/constants';
import { toObjectId } from '../../../utils/helper';
import FileHelper from '../../fileService/fileHelper';
import FileService from '../../fileService/fileService';
import User from '../../../models/User';
import { IPropertyDetails } from '../../../types/models';
import {
  buildMatchStage,
  generatePaginatedResponse,
  generatePaginationOptions,
  PaginationOptions,
  parsePaginationParams,
} from '../../paginationService';

export class MembershipFormService extends MembershipFormRepository {
  membershipFormRepository = new MembershipFormRepository();
  fileHelper = new FileHelper();
  fileService = new FileService();

  async becomeAMember(
    payload: Partial<IBecomeAMemberBody>,
    user_id: ObjectId | string,
    files: any
  ): Promise<IBecomeAMemberBody> {
    const {
      gstNo,
      amcTenementNo,
      udyogAadharNo,
      representativeDetails,
      otherDocuments,
      torrentServiceNo,
      propertyDetails,
      chequeDetails,
    } = payload;

    console.log(files, 'files');

    //Check userid exist
    const UserExist = await this.membershipFormRepository.findUserById(user_id);
    if (UserExist) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'User is already a member',
        {},
        false
      );
    }
    // check gst number alredy exist
    const gstNumber = await this.membershipFormRepository.findGstNo(gstNo);
    if (gstNumber) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'User with same gst number already exists',
        {},
        false
      );
    }
    //check AMC Tenement No. Already Exist
    const amcTenementNumber =
      await this.membershipFormRepository.findAmcTenementNo(amcTenementNo);

    if (amcTenementNumber) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'User with same AMC Tenement Number already exists',
        {},
        false
      );
    }
    // check udyog Aadhar No. Alredy Exist
    const udyogAadharNumber =
      await this.membershipFormRepository.findudyogAadharNo(udyogAadharNo);

    if (udyogAadharNumber) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'User with same Udyog Aadhar Number already exists',
        {},
        false
      );
    }

    // check Torrent Service No Alredy Exist
    const torrentServiceNumber =
      await this.membershipFormRepository.findtorrentServiceNo(
        torrentServiceNo
      );

    if (torrentServiceNumber) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'User with same Torrent Service Number already exists',
        {},
        false
      );
    }

    // Extract filenames from files
    const extractedAttachments: Partial<IAttachment> = {};
    if (files['attachments.allotmentLetter']) {
      extractedAttachments.allotmentLetter =
        files['attachments.allotmentLetter'][0]?.filename;
    }
    if (files['attachments.possessionLetter']) {
      extractedAttachments.possessionLetter =
        files['attachments.possessionLetter'][0]?.filename;
    }
    if (files['attachments.officeOrder']) {
      extractedAttachments.officeOrder =
        files['attachments.officeOrder'][0]?.filename;
    }
    if (files['attachments.transferOrder']) {
      extractedAttachments.transferOrder =
        files['attachments.transferOrder'][0]?.filename;
    }

    const extractedRepresentativeDetails: IRepresentative[] = [];

    // Check if representativeDetails exists in the payload
    if (representativeDetails) {
      Object.keys(files).forEach(key => {
        if (key.startsWith('representativeDetails')) {
          const match = key.match(/representativeDetails\[(\d+)]\[photo]/);
          if (match) {
            const index = parseInt(match[1], 10);

            // Ensure the index exists in the extractedRepresentativeDetails array
            if (!extractedRepresentativeDetails[index]) {
              extractedRepresentativeDetails[index] = {
                ...representativeDetails[index], // Access safely since representativeDetails is defined
                photo: undefined,
              };
            }
            extractedRepresentativeDetails[index].photo =
              files[key][0]?.filename;
          }
        }
      });
    }

    const extractedOtherDocuments: IOtherDocument[] = [];

    // Check if `otherDocuments` exists in the payload
    if (otherDocuments) {
      Object.keys(files).forEach(key => {
        const match = key.match(/otherDocuments\[(\d+)]\[file]/);
        if (match) {
          const index = parseInt(match[1], 10);

          // Ensure the index exists in the extractedOtherDocuments array
          extractedOtherDocuments[index] = {
            name: otherDocuments[index]?.name || `Document ${index + 1}`,
            file: files[key][0]?.filename || null, // Handle undefined filenames
          };
        }
      });
    }

    // Extract property details
    const extractedPropertyDetails = propertyDetails || [];

    // ✅ Extract cheque photo
    // Extract cheque photo - FIXED VERSION
    let extractedChequeDetails: any = {};

    // First, include all fields from the chequeDetails payload
    if (chequeDetails) {
      extractedChequeDetails = { ...chequeDetails };
    }

    // Then add the chequePhoto if it exists in the files
    if (
      files['chequeDetails.chequePhoto1'] &&
      files['chequeDetails.chequePhoto1'][0]
    ) {
      extractedChequeDetails.chequePhoto =
        files['chequeDetails.chequePhoto1'][0].filename;
    }

    console.log(extractedChequeDetails, 'extractedChequeDetails');

    // Create a new member payload
    const updatedPayload = {
      ...payload,
      userId: user_id,
      attachments: extractedAttachments,
      representativeDetails: extractedRepresentativeDetails,
      otherDocuments: extractedOtherDocuments,
      propertyDetails: extractedPropertyDetails,
      chequeDetails: extractedChequeDetails,
      created_by: payload.createdBy,
    };

    //const createNewMember = await this.membershipFormRepository.createNewMember(payload)

    return await MembershipModel.create(updatedPayload);
  }

  async updateMembershipForm(
    payload: Partial<IBecomeAMemberBody>,
    user_id: ObjectId | Types.ObjectId,
    files: any
  ): Promise<IBecomeAMemberBody> {
    const {
      gstNo,
      amcTenementNo,
      udyogAadharNo,
      representativeDetails,
      torrentServiceNo,
      otherDocuments,
      attachments,
      propertyDetails,
      user_name,
    } = payload;

    console.log(propertyDetails, 'filpropertyDetailses');
    console.log(files, 'files');

    // Check if the user exists
    const user = await this.membershipFormRepository.findUserById(user_id);

    if (!user) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'User not found', {}, false);
    }

    // Check for conflicts with GST, AMC Tenement, and Udyog Aadhar numbers
    if (gstNo && gstNo !== user.gstNo) {
      const gstNumber = await this.membershipFormRepository.findGstNo(gstNo);
      if (gstNumber) {
        throw new ApiError(
          RESPONSE_CODE.CONFLICT,
          'User with the same GST number already exists',
          {},
          false
        );
      }
    }

    if (amcTenementNo && amcTenementNo !== user.amcTenementNo) {
      const amcTenementNumber =
        await this.membershipFormRepository.findAmcTenementNo(amcTenementNo);
      if (amcTenementNumber) {
        throw new ApiError(
          RESPONSE_CODE.CONFLICT,
          'User with the same AMC Tenement Number already exists',
          {},
          false
        );
      }
    }

    if (udyogAadharNo && udyogAadharNo !== user.udyogAadharNo) {
      const udyogAadharNumber =
        await this.membershipFormRepository.findudyogAadharNo(udyogAadharNo);
      if (udyogAadharNumber) {
        throw new ApiError(
          RESPONSE_CODE.CONFLICT,
          'User with the same Udyog Aadhar Number already exists',
          {},
          false
        );
      }
    }

    if (torrentServiceNo && torrentServiceNo !== user.torrentServiceNo) {
      const torrentServiceNumber =
        await this.membershipFormRepository.findtorrentServiceNo(
          torrentServiceNo
        );
      if (torrentServiceNumber) {
        throw new ApiError(
          RESPONSE_CODE.CONFLICT,
          'User with the same Torrent Service Number already exists',
          {},
          false
        );
      }
    }

    // Prepare a list of old files to delete
    const filesToDelete: string[] = [];

    // Update representativeDetails
    if (representativeDetails) {
      representativeDetails.forEach((updatedRepDetail, index) => {
        const existingRepDetail = user.representativeDetails[index];

        if (existingRepDetail) {
          // Update fields in representativeDetails if provided
          user.representativeDetails[index] = {
            ...existingRepDetail, // Preserve existing data
            ...updatedRepDetail, // Apply updates from payload
          };

          // Check for a new photo file and update it
          const fileKey = `representativeDetails[${index}][photo]`;
          if (files && files[fileKey]) {
            const newPhoto = files[fileKey][0]; // Get the file details for the photo

            console.log(
              `Uploading new file for index ${index}:`,
              newPhoto.filename
            );

            // Add the old photo to the deletion list
            if (existingRepDetail.photo) {
              const oldFilePath = `uploads/users/${user_id}/${existingRepDetail.photo}`;
              filesToDelete.push(oldFilePath);
            }

            // Update the photo field
            user.representativeDetails[index].photo = newPhoto.filename;
          }
        } else {
          // Add a new representativeDetail if it doesn't exist
          const newPhotoFileKey = `representativeDetails[${index}][photo]`;
          const newPhoto =
            files && files[newPhotoFileKey]
              ? files[newPhotoFileKey][0].filename
              : null;

          user.representativeDetails[index] = {
            ...updatedRepDetail,
            photo: newPhoto || '', // Set photo if available, else empty
          };
        }
      });
    }

    Object.keys(files).forEach(key => {
      console.log('inside ');

      // Check if the key is related to 'otherDocuments'
      if (key.startsWith('otherDocuments')) {
        const indexMatch = key.match(/\[(\d+)\]/);

        // If the index matches
        if (indexMatch) {
          const index = parseInt(indexMatch[1], 10);

          // If there's a 'name' field in the payload, update it
          if (
            payload.otherDocuments &&
            payload.otherDocuments[index] &&
            payload.otherDocuments[index].name
          ) {
            user.otherDocuments[index].name =
              payload.otherDocuments[index].name;
            console.log(
              `Updated name for document at index ${index} to: ${payload.otherDocuments[index].name}`
            );
          }

          // If a file is uploaded, update the file
          if (files[key] && files[key][0]) {
            const newFile = files[key][0];

            // If there's an existing file, add it to the deletion list
            if (user.otherDocuments[index].file) {
              const oldFilePath = `uploads/users/${user_id}/${user.otherDocuments[index].file}`;
              filesToDelete.push(oldFilePath);
            }

            // Update the file in the document
            user.otherDocuments[index].file = newFile.filename;
            console.log(
              `Updated file for document at index ${index} to: ${newFile.filename}`
            );
          }
        }
      }
    });

    // Additional loop to update names without requiring a file
    if (payload.otherDocuments) {
      payload.otherDocuments.forEach((doc, index) => {
        if (doc.name && user.otherDocuments[index]) {
          user.otherDocuments[index].name = doc.name;
          console.log(
            `Updated name for document at index ${index} to: ${doc.name}`
          );
        }
      });
    }

    // Loop through all files uploaded in the request
    Object.keys(files).forEach(key => {
      // Strip "attachments." prefix
      const strippedKey = key.replace(/^attachments\./, '');

      const attachmentFields: (keyof IAttachment)[] = [
        'allotmentLetter',
        'possessionLetter',
        'officeOrder',
        'transferOrder',
      ];

      // Check if the stripped key is a valid attachment field
      if (attachmentFields.includes(strippedKey as keyof IAttachment)) {
        const newFile = files[key][0]; // Get the uploaded file

        if (newFile) {
          // Initialize attachments if undefined
          if (!user.attachments) {
            user.attachments = {};
          }

          // Retrieve the old file
          const oldFile = user.attachments[strippedKey as keyof IAttachment];

          // If an old file exists, add it to the deletion list
          if (oldFile) {
            const oldFilePath = `uploads/users/${user_id}/${oldFile}`;
            console.log(`Marking old file for deletion: ${oldFilePath}`);
            filesToDelete.push(oldFilePath);
          }

          // Update the database with the new file name
          user.attachments[strippedKey as keyof IAttachment] = newFile.filename;

          console.log(
            `Attachment field "${strippedKey}" updated. Old file: ${oldFile}, New file: ${newFile.filename}`
          );
        } else {
          console.log(`No new file provided for "${strippedKey}"`);
        }
      } else {
        console.log(`"${key}" is not a valid attachment field`);
      }
    });

    if (propertyDetails) {
      console.log('Replacing property details:', propertyDetails);
      // Simply replace the entire propertyDetails array with the new one from the payload
      user.propertyDetails = propertyDetails;
    }

    // Log the files to delete
    console.log('Files to delete:', filesToDelete);

    // Delete old files if any
    if (filesToDelete.length) {
      await this.fileHelper.deleteFiles(filesToDelete);
    }

    // Prepare the updated fields for the database
    const updatedFields: Partial<IBecomeAMemberBody> = {
      ...payload,
      representativeDetails: user.representativeDetails,
      otherDocuments: user.otherDocuments,
      attachments: user.attachments,
      propertyDetails: user.propertyDetails,
    };

    // Update the user in the database
    const updatedUser = await this.membershipFormRepository.updateUserByUserId(
      user_id,
      updatedFields
    );

    if (user_name) {
      const user = await User.findById(user_id);
      if (user && user?.user_name.length > 0 && user?.user_name !== user_name) {
        ///
        const userNameExists = await User.exists({
          user_name: user_name,
        });
        if (userNameExists) {
          throw new ApiError(
            RESPONSE_CODE.CONFLICT,
            'User with same username already exists',
            {},
            false
          );
        }
        user.user_name = user_name;
        await user.save();
      }
    }
    // Handle update failure
    if (!updatedUser) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Failed to update user. User not found.',
        {},
        false
      );
    }

    return updatedUser;
  }

  async getMemberDetails(userid: ObjectId | Types.ObjectId) {
    // Check if the user exists
    const user = await this.membershipFormRepository.findUserById(userid);
    const userData = await User.findById(userid);

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch the member details
    const memberDetails = await MembershipModel.findOne({
      userId: userid,
    }).lean();

    if (!memberDetails) {
      throw new Error('Member details not found');
    }
    const userIdString =
      memberDetails.created_by?.toString() || userid.toString();
    const approvedByString = memberDetails.approved_by?.toString();
    // Convert file paths
    if (memberDetails.representativeDetails) {
      memberDetails.representativeDetails =
        memberDetails.representativeDetails.map(rep => {
          if (rep.photo) {
            rep.photo = this.fileService.getFilePathFromDatabase(
              FOLDER_NAMES.USERS,
              [userIdString, rep.photo]
            );
          }
          return rep;
        });
    }

    if (memberDetails.attachments) {
      if (memberDetails.attachments.allotmentLetter) {
        memberDetails.attachments.allotmentLetter =
          this.fileService.getFilePathFromDatabase(FOLDER_NAMES.USERS, [
            userIdString,
            memberDetails.attachments.allotmentLetter,
          ]);
      }
      if (memberDetails.attachments.possessionLetter) {
        memberDetails.attachments.possessionLetter =
          this.fileService.getFilePathFromDatabase(FOLDER_NAMES.USERS, [
            userIdString,
            memberDetails.attachments.possessionLetter,
          ]);
      }
      if (memberDetails.attachments.officeOrder) {
        memberDetails.attachments.officeOrder =
          this.fileService.getFilePathFromDatabase(FOLDER_NAMES.USERS, [
            userIdString,
            memberDetails.attachments.officeOrder,
          ]);
      }
      if (memberDetails.attachments.transferOrder) {
        memberDetails.attachments.transferOrder =
          this.fileService.getFilePathFromDatabase(FOLDER_NAMES.USERS, [
            userIdString,
            memberDetails.attachments.transferOrder,
          ]);
      }
    }

    if (memberDetails.otherDocuments) {
      memberDetails.otherDocuments = memberDetails.otherDocuments.map(doc => {
        if (doc.file) {
          doc.file = this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.USERS,
            [userIdString, doc.file]
          );
        }
        return doc;
      });
    }

    // Add cheque photo path
    if (
      memberDetails.chequeDetails &&
      memberDetails.chequeDetails.chequePhoto
    ) {
      memberDetails.chequeDetails.chequePhoto =
        this.fileService.getFilePathFromDatabase(FOLDER_NAMES.USERS, [
          userIdString,
          memberDetails.chequeDetails.chequePhoto,
        ]);
    }

    if (memberDetails.receiptPhoto) {
      memberDetails.receiptPhoto = this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.MEMBERSHIPRECEIPT,
        [approvedByString || '', memberDetails.receiptPhoto]
      );
    }

    return {
      memberDetails,
      is_Member: userData?.is_Member,
      user_name: userData?.user_name,
    };
  }

  allowedQueryParams() {
    const allowedFields: Record<
      string,
      { type: 'string' | 'number'; dbField: string }
    > = {
      companyType: { type: 'string', dbField: 'companyType' },
      productName: { type: 'string', dbField: 'productName' },
      memberCompanyName: { type: 'string', dbField: 'memberCompanyName' },
      companyCategory: { type: 'string', dbField: 'companyCategory' },
    };
    return allowedFields;
  }

  // private searchableFieldsInSearchParams(queryParams: any) {
  //   if ((queryParams?.isSelectionFuzzy == "false")) {
  //     return;
  //   }
  //   if (queryParams?.memberCompanyName) {
  //     queryParams.search = queryParams?.memberCompanyName;
  //     delete queryParams.memberCompanyName;
  //     return ["memberCompanyName"];
  //   } else if (queryParams?.email) {
  //     queryParams.search = queryParams?.email;
  //     delete queryParams.email;

  //     return ["email"];
  //   } else if (queryParams?.phone) {
  //     queryParams.search = queryParams?.phone;
  //     delete queryParams.phone;
  //     return ["phone"];
  //   } else if (queryParams?.website) {
  //     queryParams.search = queryParams?.website;
  //     delete queryParams.website;
  //     return ["website"];
  //   } else if (queryParams?.productName) {
  //     queryParams.search = queryParams?.productName;
  //     delete queryParams.productName;

  //     return ["productName"];
  //   } else if (queryParams?.companyCategory) {
  //     queryParams.search = queryParams?.companyCategory;
  //     delete queryParams.companyCategory;
  //     return ["companyCategory"];
  //   } else {
  //     return [
  //       "memberCompanyName",
  //       "email",
  //       "phone",
  //       "website",
  //       "productName",
  //       "companyCategory",
  //     ];
  //   }
  // }

  private searchableFieldsInSearchParams(queryParams: any) {
    // ✅ Disable fuzzy search if explicitly set to false
    if (queryParams?.isSelectionFuzzy === 'false') {
      return;
    }

    // ✅ Define supported searchable fields
    const searchableFields = [
      'memberCompanyName',
      'email',
      'phone',
      'website',
      'productName',
      'companyCategory',
    ];

    // ✅ Check if queryParams contains one of these fields
    for (const field of searchableFields) {
      if (queryParams?.[field]) {
        queryParams.search = queryParams[field];
        delete queryParams[field];
        return [field]; // Only search in this field
      }
    }

    // ✅ Default: search across all fields
    return searchableFields;
  }

  async getPaginatedMembers(queryParams: PaginationOptions) {
    const parsedParams = parsePaginationParams(queryParams);
    const { skip, limit, sort } = generatePaginationOptions(parsedParams);
    const q = queryParams;
    const searchableFields = this.searchableFieldsInSearchParams(q);
    const dynamicMatch = {
      ...buildMatchStage(q, this.allowedQueryParams(), searchableFields),
    };
    console.log(q, 'q');
    console.log(dynamicMatch, 'dynamicMatch');
    const memberList = await MembershipModel.aggregate([
      { $match: dynamicMatch },

      {
        $project: {
          _id: 1,
          memberCompanyName: 1,
          email: 1,
          phone: 1,
          website: 1,
          productName: 1,
          companyCategory: 1,
          companyType: 1,
          userId: 1,
        },
      },

      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    const paginatedResponse = await generatePaginatedResponse(
      parsedParams,
      MembershipModel,
      dynamicMatch
    );

    return {
      ...paginatedResponse,
      memberList,
    };
  }
}
