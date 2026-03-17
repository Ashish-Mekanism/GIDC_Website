import { Model, ObjectId } from 'mongoose';
import { IUser } from '../../types/models';
import User from '../../models/User';
import { toObjectId } from '../../utils/helper';
import { ACCOUNT_STATUS } from '../../utils/constants';

export class UserModelService {
  //public mediaService: MediaService;
  public UserModel: Model<IUser>;
  constructor() {
    this.UserModel = User;
    // this.mediaService = new MediaService();
  }

  async updateRestEmailVerificationTokenAndExpiry(
    email: string,
    token: string,
    tokenExpiry: string,
    user_name: string
  ) {
    return await this.UserModel.updateOne(
      {
        email,
        user_name,
      },
      {
        email_Verification_Token: token,
        email_Verification_Token_Expiry: tokenExpiry,
      }
    );
  }

  async clearEmailVerificationToken(email: string) {
    return await this.UserModel.updateOne(
      {
        email: email,
      },
      {
        email_Verification_Token: null,
        email_Verification_Token_Expiry: null,
      }
    );
  }

  async verifyUserEmail(userId: ObjectId) {
    await this.UserModel.updateOne(
      { _id: userId },
      {
        $set: { is_Email_Verified: true },
        $unset: {
          email_Verification_Token: 1,
          email_Verification_Token_Expiry: 1,
        },
      }
    );
  }

  protected projectFields(fields: (keyof IUser)[]) {
    const projection: { [key: string]: number } = {};

    fields.forEach(field => {
      projection[field] = 1;
    });

    return {
      $project: projection,
    };
  }
  async updateForgotPasswordTokenAndExpiry(
    email: string,
    token: string,
    tokenExpiry: string,
    user_name: string
  ) {
    return await this.UserModel.updateOne(
      {
        email,
        user_name,
      },
      {
        password_Forgot_Token: token,
        password_Forgot_Token_Expiry: tokenExpiry,
      }
    );
  }
  async clearForgotPasswordToken(email: string, user_name: string) {
    return await this.UserModel.updateOne(
      {
        email: email,
        user_name: user_name,
      },
      {
        password_Forgot_Token: null,
        password_Forgot_Token_Expiry: null,
      }
    );
  }
  async findUserByForgotPasswordToken(token: string) {
    return await this.UserModel.findOne({
      password_Forgot_Token: token,
    });
  }
  async findUserByResetPasswordToken(token: string) {
    return await this.UserModel.findOne({
      reset_password_token: token,
    });
  }

  async updateUserPassword(password: string, user_name: string) {
    return await this.UserModel.updateOne(
      {
        user_name: user_name,
      },
      {
        password: password,
      }
    );
  }
  async updateRestPasswordTokenAndExpiry(
    email: string,
    token: string,
    tokenExpiry: string
  ) {
    return await this.UserModel.updateOne(
      {
        email,
      },
      {
        reset_password_token: token,
        reset_password_token_expiry: tokenExpiry,
      }
    );
  }
  async clearResetPasswordToken(email: string) {
    return await this.UserModel.updateOne(
      {
        email: email,
      },
      {
        reset_password_token: null,
        reset_password_token_expiry: null,
      }
    );
  }
}
