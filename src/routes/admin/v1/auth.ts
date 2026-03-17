import { Router } from 'express';
import { uploadNone } from '../../../utils/helper';
import authController from '../../../controllers/admin/v1/authController';
import { adminAuth, adminOrSubAdminAuth } from '../../../middlewares/auth';
import validateRequest from '../../../middlewares/validate';
import adminValidations from '../../../validations/adminValidations';
import commonValidations from '../../../validations/commonValidations';

const router = Router();

router.post(
  '/register',
  uploadNone(),
  adminAuth.authenticate,
  authController.adminRegisterUser
);

router.post(
  '/login',
  uploadNone(),
  validateRequest(adminValidations.adminLoginSchema),
  authController.adminLogin
);

router.post(
  '/logout',
  adminOrSubAdminAuth.authenticate,
  authController.adminLogout
);

router.post(
  '/request-password-reset',
  uploadNone(),
  validateRequest(commonValidations.sendPasswordResetEmailSchema),
  authController.adminSendPasswordResetEmail
);

router.post(
  '/verify-password-reset',
  uploadNone(),
  validateRequest(commonValidations.verifyPasswordResetSchema),
  authController.adminVerifyResetPasswordToken
);

router.get(
  '/subAdminList',
  adminAuth.authenticate,
  authController.getSubAdminList
);

router.put(
  '/subAdmin/:id',
  uploadNone(),
  adminAuth.authenticate,
  authController.updateSubAdmin
);

router.post(
  '/generate-new-user-password',
  uploadNone(),
  adminAuth.authenticate,
  validateRequest(adminValidations.generateNewUserPasswordSchema),

  authController.generateNewUserPassword
);
export default router;
