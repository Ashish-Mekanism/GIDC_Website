import { ObjectId } from "mongoose";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import CommitteeMember from "../../models/CommitteeMember";
import { ICommitteeMemberBody } from "../../types/requests";
import { toObjectId } from "../../utils/helper";
import { ICommitteeMember } from "../../types/models";
import Committee from "../../models/Committee";
import path from "path";



export class CommitteeMemberService {



    fileHelper = new FileHelper();
    fileService = new FileService();


    async createCommitteeMember(payload: any, userId: ObjectId, file: any) {

        const { Name, Designation, CommitteeModelId } = payload;

        if (!Name || !Designation || !CommitteeModelId) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
        }

        const newCommitteeMember = new CommitteeMember({
            Name,
            Designation,
            CommitteeModelId,
            CreatedBy: userId,
            Photo: file.filename // Ensure fileName is passed correctly
        });

        await newCommitteeMember.save();

        return newCommitteeMember;

    }


    async updateCommitteeMember(
        payload: Partial<ICommitteeMemberBody>,
        committeeMemberId: string,
        file: any
    ): Promise<ICommitteeMemberBody> {
        console.log(file, "Received file object");

        // Find existing business card
        const committeeMember = await CommitteeMember.findById(
            toObjectId(committeeMemberId)
        );
        if (!committeeMember) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Committee Member not found",
                {},
                false
            );
        }

        // Prepare old file path for deletion if it exists
        // let oldFilePath = businessCard.profilePhoto
        //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
        //   : null;
        let oldFilePath = `uploads/CommitteeMember/${committeeMember.CreatedBy}/${committeeMember.Photo}`;
        let newPhoto = file ? file.filename : committeeMember.Photo;

        console.log(oldFilePath, "oldFilePath");

        // Update payload
        const updatedPayload = {
            ...payload,
            Photo: newPhoto,
        };

        // Update business card in database
        const updatedCommitteeMember = (await CommitteeMember.findByIdAndUpdate(
            committeeMemberId,
            updatedPayload,
            { new: true }
        ).lean()) as ICommitteeMember;

        // Delete old profile photo if a new one is uploaded
        if (file && committeeMember.Photo) {
            // Check if oldFilePath exists before deleting
            if (oldFilePath) {
                await this.fileHelper.deleteFile(oldFilePath);
            }
        }

        return updatedCommitteeMember;
    }

    async getCommitteeMemberList(CommitteeModelId: string): Promise<any> {
        const committeeMembers = await CommitteeMember.find({ CommitteeModelId }).lean();
        const CommitteeData = await Committee.findById(CommitteeModelId)

        return {
            Name: CommitteeData?.CommitteeName || null, // Place Title outside the data array
            data: committeeMembers.map(committeeMember => ({
                ...committeeMember,
                PhotoUrl: typeof committeeMember.Photo === "string"
                    ? this.fileService.getFilePathFromDatabase(
                        FOLDER_NAMES.COMMITTEEMEMBER,
                        [committeeMember.CreatedBy.toString(), committeeMember.Photo]
                    )
                    : null // Handle cases where Photo is missing
            }))
        };
    }

    //User Public API
    async getAllCommitteeMemberLists(): Promise<any> {
        try {
            // Retrieve all committees
            const committees = await Committee.find().lean();

            // Map through each committee to fetch corresponding members
            const updatedCommittees = await Promise.all(committees.map(async (committee) => {
                // Find members related to the current committee
                const subMembers = await CommitteeMember.find({ CommitteeModelId: committee._id }).lean();

                // Map and generate PhotoUrl for each member
                const formattedSubMembers = subMembers.map(member => ({
                    ...member,
                    PhotoUrl: typeof member.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(
                            FOLDER_NAMES.COMMITTEEMEMBER,
                            [member.CreatedBy.toString(), member.Photo]
                        )
                        : null // Handle cases where Photo is missing
                }));

                return {
                    Title: committee.CommitteeName || null,
                    subMembers: formattedSubMembers
                };
            }));

            return { success: true, code: 200, message: "Committee List Success", data: updatedCommittees };
        } catch (error) {
            console.error("Error fetching committee member lists:", error);
            return { success: false, code: 500, message: "Internal Server Error" };
        }
    }


    async deleteCommitteeMember(committeeMemberId: string): Promise<any> {
        // Fetch the document from the database
        const committeeMember = await CommitteeMember.findById(committeeMemberId);

        if (!committeeMember) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Committee Member not found"
            );
        }

        // Extract user ID and photo filename
        const userId = committeeMember.CreatedBy.toString();
        const photoFileName = committeeMember.Photo;

        // Construct the file path for the photo
        const filePath = path.join("uploads", "CommitteeMember", userId, photoFileName);
        await this.fileHelper.deleteFile(filePath);

        // Delete the document from the database
        await CommitteeMember.deleteOne({ _id: committeeMemberId });

        return {
            success: true,
            message: "Committee Member have been deleted successfully",
        };
    }

}




