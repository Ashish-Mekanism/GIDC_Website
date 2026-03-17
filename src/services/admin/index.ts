
import { IUser } from '../../types/models';

import ApiError from '../../utils/ApiError';
import 'multer';
import User from '../../models/User';
import { toObjectId } from '../../utils/helper';
import { UserModelService } from '../model/userModelServices';
import { ACCOUNT_STATUS, ACTIONS, ROLE_PERMISSION, USER_TYPE } from '../../utils/constants';
import mongoose, { ObjectId } from 'mongoose';
import { IUpdateSubAdminOrUserBody } from '../../types/requests';

class AdminService extends UserModelService {

  prepareNewUser(userDetails: Partial<IUser>): Partial<IUser> {
    return {
      user_type: USER_TYPE.SUPER_ADMIN,
      account_status: ACCOUNT_STATUS.ACTIVE,
      email: userDetails.email,
      password: userDetails.password,
  
    };
  }

  // prepareNewSubAdmin(userDetails: Partial<IUser>): Partial<IUser> {
  //   console.log(userDetails, 'userDetailsuserDetailsuserDetails');
  
  //   return {
  //     user_type: userDetails.user_type,
  //     roleName: userDetails.roleName
  //       ?.filter(role => role.role_Name) // Ensure role_Name exists
  //       .map(role => ({
  //         role_Name: role.role_Name // Convert properly
  //       })),
  //     account_status: ACCOUNT_STATUS.ACTIVE,
  //     email: userDetails.email,
  //     password: userDetails.password,
  //     is_Email_Verified:true
  //   };
  // }
  
  prepareNewSubAdmin(userDetails: Partial<IUser>,createdById:ObjectId): Partial<IUser> {
    console.log(userDetails, "userDetails");
  
    return {
      user_type: userDetails.user_type,
      user_name: userDetails.user_name,
      roleName: userDetails.roleName?.map(role => ({
        role_Name: role.role_Name as keyof typeof ROLE_PERMISSION, // Ensure it's a valid role
        actions: role.actions.map(action => action as keyof typeof ACTIONS), // Ensure actions are valid
      })),
      account_status: ACCOUNT_STATUS.ACTIVE,
      email: userDetails.email,
      password: userDetails.password,
      created_by:createdById,
      is_Email_Verified: true, 

      ...(Number(userDetails.user_type) === 3 ? { is_Member: false } : {}),
    };
  }
  
  
  
//   updateSubAdminOrUser(userDetails: Partial<IUser>): Partial<IUser> {
//     console.log(userDetails, 'userDetailsuserDetailsuserDetails');

//       return {
//      // user_type: userDetails.user_type,
//       roleName: userDetails.roleName
//         ?.filter(role => role.role_Name) // Ensure role_Name exists
//         .map(role => ({
//           role_Name: role.role_Name // Convert properly
//         })),
//       password: userDetails.password,
//     };
// }


updateSubAdminOrUser(userDetails: Partial<IUser>): Partial<IUser> {
  console.log(userDetails, "Updating User Details");

  return {
   // ...(userDetails.user_type !== undefined && { user_type: userDetails.user_type }), // Only update if provided
   ...(userDetails.password && { password: userDetails.password }), // Only update if password is provided
    ...(userDetails.roleName && {
      roleName: userDetails.roleName.map(role => ({
        role_Name: role.role_Name as keyof typeof ROLE_PERMISSION, // Ensure valid role
        actions: role.actions.map(action => action as keyof typeof ACTIONS), // Ensure valid actions
      })),
    }),
  };
}


  async findAdminByEmail(email: string | undefined): Promise<IUser | null> {
    return User.findOne({
      email,
      user_type: { $in: [USER_TYPE.SUPER_ADMIN, USER_TYPE.SUB_ADMIN] } 
    
    });
  }
  async getAdminProfile(userId: string) {
    const userProfile = await User.aggregate([
      {
        $match: {
          _id: toObjectId(userId), // Convert to ObjectId
         // is_Admin: true,
         user_type: { $in: [USER_TYPE.SUPER_ADMIN, USER_TYPE.SUB_ADMIN] }, 
        },
      },
      {
        $project: {
          email: 1,
          user_type: 1,
          is_Member: 1,
          roleName:1,
        },
      },
    ]);

    return userProfile.length ? userProfile[0] : null;
  }

  async findActiveUserByUserTypeAndId(
    user_type: number,
    id: mongoose.Types.ObjectId | undefined,

  ) {
    return await this.UserModel.findOne({
      _id: id,
      user_type: USER_TYPE.SUPER_ADMIN,
      //account_status: ACCOUNT_STATUS.ACTIVE,
    });
  }

  async findActiveSubAdminByUserTypeAndId(
    user_type: number | number[],
    id: mongoose.Types.ObjectId | undefined
  ) {
    if (!id) return null; // Handle undefined ID case

    return await this.UserModel.findOne({
      _id: id,
      user_type: { $in: [USER_TYPE.SUPER_ADMIN, USER_TYPE.SUB_ADMIN] },
      account_status: ACCOUNT_STATUS.ACTIVE, 
    });
  }
  //   async updateAdminProfile(
  //     adminId: string,
  //     updateData: IEditAdminProfileBody,
  //     image: Express.Multer.File | undefined
  //   ) {
  //     const mediaService = new MediaService();
  //     const newProfileImage = image?.filename;
  //     try {
  //       const existingUser = await this.UserModel.findById(adminId);
  //       const existingUserProfileImage = existingUser?.profile_image;
  //       if (existingUserProfileImage && newProfileImage) {
  //         await mediaService.deleteFileInDirectory(
  //           FOLDER_NAMES.PROFILE_IMAGES,
  //           existingUserProfileImage
  //         );
  //       }

  //       const updatedData = flatten(
  //         omitBy(
  //           {
  //             first_name: updateData?.first_name,
  //             last_name: updateData?.last_name,
  //             profile_image: newProfileImage,
  //           },
  //           isNil
  //         )
  //       );

  //       await this.UserModel.updateOne(
  //         {
  //           _id: adminId,
  //         },
  //         updatedData
  //       );
  //       const updatedAdminProfile = await this.getAdminProfile(adminId);

  //       return updatedAdminProfile;
  //     } catch (error) {
  //       if (image) mediaService.deleteFile(image.path);
  //       if (error instanceof ApiError)
  //         throw new ApiError(error.statusCode, error.message);
  //       if (error instanceof Error) throw new Error(error.message);
  //     }
  //   }


  // projectFields(fields: (keyof IUser)[]) {
  //     const projection: { [key: string]: number } = {};

  //     fields.forEach((field) => {
  //       projection[field] = 1;
  //     });

  //     return {
  //       $project: projection,
  //     };
  //   }
}

export default AdminService;
