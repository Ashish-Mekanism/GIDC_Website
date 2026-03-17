import { Router } from "express";
import validateRequest from "../../../middlewares/validate";
import uservalidations from "../../../validations/userValidationss";
import authController from "../../../controllers/user/authController";
import { uploadNone } from "../../../utils/helper";
import { userAuth } from "../../../middlewares/auth";
import commonValidations from "../../../validations/commonValidations";


const router = Router();

router.post(
  '/login',
  uploadNone(),
  validateRequest(uservalidations.loginUserSchema),
  authController.loginUser
);

router.post('/logout', userAuth.authenticate, authController.logoutUser);

router.post(
  '/register',
  uploadNone(),
  validateRequest(uservalidations.registerUserSchema),
  authController.registerUser
);


router.post('/verify-email', authController.verifyEmail)

router.post(
  '/request-password-forgot',
  uploadNone(),
  validateRequest(commonValidations.sendPasswordForgotEmailSchema),
  authController.sendPasswordForgotEmailUser
);

router.post(
  '/verify-password-forgot',
  uploadNone(),
  validateRequest(commonValidations.verifyPasswordForgotSchema),
  authController.verifyForgotPasswordTokenUser
);

router.post(
  '/reset-password',
  uploadNone(), userAuth.authenticate,
  validateRequest(commonValidations.resetPasswordSchema),
  authController.resetPassword
);


export default router;