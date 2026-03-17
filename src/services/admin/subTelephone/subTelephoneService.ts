import { ObjectId } from "mongoose";
import SubTelephone from "../../../models/SubTelephone";
import ApiError from "../../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../../utils/constants";
import { ISubTelephoneBody } from "../../../types/requests";
import { toObjectId } from "../../../utils/helper";
import { ISubTelephone } from "../../../types/models";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import Telephone from "../../../models/Telephone";
import path from "path";

export class SubTelephoneService {
    fileHelper = new FileHelper();
    fileService = new FileService();


    async createSubTelephone(payload: any, userId: ObjectId, file: any) {

        const { Name, Address, Contact1, Contact2, TelephoneModelId } = payload;

        const TelephoneExist = await Telephone.findById(TelephoneModelId)
        if(!TelephoneExist){
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Telephone Does not Exist");
        }

        if (!Name || !Address || !Contact1 || !TelephoneModelId) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
        }

        const newSubTelephone = new SubTelephone({
            Name,
            Address,
            Contact1,
            Contact2,
            TelephoneModelId,
            CreatedBy: userId,
            Photo: file.filename // Ensure fileName is passed correctly
        });

        await newSubTelephone.save();

        return newSubTelephone;

    }


    async updateSubTelephone(
        payload: Partial<ISubTelephoneBody>,
        subTelephoneId: string,
        file: any
    ): Promise<ISubTelephoneBody> {
        console.log(file, "Received file object");

        // Find existing business card
        const subTelephone = await SubTelephone.findById(
            toObjectId(subTelephoneId)
        );
        if (!subTelephone) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Sub Telephone not found",
                {},
                false
            );
        }

        // Prepare old file path for deletion if it exists
        // let oldFilePath = businessCard.profilePhoto
        //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
        //   : null;
        let oldFilePath = `uploads/telephone/${subTelephone.CreatedBy}/${subTelephone.Photo}`;
        let newPhoto = file ? file.filename : subTelephone.Photo;

        console.log(oldFilePath, "oldFilePath");

        // Update payload
        const updatedPayload = {
            ...payload,
            Photo: newPhoto,
        };

        // Update business card in database
        const updatedSubTelephone = (await SubTelephone.findByIdAndUpdate(
            subTelephoneId,
            updatedPayload,
            { new: true }
        ).lean()) as ISubTelephone;

        // Delete old profile photo if a new one is uploaded
        if (file && subTelephone.Photo) {
            // Check if oldFilePath exists before deleting
            if (oldFilePath) {
                await this.fileHelper.deleteFile(oldFilePath);
            }
        }

        return updatedSubTelephone;
    }

    async getSubTelephoneList(TelephoneModelId: string): Promise<any> {
        const subTelephones = await SubTelephone.find({ TelephoneModelId }).lean();
        const TelephoneData= await Telephone.findById(TelephoneModelId)

        return {
            Title: TelephoneData?.Title || null, // Place Title outside the data array
            data: subTelephones.map(subTelephone => ({
                ...subTelephone,
                PhotoUrl: typeof subTelephone.Photo === "string"
                    ? this.fileService.getFilePathFromDatabase(
                        FOLDER_NAMES.TELEPHONEPHOTO,
                        [subTelephone.CreatedBy.toString(), subTelephone.Photo]
                    )
                    : null // Handle cases where Photo is missing
            }))
        };
    }

    async getTelephoneWithSubList(): Promise<any> {
        // Retrieve all telephones
        const telephones = await Telephone.find().lean();
    
        // Map through each telephone to fetch corresponding sub-telephones
        const updatedTelephones = await Promise.all(telephones.map(async (telephone) => {
            const subTelephones = await SubTelephone.find({ TelephoneModelId: telephone._id }).lean();
    
            return {
                Title: telephone.Title || null,
                subTelephones: subTelephones.map(subTelephone => ({
                    ...subTelephone,
                    PhotoUrl: typeof subTelephone.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(
                            FOLDER_NAMES.TELEPHONEPHOTO,
                            [subTelephone.CreatedBy.toString(), subTelephone.Photo]
                        )
                        : null // Handle cases where Photo is missing
                }))
            };
        }));
    
        return updatedTelephones;
    }
    

     async deleteSubTelephone(subTelephoneId: string): Promise<any> {
            // Fetch the document from the database
            const subTelephone = await SubTelephone.findById(subTelephoneId);
    
            if (!subTelephone) {
                throw new ApiError(
                    RESPONSE_CODE.NOT_FOUND,
                    "Sub Telephone not found"
                );
            }
    
            // Extract user ID and photo filename
            const userId = subTelephone.CreatedBy.toString();
            const photoFileName = subTelephone.Photo;
    
            // Construct the file path for the photo
            const filePath = path.join("uploads", "telephone", userId, photoFileName);
            await this.fileHelper.deleteFile(filePath);
    
            // Delete the document from the database
            await SubTelephone.deleteOne({ _id: subTelephoneId });
    
            return {
                success: true,
                message: "Sub Telephone have been deleted successfully",
            };
        }

}