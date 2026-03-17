import { ObjectId } from "mongoose";
import UserService from "..";
import { IUser } from "../../../types/models";
import { IEmailVerifyBody, IResetPasswordBody } from "../../../types/requests";
import ApiError from "../../../utils/ApiError";
import {
  ACCOUNT_STATUS,
  cryptoTokenExpiry,
  cryptoTokenLength,
  RESPONSE_CODE,
} from "../../../utils/constants";
import {
  generateForgotPasswordTokenURL,
  generateResetEmailVerificationTokenURL,
  generateResetPasswordTokenURL,
  toObjectId,
} from "../../../utils/helper";
import { ResetPasswordEmailService, SendMailToUser } from "../../emailService";
//import BaseAuthService from "../../authService";
import PasswordService from "../../passwordService";
import { UserTokenService } from "../../tokenService";
import { JwtPayload } from "jsonwebtoken";
import BaseAuthService from "../../authService";
import User from "../../../models/User";
import bcrypt = require("bcrypt");
class UserAuthService extends BaseAuthService {
  private tokenService: UserTokenService;
  private passwordService: PasswordService;
  private userService: UserService;

  constructor() {
    super();
    this.tokenService = new UserTokenService();
    this.passwordService = new PasswordService();
    this.userService = new UserService();
  }

