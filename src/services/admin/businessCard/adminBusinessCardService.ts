import { ObjectId } from "mongoose";
import BusinessCardModel from "../../../models/BusinessCard";
import MembershipModel from "../../../models/MembersRegistrastionForm";
import User from "../../../models/User";
import { IBusinessCardBody, IDigitalCardGalleryBody } from "../../../types/requests";
import ApiError from "../../../utils/ApiError";
import { RESPONSE_CODE } from "../../../utils/constants";
import DigitalCardGalleryModel from "../../../models/DigitalCardGallery";

export class AdminBusinessCardService{

    async  getBusinessCardList(): Promise<any> {
   
            // Fetch all business cards
            const businessCards = await BusinessCardModel.find();
    
            if (!businessCards.length) {
                return { message: "No business cards found." };
            }
    
            // Group business cards by userId
            const userIds = [...new Set(businessCards.map(card => card.userId.toString()))];
    
            // Fetch user details
            const users = await User.find({ _id: { $in: userIds } });
            const userMap = new Map(users.map(user => [user._id.toString(), user.email]));
    
            // Fetch membership details
            const memberships = await MembershipModel.find({ userId: { $in: userIds } });
            const membershipMap = new Map(memberships.map(mem => [mem.userId.toString(), mem.membership_Id]));
    
            // Prepare the response
            return userIds.map(userId => {
                const businessCard = businessCards.find(card => card.userId.toString() === userId);
                return {
                    businessCardId: businessCard?._id,
                    userEmail: userMap.get(userId) || null,
                    userId:businessCard?.userId,
                    membershipId: membershipMap.get(userId) || null
                };
            });
    
    }

      async createBusinessCardAdmin(
        payload: Partial<IBusinessCardBody>,
        user_id: ObjectId,
        file: any
      ): Promise<IBusinessCardBody> {
        const profileImage = file ? file.filename : null;
    
        const updatedPayload = {
          ...payload,
          userId: user_id,
          created_by:user_id,
          profilePhoto: profileImage,
          active: true,
        };
        console.log(updatedPayload, "updatedPayload");
    
        return await BusinessCardModel.create(updatedPayload);
      }

    
    


}