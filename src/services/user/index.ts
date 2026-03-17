import { promises } from 'dns';
import { IUser } from '../../types/models';
import { ACCOUNT_STATUS, USER_TYPE } from '../../utils/constants';
import { UserModelService } from '../model/userModelServices';
import { toObjectId } from '../../utils/helper';
import mongoose, { ObjectId } from 'mongoose';

class UserService extends UserModelService {
  constructor() {
    super();
  }
  prepareNewUser(userDetails: Partial<IUser>): Partial<IUser> {
    return {
      user_name: userDetails.user_name,
      email: userDetails.email,
      password: userDetails.password,
      // membership_Id: userDetails?.membership_Id,
      is_Member: false,
      is_Email_Verified: false,
      account_status: ACCOUNT_STATUS.ACTIVE,
      user_type: USER_TYPE.USER,
      waterConnectionNo: userDetails?.waterConnectionNo,
      plotShedNo: userDetails?.plotShedNo,
      companyName: userDetails?.companyName,
    };
  }
  async findUserByEmail(email: string | undefined): Promise<IUser | null> {
    return await this.UserModel.findOne({
      email,
      user_type: USER_TYPE.USER,
      account_status: ACCOUNT_STATUS.ACTIVE,
    });
  }

  async findActiveUserByEmail(
    email: string | undefined
  ): Promise<IUser | null> {
    return await this.UserModel.findOne({
      email,
      account_status: ACCOUNT_STATUS.ACTIVE,
    });
  }

  async findUserByIdAndToken(
    id: string | undefined,
    token: string
  ): Promise<IUser | null> {
    if (!id || !token) {
      throw new Error('Both id and token must be provided');
    }

    // Convert id to ObjectId
    const objectId = toObjectId(id);

    // Find the user by id and token
    const user = await this.UserModel.findOne({
      _id: objectId,
      email_Verification_Token: token,
    }).exec();

    return user;
  }
  async findById(id: mongoose.Types.ObjectId | undefined) {
    if (!id) {
      throw new Error('ID must be provided');
    }

    // Find the user by ID
    const user = await this.UserModel.findById(id).exec();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUserProfile(userId: string) {
    const objectId = toObjectId(userId);
    const userProfile = await this.UserModel.aggregate([
      {
        $match: {
          _id: objectId,
          //account_status: ACCOUNT_STATUS.ACTIVE,
          // user_type: {
          //   $ne: USER_TYPE.SUPER_ADMIN,
          // },
        },
      },
      {
        $lookup: {
          from: 'webdirectories', // Collection name of WebDirectory
          localField: '_id', // Field in UserModel
          foreignField: 'userId', // Field in WebDirectory
          as: 'webDirectoryInfo', // Output array field
        },
      },
      {
        $unwind: {
          path: '$webDirectoryInfo',
          preserveNullAndEmptyArrays: true, // Keeps users even if no match found
        },
      },

      {
        $lookup: {
          from: 'memberships', // Collection name of WebDirectory
          localField: '_id', // Field in UserModel
          foreignField: 'userId', // Field in WebDirectory
          as: 'membershipsInfo', // Output array field
        },
      },
      {
        $unwind: {
          path: '$membershipsInfo',
          preserveNullAndEmptyArrays: true, // Keeps users even if no match found
        },
      },

      {
        $project: {
          _id: 1,
          email: 1,
          is_Member: 1,
          is_Email_Verified: 1,
          approval_status: 1,
          companyName: '$webDirectoryInfo.companyName', // Add companyName from WebDirectory
          membershipId: '$membershipsInfo.membership_Id',
          user_name: 1,
          waterConnectionNo: 1,
          plotShedNo: 1,
          userCompanyName: '$companyName',
        },
      },
    ]);
    return userProfile.length ? userProfile[0] : null;
  }

  async findActiveUserByUserTypeAndId(
    user_type: number,
    id: mongoose.Types.ObjectId | undefined
  ) {
    return await this.UserModel.findOne({
      _id: id,
      user_type: USER_TYPE.USER,
      account_status: ACCOUNT_STATUS.ACTIVE,
    });
  }

  async findUserName(user_name: string | undefined): Promise<IUser | null> {
    return await this.UserModel.findOne({
      user_name,
      user_type: USER_TYPE.USER,
      account_status: ACCOUNT_STATUS.ACTIVE,
    });
  }
}
export default UserService;
