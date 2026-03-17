"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const UserSchema = new mongoose_1.Schema({
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
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
    },
    is_Member: {
        type: Boolean,
    },
    // is_Admin: {
    //   type: Boolean,
    // },
    user_type: {
        type: Number,
        enum: Object.values(constants_1.USER_TYPE),
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
        enum: Object.values(constants_1.MEMBER_APPROVAL_STATUS),
        //default: MEMBER_APPROVAL_STATUS.PENDING,
    },
    account_status: {
        type: Number,
        enum: Object.values(constants_1.ACCOUNT_STATUS),
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
                enum: Object.values(constants_1.ROLE_PERMISSION),
            },
            actions: [
                {
                    type: [String],
                    enum: Object.values(constants_1.ACTIONS),
                },
            ],
        },
    ],
}, { timestamps: true });
const User = (0, mongoose_1.model)(constants_1.DbModel.User, UserSchema);
exports.default = User;
