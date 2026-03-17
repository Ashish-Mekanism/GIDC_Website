import { ObjectId } from "mongoose";
import { IAboutBody } from "../../types/requests";
import About from "../../models/About";
import ApiError from "../../utils/ApiError";
import { RESPONSE_CODE } from "../../utils/constants";
import { toObjectId } from "../../utils/helper";
import { IAbout } from "../../types/models";

export class AboutService {


    async createAbout(payload: Partial<IAboutBody>, userId: ObjectId) {
        const { Paragraph1, Paragraph2, Paragraph3 } = payload;

        const aboutExist = await About.findOne();

        if (aboutExist) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'About' entry already exists. You cannot create another one.");
        }

        // Validate required fields
        // if (!Paragraph1 || !Paragraph2) {
        //     throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Title and Description are mandatory.");
        // }

        // Prepare the new PresidentMessage document
        const newAbout = new About({
            Paragraph1,
            Paragraph2,
            Paragraph3,
            CreatedBy: userId,
        });

        // Save the document
        await newAbout.save();

        return newAbout;
    }


    async updateAbout(
        payload: Partial<IAboutBody>,
        aboutId: string,
    ): Promise<IAboutBody> {
        // Find existing business card
        const contactUsData = await About.findById(
            toObjectId(aboutId)
        );
        if (!contactUsData) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "About not found",
                {},
                false
            );
        }

        // Update payload
        const updatedPayload = {
            ...payload,
        };

        // Update business card in database
        const updatedAbout = (await About.findByIdAndUpdate(
            aboutId,
            updatedPayload,
            { new: true }
        ).lean()) as IAbout;


        return updatedAbout;
    }


    async getAbout(): Promise<any> {

        // Fetch all Quick Links
        const about = await About.find().lean();

        if (!about) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'About' Not Found.");
        }

        // Prepare the response
        const response = about;

        return response;

    }


}