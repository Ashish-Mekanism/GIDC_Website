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
exports.SponsorshipService = void 0;
const Sponsorship_1 = __importDefault(require("../models/Sponsorship"));
const constants_1 = require("../utils/constants");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const fileHelper_1 = __importDefault(require("./fileService/fileHelper"));
const fileService_1 = __importDefault(require("./fileService/fileService"));
const helper_1 = require("../utils/helper");
class SponsorshipService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createSponsorship(payload, file, CreatedBy) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload, 'payload');
            const updatedPayload = Object.assign(Object.assign({}, payload), { Approved: constants_1.SPONSORSHIP_APPROVAL_STATUS.PENDING, Active: false, Photo: (file === null || file === void 0 ? void 0 : file.filename) || null, CreatedBy });
            return yield Sponsorship_1.default.create(updatedPayload);
        });
    }
    updateSponsorship(payload, sponsorshipId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, 'Received file object');
            // Find existing business card
            const sponsorship = yield Sponsorship_1.default.findById((0, helper_1.toObjectId)(sponsorshipId));
            if (!sponsorship) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Sponsorship not found', {}, false);
            }
            // Prepare old file path for deletion if it exists
            // let oldFilePath = businessCard.profilePhoto
            //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
            //   : null;
            let oldFilePath = `uploads/Sponsorship/${constants_1.FOLDER_NAMES.SPONSORSHIP}/${sponsorship.Photo}`;
            let newPhoto = file ? file.filename : sponsorship.Photo;
            console.log(oldFilePath, 'oldFilePath');
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedSponsorship = (yield Sponsorship_1.default.findByIdAndUpdate(sponsorshipId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && sponsorship.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedSponsorship;
        });
    }
    activeInactiveSponsorship(sponsorshipId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const sponsorship_Id = (0, helper_1.toObjectId)(sponsorshipId);
            const sponsorship = yield Sponsorship_1.default.findById(sponsorship_Id);
            if (!sponsorship) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Sponsorship not found', {}, false);
            }
            console.log(action, 'action received');
            // Determine new status based on the action
            const newStatus = action
                ? constants_1.SPONSORSHIP_STATUS.ACTIVE
                : constants_1.SPONSORSHIP_STATUS.INACTIVE;
            // If user is already in the desired state, return early
            if (sponsorship.Active === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? 'active' : 'deactivated'}.`,
                };
            }
            // Update user status
            yield Sponsorship_1.default.findByIdAndUpdate(sponsorshipId, { Active: newStatus });
            return {
                success: true,
                message: `Sponsorship has been ${action ? 'activated' : 'deactivated'} successfully.`,
            };
        });
    }
    sponsorshipApproval(sponsorship_Id, action, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const sponsorshipId = (0, helper_1.toObjectId)(sponsorship_Id);
            const sponsorship = yield Sponsorship_1.default.findById(sponsorshipId);
            if (!sponsorship) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Sponsorship not found', {}, false);
            }
            // Determine new status based on the action
            let newStatus;
            if (action === constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED) {
                newStatus = constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED;
            }
            else if (action === constants_1.SPONSORSHIP_APPROVAL_STATUS.DECLINED) {
                newStatus = constants_1.SPONSORSHIP_APPROVAL_STATUS.DECLINED;
            }
            else {
                newStatus = constants_1.SPONSORSHIP_APPROVAL_STATUS.PENDING;
            }
            console.log(newStatus, 'newStatus');
            // If user is already in the desired state, return early
            if (sponsorship.Approved === newStatus) {
                return {
                    success: false,
                    message: `Sponsorshipis already ${action === constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED
                        ? 'approved'
                        : action === constants_1.SPONSORSHIP_APPROVAL_STATUS.DECLINED
                            ? 'declined'
                            : 'pending'}.`,
                };
            }
            // Update user status
            yield Sponsorship_1.default.findByIdAndUpdate(sponsorship_Id, {
                Approved: newStatus,
                Amount: amount,
            });
            return {
                success: true,
                message: `Sponsorship has been ${action === constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED
                    ? 'approved'
                    : action === constants_1.SPONSORSHIP_APPROVAL_STATUS.DECLINED
                        ? 'declined'
                        : 'set to pending'} successfully.`,
            };
        });
    }
    getSponsorshipRequestList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all events
            const sponsorships = yield Sponsorship_1.default.find({
                Approved: constants_1.SPONSORSHIP_APPROVAL_STATUS.PENDING,
            }).lean();
            const totalCount = yield Sponsorship_1.default.countDocuments();
            return {
                data: sponsorships.map(sponsorship => (Object.assign(Object.assign({}, sponsorship), { Url: (sponsorship === null || sponsorship === void 0 ? void 0 : sponsorship.Url) || '#', DocumentUrl: typeof sponsorship.Photo === 'string'
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.SPONSORSHIP, [constants_1.FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo])
                        : null }))),
                totalCount: totalCount,
            };
        });
    }
    getSponsorshipApprovedList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all events
            const sponsorships = yield Sponsorship_1.default.find({
                Approved: constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED,
            }).lean();
            const totalCount = yield Sponsorship_1.default.countDocuments();
            return {
                data: sponsorships.map(sponsorship => (Object.assign(Object.assign({}, sponsorship), { Url: (sponsorship === null || sponsorship === void 0 ? void 0 : sponsorship.Url) || '#', DocumentUrl: typeof sponsorship.Photo === 'string'
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.SPONSORSHIP, [constants_1.FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo])
                        : null }))),
                totalCount: totalCount,
            };
        });
    }
    getSponsorshipApprovedAndActiveList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all events
            const sponsorships = yield Sponsorship_1.default.find({
                Approved: constants_1.SPONSORSHIP_APPROVAL_STATUS.APPROVED,
                Active: constants_1.SPONSORSHIP_STATUS.ACTIVE,
            }).lean();
            const totalCount = yield Sponsorship_1.default.countDocuments();
            return {
                data: sponsorships.map(sponsorship => ({
                    // ...sponsorship,
                    Url: (sponsorship === null || sponsorship === void 0 ? void 0 : sponsorship.Url) || '#',
                    Photo: typeof sponsorship.Photo === 'string'
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.SPONSORSHIP, [constants_1.FOLDER_NAMES.SPONSORSHIP, sponsorship.Photo])
                        : null, // Handle cases where Photo is missing
                })),
                totalCount: totalCount,
            };
        });
    }
}
exports.SponsorshipService = SponsorshipService;
