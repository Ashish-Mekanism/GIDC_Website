import { ObjectId } from "mongoose";
import { IAdminContactUsBody } from "../../types/requests";
import AdminContactUs from "../../models/AdminContactUs";
import ApiError from "../../utils/ApiError";
import { RESPONSE_CODE } from "../../utils/constants";
import { toObjectId } from "../../utils/helper";
import { IAdminContactUs } from "../../types/models";

export class AdminContactUsService {

    async createContactUs(payload: Partial<IAdminContactUsBody>, userId: ObjectId) {

        const existingContact = await AdminContactUs.findOne();

        if (existingContact) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "A 'Contact Us' entry already exists. You cannot create another one.");
        }

        const {
            Address,
            PhoneNumber,
            Email,
            Linkedin,
            Facebook,
            Twitter, } = payload;

        // Prepare the new businessBulletin document
        const newBusinessBulletin = new AdminContactUs({
            Address,
            PhoneNumber,
            Email,
            Linkedin,
            Facebook,
            Twitter,
            CreatedBy: userId,
        });

        // Save the document
        await newBusinessBulletin.save();

        return newBusinessBulletin;
    }

    async getContactUs(): Promise<any> {

        // Fetch all Quick Links
        const adminContactUs = await AdminContactUs.find().lean();

        if (!adminContactUs) {
            throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Contact Us' Not Found.");
        }

        // Prepare the response
        const response = adminContactUs;

        return response;

    }

    async updateContactUs(
        payload: Partial<IAdminContactUsBody>,
        contactUsId: string,
    ): Promise<IAdminContactUsBody> {
        // Find existing business card
        const contactUsData = await AdminContactUs.findById(
            toObjectId(contactUsId)
        );
        if (!contactUsData) {
            throw new ApiError(
                RESPONSE_CODE.NOT_FOUND,
                "Contact Us not found",
                {},
                false
            );
        }

        // Update payload
        const updatedPayload = {
            ...payload,
        };

        // Update business card in database
        const updatedContactUs = (await AdminContactUs.findByIdAndUpdate(
            contactUsId,
            updatedPayload,
            { new: true }
        ).lean()) as IAdminContactUs;


        return updatedContactUs;
    }

}