  async register(userData: Partial<IUser>): Promise<IUser> {
    // const user = await this.userService.findUserByEmail(userData.email);

    const userNameExists = await this.userService.UserModel.findOne({
      user_name: userData.user_name,
    });
    // check existing user
    if (userNameExists) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        "User with same username already exists",
        {},
        false,
      );
    }
    // hash user password
    if (userData.password) {
      userData.password = await this.passwordService.hashPassword(
        userData.password,
      );
    }

    const newUser = this.userService.prepareNewUser(userData);
    return await this.userService.UserModel.create(newUser);
  }

  async login(userData: Partial<IUser>) {
    //const user = await this.userService.findUserByEmail(userData.email);

    const userNameExists = await this.userService.UserModel.findOne({
      user_name: userData.user_name,
    });

    if (!userNameExists) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Invalid Email or Password",
        {},
        false,
      );
    }
    if (userNameExists.account_status === ACCOUNT_STATUS.DEACTIVATED) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Your account is deactivated",
        {},
        false,
      );
    }

    if (!userNameExists?.is_Email_Verified) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Your Email is not verified ",
        {},
        false,
      );
    }

    const dbPassword = userNameExists.password;
    const inputPassword = userData.password as string;
    const userId: string = userNameExists._id.toString();

    // Verify user password
    const verifyPassword = await this.passwordService.verifyPassword(
      inputPassword,
      dbPassword,
    );
    if (!verifyPassword) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Invalid Email or Password",
        {},
        false,
      );
    }

    const accessToken = this.tokenService.generateUserAccessToken({
      userId: userId,
    });

    const userProfile = (await this.userService.getUserProfile(
      userId,
    )) as object;

    return {
      token: {
        accessToken: accessToken,
      },
      ...userProfile,
    };
  }

  async userLogout(token: string) {
    const validToken: JwtPayload =
      this.tokenService.verifyUserAccessToken(token);
    const expiryTime = validToken?.exp as number;
    this.logout(token, expiryTime);
  }

  async sendEmailVerificationLink(UserEmail: string, id: string) {
    //Find User in DB
    // const user = await this.userService.findActiveUserByEmail(UserEmail);
    const user = await this.userService.UserModel.findOne({
      email: UserEmail,
      _id: id,
    });
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Email not found",
        {},
        false,
      );
    }
    // Generate verificationLink Token
    const verificationToken =
      this.tokenService.generateCryptoToken(cryptoTokenLength);
    const expiryDate = this.tokenService.createCryptoTokenExpiry(
      cryptoTokenExpiry.duration,
      cryptoTokenExpiry.unit,
    );

    //Update token in DB and add new expiry
    await this.userService.updateRestEmailVerificationTokenAndExpiry(
      UserEmail,
      verificationToken,
      expiryDate,
      user.user_name,
    );

    //Generate Token URL
    const emailVerificationURL = generateResetEmailVerificationTokenURL(
      verificationToken,
      id,
    );

    /// Send Email
    const sendMailToUser = new SendMailToUser();

    try {
      await sendMailToUser.sendUserEmailVerificationLink(
        UserEmail,
        emailVerificationURL,
        user.user_name,
      );
    } catch (error) {
      await this.userService.clearEmailVerificationToken(user.user_name);
      console.error("Error sending email verification mail:", error);
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        "Failed to sendemail verification mail",
        {},
        false,
      );
    }
  }

  async verifyUserEmail(token: string, id: string) {
    const objectId = toObjectId(id);

    const userExist = await this.userService.findById(objectId as any);
    console.log(userExist, "userExist");

    if (!userExist) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "User not found",
        {},
        false,
      );
    }

    if (userExist?.is_Email_Verified) {
      return { message: "Email is already verified" }; // Return success message
    }

    // Step 1: Find the user with the given ID and token
    const user = await this.userService.findUserByIdAndToken(id, token);
    console.log(user, "user");

    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Invalid email verification token or ID",
        {},
        false,
      );
    }

    // if (!user.email_Verification_Token) {
    //   throw new ApiError(
    //     RESPONSE_CODE.UNAUTHORIZED,
    //     'Email verification token expiry is missing',
    //     {},
    //     false
    //   );
    // }

    // // Step 2: Check if the token has expired
    // const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(
    //   user.email_Verification_Token_Expiry
    // );

    // if (isTokenExpired) {
    //   // Clear the token and expiry
    //   await this.userService.clearEmailVerificationToken(user.email);
    //   throw new ApiError(
    //     RESPONSE_CODE.UNAUTHORIZED,
    //     'Email verification token has expired',
    //     {},
    //     false
    //   );
    // }

    // Step 3: Clear the token and expiry (mark email as verified)
    await this.userService.verifyUserEmail(user._id);

    // Return success
    return { message: "Email successfully verified" };
  }

  async sendPasswordForgotEmail(email: string, user_name: string) {
    //Find User in DB
    // const user = await this.userService.findActiveUserByEmail(email);
    const user = await this.userService.UserModel.findOne({
      email,
      user_name,
    });
    console.log(user, "user");
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Email not found",
        {},
        false,
      );
    }
    // Generate ResetPassword Token
    const forgotPasswordToken =
      this.tokenService.generateCryptoToken(cryptoTokenLength);
    const expiryDate = this.tokenService.createCryptoTokenExpiry(
      cryptoTokenExpiry.duration,
      cryptoTokenExpiry.unit,
    );

    //Update token in DB and add new expiry
    await this.userService.updateForgotPasswordTokenAndExpiry(
      email,
      forgotPasswordToken,
      expiryDate,
      user_name,
    );

    //Generate Token URL
    const resetPasswordURL =
      generateForgotPasswordTokenURL(forgotPasswordToken);

    /// Send Email
    const sendMailToUser = new SendMailToUser();

    try {
      await sendMailToUser.sendUserForgotPasswordLink(
        email,
        resetPasswordURL,
        user.user_name,
      );
    } catch (error) {
      await this.userService.clearForgotPasswordToken(
        user.email,
        user.user_name,
      );
      console.error("Error sending password reset email:", error);
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        "Failed to send password reset email",
        {},
        false,
      );
    }
  }

  async verifyPasswordForgot(token: string, newPassword: string) {
    // Find the user with the given reset password token
    console.log(token, "token");
    console.log(newPassword, "newPassword");

    const user = await this.userService.findUserByForgotPasswordToken(token);
    console.log(user, "   user");

    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Invalid or expired password reset token",
        {},
        false,
      );
    }
    // Check if the token has expired
    const isTokenExpired = this.tokenService.checkCryptoTokenExpiry(
      user.password_Forgot_Token_Expiry,
    );
    if (isTokenExpired) {
      await this.userService.clearForgotPasswordToken(
        user.email,
        user.user_name,
      );
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Password reset token has expired",
        {},
        false,
      );
    }
    // Hash the new password
    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    // Update the user's password and clear the reset token and expiry
    await this.userService.updateUserPassword(hashedPassword, user.user_name);
    await this.userService.clearForgotPasswordToken(user.email, user.user_name);
    return true;
  }

  async resetUserPassword(
    payload: IResetPasswordBody,
    userId: ObjectId | undefined,
  ) {
    if (!userId) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "User ID is required",
        {},
        false,
      );
    }

    // Find user in the database
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "User not found",
        {},
        false,
      );
    }

    // Check if old password matches the stored password
    const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "Old password is incorrect",
        {},
        false,
      );
    }

    // Check if newPassword matches ConfirmPassword
    if (payload.newPassword !== payload.confirmPassword) {
      throw new ApiError(
        RESPONSE_CODE.UNAUTHORIZED,
        "New password and confirm password do not match",
        {},
        false,
      );
    }

    // Hash the new password

    const hashedPassword = await this.passwordService.hashPassword(
      payload.newPassword,
    );

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return { message: "Password reset successfully" };
  }
}

export default UserAuthService;
