import { Request, Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler';
import {
  IAdminGenerateNewPasswordBody,
  ILoginUserBody,
  IRegisterUserByAdminBody,
  IResetPasswordRequestBody,
  IUpdateSubAdminOrUserBody,
} from '../../../types/requests';
import { CustomRequest } from '../../../types/common';
import {
  SuccessResponseWithData,
  SuccessResponseWithoutData,
} from '../../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../../utils/constants';
import AdminAuthService from '../../../services/admin/auth';
import { SendMailToUser } from '../../../services/emailService';
import ApiError from '../../../utils/ApiError';
import UserAuthService from '../../../services/user/auth';
import { toObjectId } from '../../../utils/helper';

const adminRegisterUser = asyncHandler(
  async (req: CustomRequest<IRegisterUserByAdminBody>, res: Response) => {
    const adminAuthService = new AdminAuthService();
    const payload = req?.body;
    const createdById = req?.user_id!;
    console.log(payload, 'payload');

    const { email, password, confirmPassword, user_type, user_name } = payload;

    const sendMailToUser = new SendMailToUser();
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'Password and Confirm Password do not match.',
        {},
        false
      );
    }

    const userAuthService = new UserAuthService();

    // Register the User
    const registeredUser = await adminAuthService.subAdminRegister(
      payload,
      createdById
    );
    console.log(registeredUser, 'registeredUser');

    const id = registeredUser?._id.toString();

    const UserEmail = registeredUser?.email;
    //await userAuthService.sendEmailVerificationLink(UserEmail, id)
    await sendMailToUser.sendUserWelcomeMail(UserEmail);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'registerUserSuccess',
      API_RESPONSE_STATUS.SUCCESS,
      registeredUser
    );
  }
);

const adminLogin = asyncHandler(
  async (req: CustomRequest<ILoginUserBody>, res: Response) => {
    const payload = req.body;

    const adminAuthService = new AdminAuthService();
    const loginUser = await adminAuthService.login(payload);
    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'loginAdminSuccess',
      API_RESPONSE_STATUS.SUCCESS,
      loginUser
    );
  }
);
const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  const adminAuthService = new AdminAuthService();
  const token = req.headers.authorization?.split(' ')[1] as string;
  await adminAuthService.adminLogout(token);
  SuccessResponseWithoutData(
    res,
    RESPONSE_CODE.SUCCESS,
    'logoutSuccess',
    API_RESPONSE_STATUS.SUCCESS
  );
});

const adminSendPasswordResetEmail = asyncHandler(
  async (req: CustomRequest<IResetPasswordRequestBody>, res: Response) => {
    const adminAuthService = new AdminAuthService();
    const payload = req.body;
    const email = payload.email;

    await adminAuthService.sendPasswordResetEmail(email);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Reset Password Email Sent Success',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const adminVerifyResetPasswordToken = asyncHandler(
  async (req, res: Response) => {
    const adminAuthService = new AdminAuthService();
    const queryPayload = req.query;
    const bodyPayload = req.body;
    const token = queryPayload.token as string;
    const password = bodyPayload.password as string;
    await adminAuthService.verifyPasswordReset(token, password);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Password Reset Success',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const getSubAdminList = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const adminAuthService = new AdminAuthService();

    const subAdminList = await adminAuthService.getSubAdminList();

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Sub-Admin List Success',
      API_RESPONSE_STATUS.SUCCESS,
      subAdminList
    );
  }
);

const updateSubAdmin = asyncHandler(
  async (req: CustomRequest<IUpdateSubAdminOrUserBody>, res: Response) => {
    const adminAuthService = new AdminAuthService();
    const payload = req?.body;
    const userId = req?.params.id;
    console.log(payload, 'payload');

    const userAuthService = new UserAuthService();

    // Register the User
    const subAdminOrUserUpdated = await adminAuthService.updateSubAdminOrUser(
      payload,
      userId
    );
    console.log(subAdminOrUserUpdated, 'subAdminOrUserUpdated');

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'User/Sub-Admin Updated Successfully',
      API_RESPONSE_STATUS.SUCCESS,
      subAdminOrUserUpdated
    );
  }
);

const generateNewUserPassword = asyncHandler(
  async (req: CustomRequest<IAdminGenerateNewPasswordBody>, res: Response) => {
    const adminAuthService = new AdminAuthService();
    const payload = req?.body;

    await adminAuthService.generateNewUserPassword(payload);

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.CREATED,
      'User Password Generated Successfully',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

export default {
  adminLogin,
  adminLogout,
  adminSendPasswordResetEmail,
  adminVerifyResetPasswordToken,
  adminRegisterUser,
  getSubAdminList,
  updateSubAdmin,
  generateNewUserPassword,
};
