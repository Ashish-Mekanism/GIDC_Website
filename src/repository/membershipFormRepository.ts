import { ObjectId, Types as MongooaseTypes, Types } from "mongoose";
import MembershipModel from "../models/MembersRegistrastionForm";
import { IBecomeAMemberBody } from "../types/requests";
import { toObjectId } from "../utils/helper";
import ApiError from "../utils/ApiError";
import { RESPONSE_CODE } from "../utils/constants";


export class MembershipFormRepository {

  async findUserById(user_id: ObjectId | string | undefined|MongooaseTypes.ObjectId): Promise<IBecomeAMemberBody | null> {

    if (!user_id) {
      throw new Error("User ID is required.");
    }
    return await MembershipModel.findOne({ userId: user_id });
  }

  async findGstNo(gstNo: string | undefined): Promise<IBecomeAMemberBody | null> {
    return await MembershipModel.findOne({ gstNo })
  }

  async findAmcTenementNo(amcTenementNo: string | undefined): Promise<IBecomeAMemberBody | null> {
    return await MembershipModel.findOne({ amcTenementNo })
  }

  async findudyogAadharNo(udyogAadharNo: string | undefined): Promise<IBecomeAMemberBody | null> {
    return await MembershipModel.findOne({ udyogAadharNo })
  }
  
  async findtorrentServiceNo(torrentServiceNo: string | undefined): Promise<IBecomeAMemberBody | null> {
    return await MembershipModel.findOne({ torrentServiceNo })
  }

  //   async createNewMember(payload: Partial<IBecomeAMemberBody>, user_id: ObjectId): Promise<Partial<IBecomeAMemberBody>> {
  // console.log(payload,"payload");

  //     //const { memberName, plotShedNo, roadNo, companyType, email, phone, mobile, website, productName, companyCategory, gstNo, amcTenementNo, udyogAadharNo } = payload
  //     // const UserId= toObjectId(user_id)
  //     return {

  //       ...payload,
  //       userId: user_id,

  //     };
  //   }

  async updateUserByUserId(user_id: ObjectId|undefined|MongooaseTypes.ObjectId, updatedFields: Partial<IBecomeAMemberBody>) {
    
    if (!user_id) {   
      throw new Error("User ID is required.");
    }
    const user = await MembershipModel.findOneAndUpdate({
      userId: user_id
    }, { $set: updatedFields }, { new: true });
    return user;
  }

}