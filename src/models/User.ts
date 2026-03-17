import { Schema, SchemaTypes, model } from 'mongoose';
import {
  ACCOUNT_STATUS,
  ACTIONS,
  DbModel,
  MEMBER_APPROVAL_STATUS,
  ROLE_PERMISSION,
  USER_TYPE,
} from '../utils/constants';
import { IUser } from '../types/models';

const UserSchema: Schema<IUser> = new Schema(
  {
    user_name: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    created_by: {
      type: SchemaTypes.ObjectId,
      ref: DbModel.User,
    },
    is_Member: {
      type: Boolean,
    },
    // is_Admin: {
    //   type: Boolean,
    // },
    user_type: {
      type: Number,
      enum: Object.values(USER_TYPE),
      required: true,
    },
    email_Verification_Token: {
      type: String,
    },
    email_Verification_Token_Expiry: {
      type: Date,
    },
    is_Email_Verified: {
      type: Boolean,
    },
    password_Forgot_Token: {
      type: String,
    },
    password_Forgot_Token_Expiry: {
      type: Date,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_token_expiry: {
      type: Date,
    },
    approval_status: {
      type: Number,
      enum: Object.values(MEMBER_APPROVAL_STATUS),
      //default: MEMBER_APPROVAL_STATUS.PENDING,
    },
    account_status: {
      type: Number,
      enum: Object.values(ACCOUNT_STATUS),
    },
    companyName: {
      type: String,
      required: false,
    },
    plotShedNo: {
      type: String,
      required: false,
    },
    waterConnectionNo: {
      type: String,
      required: false,
    },

    //   roleName: [
    //     {
    //     role_Name: { type: mongoose.Types.ObjectId,
    //       ref: 'Role' }
    //   }
    // ]
    roleName: [
      {
        role_Name: {
          type: String,
          enum: Object.values(ROLE_PERMISSION),
        },
        actions: [
          {
            type: [String],
            enum: Object.values(ACTIONS),
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const User = model<IUser>(DbModel.User, UserSchema);

export default User;
