import { log } from "console";
import EmailService, { SendMailToUser } from "../../services/emailService";
import UserAuthService from "../../services/user/auth";
import { CustomRequest } from "../../types/common";
import { IEmailVerifyBody, ILoginUserBody, IRegisterUserBody, IResetPasswordBody, IResetPasswordRequestBody } from "../../types/requests";
import ApiError from "../../utils/ApiError";
import asyncHandler from "../../utils/asyncHandler";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../utils/responses";
import { Response } from 'express';

const registerUser = asyncHandler(
  async (req: CustomRequest<IRegisterUserBody>, res: Response) => {
    const payload = req.body;
    const { email, password, confirmPassword } = payload

    const sendMailToUser = new SendMailToUser()
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
    const registeredUser = await userAuthService.register(payload);

    const id = registeredUser._id.toString();

    const UserEmail = registeredUser.email
    await userAuthService.sendEmailVerificationLink(UserEmail, id)
    await sendMailToUser.sendUserWelcomeMail(UserEmail)

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'registerUserSuccess',
      API_RESPONSE_STATUS.SUCCESS,
      registeredUser
    );
  }
);

const loginUser = asyncHandler(
  async (req: CustomRequest<ILoginUserBody>, res: Response) => {
    const payload = req.body;
    console.log(payload, "payload");

    const userAuthService = new UserAuthService();
    const loginUser = await userAuthService.login(payload);

    SuccessResponseWithData(
      res,
      RESPONSE_CODE.CREATED,
      'login User Success',
      API_RESPONSE_STATUS.SUCCESS,
      loginUser
    );
  }
);

const logoutUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  const userAuthService = new UserAuthService();
  const token = req['headers']['authorization']?.split(' ')[1] as string;
  await userAuthService.userLogout(token);
  SuccessResponseWithoutData(
    res,
    RESPONSE_CODE.SUCCESS,
    'logout Success',
    API_RESPONSE_STATUS.SUCCESS
  );
});

const verifyEmail = asyncHandler(
  async (req: CustomRequest<IEmailVerifyBody>, res: Response) => {
    const data = req?.query;
    const { token, id } = data


    // Ensure token and id are strings
    if (typeof token !== 'string' || typeof id !== 'string') {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Invalid token or id',
        {},
        false
      );
    }

    console.log(token, "tokenn");
    console.log(id, "ID");


    const userAuthService = new UserAuthService();

    const emailVerified = await userAuthService.verifyUserEmail(token, id)

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.ACCEPTED,
      emailVerified.message,
      API_RESPONSE_STATUS.SUCCESS
    );

  }
);

const sendPasswordForgotEmailUser = asyncHandler(
  async (req: CustomRequest<IResetPasswordRequestBody>, res: Response) => {
    const userAuthService = new UserAuthService();
    const payload = req.body;
    const email = payload.email;
    const user_name= payload.user_name

    await userAuthService.sendPasswordForgotEmail(email,user_name);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      'Reset Password Email Sent Success',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const verifyForgotPasswordTokenUser = asyncHandler(
  async (req, res: Response) => {
    const userAuthService = new UserAuthService();
    const queryPayload = req.query;
    const bodyPayload = req.body;
    const { newPassword, confirmPassword } = bodyPayload
    const token = queryPayload?.token as string;


    // Check if password and confirmPassword match
    if (newPassword !== confirmPassword) {
      throw new ApiError(
        RESPONSE_CODE.CONFLICT,
        'Password and Confirm Password do not match.',
        {},
        false
      );
    }
    const password = newPassword as string;

    await userAuthService.verifyPasswordForgot(token, password);
    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      'passwordResetSuccess',
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);

const resetPassword = asyncHandler(
  async (req: CustomRequest<IResetPasswordBody>, res: Response) => {
    const userAuthService = new UserAuthService();
      const payload = req?.body;
      const userId= req?.user_id
    

     const resetPasswordSuccess= await userAuthService.resetUserPassword(payload,userId);
      SuccessResponseWithoutData(
          res,
          RESPONSE_CODE.SUCCESS,
          resetPasswordSuccess.message,
          API_RESPONSE_STATUS.SUCCESS
      );
  }
);


export default {
  loginUser,
  registerUser,
  verifyEmail,
  logoutUser,
  sendPasswordForgotEmailUser,
  verifyForgotPasswordTokenUser,
  resetPassword,
}