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
exports.CommitteeMemberService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const CommitteeMember_1 = __importDefault(require("../../models/CommitteeMember"));
const helper_1 = require("../../utils/helper");
const Committee_1 = __importDefault(require("../../models/Committee"));
const path_1 = __importDefault(require("path"));
class CommitteeMemberService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createCommitteeMember(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Name, Designation, CommitteeModelId } = payload;
            if (!Name || !Designation || !CommitteeModelId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
            }
            const newCommitteeMember = new CommitteeMember_1.default({
                Name,
                Designation,
                CommitteeModelId,
                CreatedBy: userId,
                Photo: file.filename // Ensure fileName is passed correctly
            });
            yield newCommitteeMember.save();
            return newCommitteeMember;
        });
    }
    updateCommitteeMember(payload, committeeMemberId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const committeeMember = yield CommitteeMember_1.default.findById((0, helper_1.toObjectId)(committeeMemberId));
            if (!committeeMember) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Committee Member not found", {}, false);
            }
            // Prepare old file path for deletion if it exists
            // let oldFilePath = businessCard.profilePhoto
            //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
            //   : null;
            let oldFilePath = `uploads/CommitteeMember/${committeeMember.CreatedBy}/${committeeMember.Photo}`;
            let newPhoto = file ? file.filename : committeeMember.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedCommitteeMember = (yield CommitteeMember_1.default.findByIdAndUpdate(committeeMemberId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && committeeMember.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedCommitteeMember;
        });
    }
    getCommitteeMemberList(CommitteeModelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const committeeMembers = yield CommitteeMember_1.default.find({ CommitteeModelId }).lean();
            const CommitteeData = yield Committee_1.default.findById(CommitteeModelId);
            return {
                Name: (CommitteeData === null || CommitteeData === void 0 ? void 0 : CommitteeData.CommitteeName) || null, // Place Title outside the data array
                data: committeeMembers.map(committeeMember => (Object.assign(Object.assign({}, committeeMember), { PhotoUrl: typeof committeeMember.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.COMMITTEEMEMBER, [committeeMember.CreatedBy.toString(), committeeMember.Photo])
                        : null // Handle cases where Photo is missing
                 })))
            };
        });
    }
    //User Public API
    getAllCommitteeMemberLists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Retrieve all committees
                const committees = yield Committee_1.default.find().lean();
                // Map through each committee to fetch corresponding members
                const updatedCommittees = yield Promise.all(committees.map((committee) => __awaiter(this, void 0, void 0, function* () {
                    // Find members related to the current committee
                    const subMembers = yield CommitteeMember_1.default.find({ CommitteeModelId: committee._id }).lean();
                    // Map and generate PhotoUrl for each member
                    const formattedSubMembers = subMembers.map(member => (Object.assign(Object.assign({}, member), { PhotoUrl: typeof member.Photo === "string"
                            ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.COMMITTEEMEMBER, [member.CreatedBy.toString(), member.Photo])
                            : null // Handle cases where Photo is missing
                     })));
                    return {
                        Title: committee.CommitteeName || null,
                        subMembers: formattedSubMembers
                    };
                })));
                return { success: true, code: 200, message: "Committee List Success", data: updatedCommittees };
            }
            catch (error) {
                console.error("Error fetching committee member lists:", error);
                return { success: false, code: 500, message: "Internal Server Error" };
            }
        });
    }
    deleteCommitteeMember(committeeMemberId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const committeeMember = yield CommitteeMember_1.default.findById(committeeMemberId);
            if (!committeeMember) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Committee Member not found");
            }
            // Extract user ID and photo filename
            const userId = committeeMember.CreatedBy.toString();
            const photoFileName = committeeMember.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "CommitteeMember", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield CommitteeMember_1.default.deleteOne({ _id: committeeMemberId });
            return {
                success: true,
                message: "Committee Member have been deleted successfully",
            };
        });
    }
}
exports.CommitteeMemberService = CommitteeMemberService;
