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
exports.MembershipFormService = void 0;
const MembersRegistrastionForm_1 = __importDefault(require("../../../models/MembersRegistrastionForm"));
const membershipFormRepository_1 = require("../../../repository/membershipFormRepository");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const User_1 = __importDefault(require("../../../models/User"));
const paginationService_1 = require("../../paginationService");
class MembershipFormService extends membershipFormRepository_1.MembershipFormRepository {
    constructor() {
        super(...arguments);
        this.membershipFormRepository = new membershipFormRepository_1.MembershipFormRepository();
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    becomeAMember(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { gstNo, amcTenementNo, udyogAadharNo, representativeDetails, otherDocuments, torrentServiceNo, propertyDetails, chequeDetails, } = payload;
            console.log(files, 'files');
            //Check userid exist
            const UserExist = yield this.membershipFormRepository.findUserById(user_id);
            if (UserExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User is already a member', {}, false);
            }
            // check gst number alredy exist
            const gstNumber = yield this.membershipFormRepository.findGstNo(gstNo);
            if (gstNumber) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with same gst number already exists', {}, false);
            }
            //check AMC Tenement No. Already Exist
            const amcTenementNumber = yield this.membershipFormRepository.findAmcTenementNo(amcTenementNo);
            if (amcTenementNumber) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with same AMC Tenement Number already exists', {}, false);
            }
            // check udyog Aadhar No. Alredy Exist
            const udyogAadharNumber = yield this.membershipFormRepository.findudyogAadharNo(udyogAadharNo);
            if (udyogAadharNumber) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with same Udyog Aadhar Number already exists', {}, false);
            }
            // check Torrent Service No Alredy Exist
            const torrentServiceNumber = yield this.membershipFormRepository.findtorrentServiceNo(torrentServiceNo);
            if (torrentServiceNumber) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with same Torrent Service Number already exists', {}, false);
            }
            // Extract filenames from files
            const extractedAttachments = {};
            if (files['attachments.allotmentLetter']) {
                extractedAttachments.allotmentLetter =
                    (_a = files['attachments.allotmentLetter'][0]) === null || _a === void 0 ? void 0 : _a.filename;
            }
            if (files['attachments.possessionLetter']) {
                extractedAttachments.possessionLetter =
                    (_b = files['attachments.possessionLetter'][0]) === null || _b === void 0 ? void 0 : _b.filename;
            }
            if (files['attachments.officeOrder']) {
                extractedAttachments.officeOrder =
                    (_c = files['attachments.officeOrder'][0]) === null || _c === void 0 ? void 0 : _c.filename;
            }
            if (files['attachments.transferOrder']) {
                extractedAttachments.transferOrder =
                    (_d = files['attachments.transferOrder'][0]) === null || _d === void 0 ? void 0 : _d.filename;
            }
            const extractedRepresentativeDetails = [];
            // Check if representativeDetails exists in the payload
            if (representativeDetails) {
                Object.keys(files).forEach(key => {
                    var _a;
                    if (key.startsWith('representativeDetails')) {
                        const match = key.match(/representativeDetails\[(\d+)]\[photo]/);
                        if (match) {
                            const index = parseInt(match[1], 10);
                            // Ensure the index exists in the extractedRepresentativeDetails array
                            if (!extractedRepresentativeDetails[index]) {
                                extractedRepresentativeDetails[index] = Object.assign(Object.assign({}, representativeDetails[index]), { photo: undefined });
                            }
                            extractedRepresentativeDetails[index].photo =
                                (_a = files[key][0]) === null || _a === void 0 ? void 0 : _a.filename;
                        }
                    }
                });
            }
            const extractedOtherDocuments = [];
            // Check if `otherDocuments` exists in the payload
            if (otherDocuments) {
                Object.keys(files).forEach(key => {
                    var _a, _b;
                    const match = key.match(/otherDocuments\[(\d+)]\[file]/);
                    if (match) {
                        const index = parseInt(match[1], 10);
                        // Ensure the index exists in the extractedOtherDocuments array
                        extractedOtherDocuments[index] = {
                            name: ((_a = otherDocuments[index]) === null || _a === void 0 ? void 0 : _a.name) || `Document ${index + 1}`,
                            file: ((_b = files[key][0]) === null || _b === void 0 ? void 0 : _b.filename) || null, // Handle undefined filenames
                        };
                    }
                });
            }
            // Extract property details
            const extractedPropertyDetails = propertyDetails || [];
            // ✅ Extract cheque photo
            // Extract cheque photo - FIXED VERSION
            let extractedChequeDetails = {};
            // First, include all fields from the chequeDetails payload
            if (chequeDetails) {
                extractedChequeDetails = Object.assign({}, chequeDetails);
            }
            // Then add the chequePhoto if it exists in the files
            if (files['chequeDetails.chequePhoto1'] &&
                files['chequeDetails.chequePhoto1'][0]) {
                extractedChequeDetails.chequePhoto =
                    files['chequeDetails.chequePhoto1'][0].filename;
            }
            console.log(extractedChequeDetails, 'extractedChequeDetails');
            // Create a new member payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { userId: user_id, attachments: extractedAttachments, representativeDetails: extractedRepresentativeDetails, otherDocuments: extractedOtherDocuments, propertyDetails: extractedPropertyDetails, chequeDetails: extractedChequeDetails, created_by: payload.createdBy });
            //const createNewMember = await this.membershipFormRepository.createNewMember(payload)
            return yield MembersRegistrastionForm_1.default.create(updatedPayload);
        });
    }
    updateMembershipForm(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gstNo, amcTenementNo, udyogAadharNo, representativeDetails, torrentServiceNo, otherDocuments, attachments, propertyDetails, user_name, } = payload;
            console.log(propertyDetails, 'filpropertyDetailses');
            console.log(files, 'files');
            // Check if the user exists
            const user = yield this.membershipFormRepository.findUserById(user_id);
            if (!user) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'User not found', {}, false);
            }
            // Check for conflicts with GST, AMC Tenement, and Udyog Aadhar numbers
            if (gstNo && gstNo !== user.gstNo) {
                const gstNumber = yield this.membershipFormRepository.findGstNo(gstNo);
                if (gstNumber) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with the same GST number already exists', {}, false);
                }
            }
            if (amcTenementNo && amcTenementNo !== user.amcTenementNo) {
                const amcTenementNumber = yield this.membershipFormRepository.findAmcTenementNo(amcTenementNo);
                if (amcTenementNumber) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with the same AMC Tenement Number already exists', {}, false);
                }
            }
            if (udyogAadharNo && udyogAadharNo !== user.udyogAadharNo) {
                const udyogAadharNumber = yield this.membershipFormRepository.findudyogAadharNo(udyogAadharNo);
                if (udyogAadharNumber) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with the same Udyog Aadhar Number already exists', {}, false);
                }
            }
            if (torrentServiceNo && torrentServiceNo !== user.torrentServiceNo) {
                const torrentServiceNumber = yield this.membershipFormRepository.findtorrentServiceNo(torrentServiceNo);
                if (torrentServiceNumber) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with the same Torrent Service Number already exists', {}, false);
                }
            }
            // Prepare a list of old files to delete
            const filesToDelete = [];
            // Update representativeDetails
            if (representativeDetails) {
                representativeDetails.forEach((updatedRepDetail, index) => {
                    const existingRepDetail = user.representativeDetails[index];
                    if (existingRepDetail) {
                        // Update fields in representativeDetails if provided
                        user.representativeDetails[index] = Object.assign(Object.assign({}, existingRepDetail), updatedRepDetail);
                        // Check for a new photo file and update it
                        const fileKey = `representativeDetails[${index}][photo]`;
                        if (files && files[fileKey]) {
                            const newPhoto = files[fileKey][0]; // Get the file details for the photo
                            console.log(`Uploading new file for index ${index}:`, newPhoto.filename);
                            // Add the old photo to the deletion list
                            if (existingRepDetail.photo) {
                                const oldFilePath = `uploads/users/${user_id}/${existingRepDetail.photo}`;
                                filesToDelete.push(oldFilePath);
                            }
                            // Update the photo field
                            user.representativeDetails[index].photo = newPhoto.filename;
                        }
                    }
                    else {
                        // Add a new representativeDetail if it doesn't exist
                        const newPhotoFileKey = `representativeDetails[${index}][photo]`;
                        const newPhoto = files && files[newPhotoFileKey]
                            ? files[newPhotoFileKey][0].filename
                            : null;
                        user.representativeDetails[index] = Object.assign(Object.assign({}, updatedRepDetail), { photo: newPhoto || '' });
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
                        if (payload.otherDocuments &&
                            payload.otherDocuments[index] &&
                            payload.otherDocuments[index].name) {
                            user.otherDocuments[index].name =
                                payload.otherDocuments[index].name;
                            console.log(`Updated name for document at index ${index} to: ${payload.otherDocuments[index].name}`);
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
                            console.log(`Updated file for document at index ${index} to: ${newFile.filename}`);
                        }
                    }
                }
            });
            // Additional loop to update names without requiring a file
            if (payload.otherDocuments) {
                payload.otherDocuments.forEach((doc, index) => {
                    if (doc.name && user.otherDocuments[index]) {
                        user.otherDocuments[index].name = doc.name;
                        console.log(`Updated name for document at index ${index} to: ${doc.name}`);
                    }
                });
            }
            // Loop through all files uploaded in the request
            Object.keys(files).forEach(key => {
                // Strip "attachments." prefix
                const strippedKey = key.replace(/^attachments\./, '');
                const attachmentFields = [
                    'allotmentLetter',
                    'possessionLetter',
                    'officeOrder',
                    'transferOrder',
                ];
                // Check if the stripped key is a valid attachment field
                if (attachmentFields.includes(strippedKey)) {
                    const newFile = files[key][0]; // Get the uploaded file
                    if (newFile) {
                        // Initialize attachments if undefined
                        if (!user.attachments) {
                            user.attachments = {};
                        }
                        // Retrieve the old file
                        const oldFile = user.attachments[strippedKey];
                        // If an old file exists, add it to the deletion list
                        if (oldFile) {
                            const oldFilePath = `uploads/users/${user_id}/${oldFile}`;
                            console.log(`Marking old file for deletion: ${oldFilePath}`);
                            filesToDelete.push(oldFilePath);
                        }
                        // Update the database with the new file name
                        user.attachments[strippedKey] = newFile.filename;
                        console.log(`Attachment field "${strippedKey}" updated. Old file: ${oldFile}, New file: ${newFile.filename}`);
                    }
                    else {
                        console.log(`No new file provided for "${strippedKey}"`);
                    }
                }
                else {
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
                yield this.fileHelper.deleteFiles(filesToDelete);
            }
            // Prepare the updated fields for the database
            const updatedFields = Object.assign(Object.assign({}, payload), { representativeDetails: user.representativeDetails, otherDocuments: user.otherDocuments, attachments: user.attachments, propertyDetails: user.propertyDetails });
            // Update the user in the database
            const updatedUser = yield this.membershipFormRepository.updateUserByUserId(user_id, updatedFields);
            if (user_name) {
                const user = yield User_1.default.findById(user_id);
                if (user && (user === null || user === void 0 ? void 0 : user.user_name.length) > 0 && (user === null || user === void 0 ? void 0 : user.user_name) !== user_name) {
                    ///
                    const userNameExists = yield User_1.default.exists({
                        user_name: user_name,
                    });
                    if (userNameExists) {
                        throw new ApiError_1.default(constants_1.RESPONSE_CODE.CONFLICT, 'User with same username already exists', {}, false);
                    }
                    user.user_name = user_name;
                    yield user.save();
                }
            }
            // Handle update failure
            if (!updatedUser) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Failed to update user. User not found.', {}, false);
            }
            return updatedUser;
        });
    }
    getMemberDetails(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Check if the user exists
            const user = yield this.membershipFormRepository.findUserById(userid);
            const userData = yield User_1.default.findById(userid);
            if (!user) {
                throw new Error('User not found');
            }
            // Fetch the member details
            const memberDetails = yield MembersRegistrastionForm_1.default.findOne({
                userId: userid,
            }).lean();
            if (!memberDetails) {
                throw new Error('Member details not found');
            }
            const userIdString = ((_a = memberDetails.created_by) === null || _a === void 0 ? void 0 : _a.toString()) || userid.toString();
            const approvedByString = (_b = memberDetails.approved_by) === null || _b === void 0 ? void 0 : _b.toString();
            // Convert file paths
            if (memberDetails.representativeDetails) {
                memberDetails.representativeDetails =
                    memberDetails.representativeDetails.map(rep => {
                        if (rep.photo) {
                            rep.photo = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [userIdString, rep.photo]);
                        }
                        return rep;
                    });
            }
            if (memberDetails.attachments) {
                if (memberDetails.attachments.allotmentLetter) {
                    memberDetails.attachments.allotmentLetter =
                        this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [
                            userIdString,
                            memberDetails.attachments.allotmentLetter,
                        ]);
                }
                if (memberDetails.attachments.possessionLetter) {
                    memberDetails.attachments.possessionLetter =
                        this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [
                            userIdString,
                            memberDetails.attachments.possessionLetter,
                        ]);
                }
                if (memberDetails.attachments.officeOrder) {
                    memberDetails.attachments.officeOrder =
                        this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [
                            userIdString,
                            memberDetails.attachments.officeOrder,
                        ]);
                }
                if (memberDetails.attachments.transferOrder) {
                    memberDetails.attachments.transferOrder =
                        this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [
                            userIdString,
                            memberDetails.attachments.transferOrder,
                        ]);
                }
            }
            if (memberDetails.otherDocuments) {
                memberDetails.otherDocuments = memberDetails.otherDocuments.map(doc => {
                    if (doc.file) {
                        doc.file = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [userIdString, doc.file]);
                    }
                    return doc;
                });
            }
            // Add cheque photo path
            if (memberDetails.chequeDetails &&
                memberDetails.chequeDetails.chequePhoto) {
                memberDetails.chequeDetails.chequePhoto =
                    this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.USERS, [
                        userIdString,
                        memberDetails.chequeDetails.chequePhoto,
                    ]);
            }
            if (memberDetails.receiptPhoto) {
                memberDetails.receiptPhoto = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.MEMBERSHIPRECEIPT, [approvedByString || '', memberDetails.receiptPhoto]);
            }
            return {
                memberDetails,
                is_Member: userData === null || userData === void 0 ? void 0 : userData.is_Member,
                user_name: userData === null || userData === void 0 ? void 0 : userData.user_name,
            };
        });
    }
    allowedQueryParams() {
        const allowedFields = {
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
    searchableFieldsInSearchParams(queryParams) {
        // ✅ Disable fuzzy search if explicitly set to false
        if ((queryParams === null || queryParams === void 0 ? void 0 : queryParams.isSelectionFuzzy) === 'false') {
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
            if (queryParams === null || queryParams === void 0 ? void 0 : queryParams[field]) {
                queryParams.search = queryParams[field];
                delete queryParams[field];
                return [field]; // Only search in this field
            }
        }
        // ✅ Default: search across all fields
        return searchableFields;
    }
    getPaginatedMembers(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedParams = (0, paginationService_1.parsePaginationParams)(queryParams);
            const { skip, limit, sort } = (0, paginationService_1.generatePaginationOptions)(parsedParams);
            const q = queryParams;
            const searchableFields = this.searchableFieldsInSearchParams(q);
            const dynamicMatch = Object.assign({}, (0, paginationService_1.buildMatchStage)(q, this.allowedQueryParams(), searchableFields));
            console.log(q, 'q');
            console.log(dynamicMatch, 'dynamicMatch');
            const memberList = yield MembersRegistrastionForm_1.default.aggregate([
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
            const paginatedResponse = yield (0, paginationService_1.generatePaginatedResponse)(parsedParams, MembersRegistrastionForm_1.default, dynamicMatch);
            return Object.assign(Object.assign({}, paginatedResponse), { memberList });
        });
    }
}
exports.MembershipFormService = MembershipFormService;
