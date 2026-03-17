import Joi from 'joi';
import commonValidations from '../commonValidations';
import { DEFAULT_PASSWORD_LENGTH } from '../../utils/constants';

const adminLoginSchema = {
  body: Joi.object().keys({
    password: commonValidations.passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
    email: commonValidations.emailValidator.required(),
  }),
  params: Joi.object(),
  query: Joi.object(),
};
const generateNewUserPasswordSchema = {
  body: Joi.object().keys({
    newPassword: commonValidations.passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
    userId: commonValidations.objectIdValidator.required(),
  }),
  params: Joi.object(),
  query: Joi.object(),
};

export default {
  adminLoginSchema,
  generateNewUserPasswordSchema,
};
