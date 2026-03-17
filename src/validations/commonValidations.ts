import Joi from 'joi';
import { DEFAULT_PASSWORD_LENGTH } from '../utils/constants';

const emailValidator = Joi.string().email().label('Email').trim();
const passwordValidator = Joi.string().required().label('Password').trim();
const objectIdValidator = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const page = Joi.number().optional().allow('', null);
const perPage = Joi.number().optional().allow('', null);
const searchKey = Joi.string()
  .optional()
  .allow(null, '')
  .regex(/^[^*$\\]+$/);
const sortBy = Joi.string().optional().allow(null, '');
const sortOrder = Joi.number().valid(1, -1).optional().allow(null, '');
const paginationValidator = {
  page,
  perPage,
  searchKey,
  sortBy,
  sortOrder,
};
const sendPasswordForgotEmailSchema = {
  body: Joi.object().keys({
    email: emailValidator.required(),
    user_name: Joi.string().required(),
  }),

  params: Joi.object(),
  query: Joi.object(),
};
const verifyPasswordForgotSchema = {
  body: Joi.object().keys({
    newPassword: passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
    confirmPassword: passwordValidator,
  }),
  params: Joi.object(),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const sendPasswordResetEmailSchema = {
  body: Joi.object().keys({
    email: emailValidator.required(),
  }),

  params: Joi.object(),
  query: Joi.object(),
};

const verifyPasswordResetSchema = {
  body: Joi.object().keys({
    password: passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
  }),
  params: Joi.object(),
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetPasswordSchema = {
  body: Joi.object().keys({
    oldPassword: passwordValidator,
    newPassword: passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
    confirmPassword: passwordValidator.min(DEFAULT_PASSWORD_LENGTH),
  }),
  params: Joi.object(),
  query: Joi.object(),
};
export default {
  emailValidator,
  passwordValidator,
  objectIdValidator,
  sendPasswordForgotEmailSchema,
  verifyPasswordForgotSchema,
  paginationValidator,
  sendPasswordResetEmailSchema,
  verifyPasswordResetSchema,
  resetPasswordSchema,
};
