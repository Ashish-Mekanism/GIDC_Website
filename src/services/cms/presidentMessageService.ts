import { ObjectId } from "mongoose";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import { IPresidentMessageBody } from "../../types/requests";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import PresidentMessage from "../../models/PresidentMessage";
import { toObjectId } from "../../utils/helper";
import { IPresidentMessage } from "../../types/models";
import path from "path";

export class PresidentMessageService {

    fileHelper = new FileHelper();
    fileService = new FileService();


    async createPresidentMessage(payload: Partial<IPresidentMessageBody>, userId: ObjectId, file?: Express.Multer.File) {
        const { Title, Sub_Title, Description } = payload;

        // Validate required fields
        if (!Title || !Description) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title and Description are mandatory.");
        }

        // Prepare the new PresidentMessage document
        const newPresidentMessage = new PresidentMessage({
            Title,
            Sub_Title: Sub_Title || "", // Default to an empty string if not provided
            Description,
            CreatedBy: userId,
            Photo: file ? file.filename : "", // Set photo filename if file exists
        });

        // Save the document
        await newPresidentMessage.save();

        return newPresidentMessage;
    }

    async getPresidentMessageList(): Promise<any> {

        // Fetch all Quick Links
        const presidentMessageList = await PresidentMessage.find().lean();


        // Prepare the response
        const response = presidentMessageList.map(presidentMessage => ({
            _id: presidentMessage._id,
            Title: presidentMessage.Title,
            Sub_Title: presidentMessage.Sub_Title,
            Description: presidentMessage.Description,
            Photo: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.PRESIDENTPHOTO, [presidentMessage.CreatedBy.toString(), presidentMessage.Photo]),
            createdBy: presidentMessage.CreatedBy,

        }));

        return response;

    }

    async updatePresidentMessage(
        payload: Partial<IPresidentMessageBody>,
        presidentMessageId: string,
        file: any
    ): Promise<IPresidentMessageBody> {
        console.log(file, "Received file object");

        // Find existing business card
        const presidentMessageData = await PresidentMessage.findById(
            toObjectId(presidentMessageId)
        );
        if (!presidentMessageData) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "President Message not found",
                {},
                false
            );
        }


        let oldFilePath = `uploads/presidentPhoto/${presidentMessageData.CreatedBy.toString()}/${presidentMessageData.Photo}`;
        let newPhoto = file ? file.filename : presidentMessageData.Photo;

        console.log(oldFilePath, "oldFilePath");

        // Update payload
        const updatedPayload = {
            ...payload,
            Photo: newPhoto,
        };

        // Update business card in database
        const updatedPresidentMessage = (await PresidentMessage.findByIdAndUpdate(
            presidentMessageId,
            updatedPayload,
            { new: true }
        ).lean()) as IPresidentMessage;

        // Delete old profile photo if a new one is uploaded
        if (file && presidentMessageData.Photo) {
            // Check if oldFilePath exists before deleting
            if (oldFilePath) {
                await this.fileHelper.deleteFile(oldFilePath);
            }
        }

        return updatedPresidentMessage;
    }


    async deletePresidentMessage(presidentMessageId: string): Promise<any> {
        // Fetch the document from the database
        const presidentMessage = await PresidentMessage.findById(presidentMessageId);

        if (!presidentMessage) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "President Message not found"
            );
        }

        // Extract user ID and photo filename
        const userId = presidentMessage.CreatedBy.toString();
        const photoFileName = presidentMessage.Photo;

        // Construct the file path for the photo
        const filePath = path.join("uploads", "presidentPhoto", userId, photoFileName);
        await this.fileHelper.deleteFile(filePath);

        // Delete the document from the database
        await PresidentMessage.deleteOne({ _id: presidentMessageId });

        return {
            success: true,
            message: "President Message and associated photo have been deleted successfully",
        };
    }

}