import { JwtPayload } from 'jsonwebtoken';

import { IUser } from '../../../types/models';
import ApiError from '../../../utils/ApiError';
import {
  ACCOUNT_STATUS,
  cryptoTokenExpiry,
  cryptoTokenLength,
  RESPONSE_CODE,
  USER_TYPE,
} from '../../../utils/constants';
import BaseAuthService from '../../authService';
import PasswordService from '../../passwordService';
import { AdminTokenService } from '../../tokenService';
import AdminService from '..';
import User from '../../../models/User';
import { generateResetPasswordTokenURL } from '../../../utils/helper';
import { ResetPasswordEmailService, SendMailToUser } from '../../emailService';
import {
  IAdminGenerateNewPasswordBody,
  IUpdateSubAdminOrUserBody,
} from '../../../types/requests';
import { ObjectId } from 'mongoose';
import { log } from 'node:console';

class AdminAuthService extends BaseAuthService {
  private tokenService: AdminTokenService;
  private passwordService: PasswordService;
  private adminService: AdminService;
  private sendMailToUserService: SendMailToUser;
  constructor() {
    super();
    this.tokenService = new AdminTokenService();
    this.passwordService = new PasswordService();
    this.adminService = new AdminService();
    this.sendMailToUserService = new SendMailToUser();
  }
  //seeder
  async register(userData: Partial<IUser>): Promise<IUser | void> {
    const admin = await this.adminService.findAdminByEmail(userData.email);

    // check existing admin
    if (admin) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Admin Alredy Exist',
        {},
        false
      );
    }
    // hash user password
    if (userData.password) {
      userData.password = await this.passwordService.hashPassword(
        userData.password
      );
    }

    const newUser = this.adminService.prepareNewUser(userData);
    //return await this.adminService.UserModel.create(newUser);
    return await User.create(newUser);
  }

  //Sub Admin Created by User
  async subAdminRegister(
    userData: Partial<IUser>,
    createdById: ObjectId
  ): Promise<IUser | any> {
    console.log(userData, 'userData');

    // --- Case 1: Check SubAdmin by Email (must be unique) ---
    if (userData.user_type == 2 && !userData.user_name) {
      const subAdmin = await User.findOne({
        email: userData.email,
        user_type: 2,
      });

      if (subAdmin) {
        throw new ApiError(
          RESPONSE_CODE.UNAUTHORIZED,
          'Sub Admin Already Exist',
          {},
          false
        );
      }
    }

    // --- Case 2: If registering a User (user_type = 3), check unique user_name ---
    if (userData.user_type == 3 && userData.user_name) {
      const user = await User.findOne({
        user_name: userData.user_name,
        user_type: 3,
      });

      if (user) {
        throw new ApiError(
          RESPONSE_CODE.UNAUTHORIZED,
          'User Already Exist',
          {},
          false
        );
      }
    }

    // --- Hash password ---
    if (userData.password) {
      userData.password = await this.passwordService.hashPassword(
        userData.password
      );
    }

    // --- Create SubAdmin or User ---
    const newUser = this.adminService.prepareNewSubAdmin(userData, createdById);
    return await User.create(newUser);
  }

  async login(userData: Partial<IUser>) {
    const user = await this.adminService.findAdminByEmail(userData.email);
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Invalid Email or Password',
        {},
        false
      );
    }

    if (user.account_status != ACCOUNT_STATUS.ACTIVE) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Account Inactive',
        {},
        false
      );
    }

    const dbPassword = user.password;
    const inputPassword = userData.password as string;
    const userId = user._id;

    // Verify user password
    const verifyPassword = await this.passwordService.verifyPassword(
      inputPassword,
      dbPassword
    );
    if (!verifyPassword) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Invalid Email or Password',
        {},
        false
      );
    }

    const accessToken = this.tokenService.generateAdminAccessToken({
      userId: userId.toString(),
    });
    const adminProfile = (await this.adminService.getAdminProfile(
      userId.toString()
    )) as object;

    return {
      token: {
        accessToken: accessToken,
      },
      ...adminProfile,
    };
  }

  async adminLogout(token: string) {
    const validToken: JwtPayload =
      this.tokenService.verifyAdminAccessToken(token);
    const expiryTime = validToken?.exp as number;
    this.logout(token, expiryTime);
  }

  async sendPasswordResetEmail(email: string) {
    //Find User in DB
    const user = await this.adminService.findAdminByEmail(email);
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Email not found',
        {},
        false
      );
    }

    // Generate ResetPassword Token
    const resetPasswordToken =
      this.tokenService.generateCryptoToken(cryptoTokenLength);
    const expiryDate = this.tokenService.createCryptoTokenExpiry(
      cryptoTokenExpiry.duration,
      cryptoTokenExpiry.unit
    );

    //Update token in DB and add new expiry
    await this.adminService.updateRestPasswordTokenAndExpiry(
      email,
      resetPasswordToken,
      expiryDate
    );

    //Generate Token URL
    const resetPasswordURL = generateResetPasswordTokenURL(resetPasswordToken);

    /// Send Email
    const resetPasswordEmailService = new ResetPasswordEmailService();
    try {
      await resetPasswordEmailService.sendResetPasswordEmail(
        email,
        resetPasswordURL
      );
    } catch (error) {
      await this.adminService.clearResetPasswordToken(user.email);
      console.error('Error sending password reset email:', error);
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        'Failed to send password reset email',
        {},
        false
      );
    }
  }

  async verifyPasswordReset(token: string, newPassword: string) {
    // Find the user with the given reset password token
    const user = await this.adminService.findUserByResetPasswordToken(token);
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Invalid or expired password reset token',
        {},
        false
      );
    }
    // Check if the token has expired
    const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(
      user.reset_password_token_expiry
    );
    if (isTokenExpired) {
      await this.adminService.clearResetPasswordToken(user.email);
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Password reset token has expired',
        {},
        false
      );
    }
    // Hash the new password
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    // Update the admin's password and clear the reset token and expiry
    await this.adminService.updateUserPassword(hashedPassword, user.user_name);
    await this.adminService.clearResetPasswordToken(user.email);
    return true;
  }

  // async getSubAdminList() {
  //   const subAdmins = await User.aggregate([
  //     {
  //       $match: { user_type: 2 } // Filtering only Sub-Admins
  //     },
  //     {
  //       $lookup: {
  //         from: "roles", // Assuming 'roles' is the collection storing role details
  //         localField: "roleName.role_Name",
  //         foreignField: "_id",
  //         as: "roleDetails"
  //       }
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         email: 1,
  //         account_status: 1,
  //         createdAt: 1,
  //         roleDetails: { _id: 1, roleName: 1 }, // Include role name from populated data
  //         userType: {
  //           $switch: {
  //             branches: [
  //               { case: { $eq: ["$user_type", 1] }, then: "SUPER_ADMIN" },
  //               { case: { $eq: ["$user_type", 2] }, then: "SUB_ADMIN" },
  //               { case: { $eq: ["$user_type", 3] }, then: "USER" }
  //             ],
  //             default: "Unknown"
  //           }
  //         }
  //       }
  //     }
  //   ]);

  //   return subAdmins;
  // }

  async getSubAdminList() {
    const subAdmins = await User.aggregate([
      {
        $match: { user_type: 2 }, // Filtering only Sub-Admins
      },
      {
        $lookup: {
          from: 'roles', // Assuming 'roles' is the collection storing role details
          localField: 'roleName.role_Name',
          foreignField: '_id',
          as: 'roleDetails',
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          account_status: 1,
          createdAt: 1,
          roleName: {
            $map: {
              input: '$roleName',
              as: 'role',
              in: {
                _id: '$$role._id',
                role_Name: '$$role.role_Name',
                actions: '$$role.actions',
              },
            },
          }, // Include roleName array with actions and IDs
          userType: {
            $switch: {
              branches: [
                { case: { $eq: ['$user_type', 1] }, then: 'SUPER_ADMIN' },
                { case: { $eq: ['$user_type', 2] }, then: 'SUB_ADMIN' },
                { case: { $eq: ['$user_type', 3] }, then: 'USER' },
              ],
              default: 'Unknown',
            },
          },
        },
      },
    ]);

    return subAdmins;
  }

  async updateSubAdminOrUser(
    userData: Partial<IUpdateSubAdminOrUserBody>,
    userId: string
  ): Promise<IUpdateSubAdminOrUserBody | any> {
    // const admin = await this.adminService.findAdminByEmail(userData.email);
    const admin = await User.findById(userId);
    // check existing admin
    if (!admin) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Sub Admin Not Found',
        {},
        false
      );
    }
    // hash user password
    if (userData.password) {
      userData.password = await this.passwordService.hashPassword(
        userData.password
      );
    }

    const updatedUserData = this.adminService.updateSubAdminOrUser(userData);

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    });
    return updatedUser;
  }

  async generateNewUserPassword(
    payload: IAdminGenerateNewPasswordBody
  ): Promise<void> {
    const userId = payload?.userId;
    const password = payload?.newPassword?.trim();
    const user = await User.findById(userId);
    if (user?.user_type === USER_TYPE.SUPER_ADMIN) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'Super Admin cannot change password',
        {},
        false
      );
    }
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'User not found',
        {},
        false
      );
    }
    if (user.account_status === ACCOUNT_STATUS.DEACTIVATED) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        'User account is inactive',
        {},
        false
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.adminService.updateUserPassword(hashedPassword, user.user_name);

    await this.sendMailToUserService.sendNewPasswordMail(
      user.email,
      user.user_name,
      password
    );
  }
}

export default AdminAuthService;
