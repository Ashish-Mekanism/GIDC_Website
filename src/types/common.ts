import { Request, Express } from 'express';
import { Schema } from 'joi';

import dayjs from 'dayjs';
import 'multer';

import { ParsedQs } from 'qs'; // This is the default type for the query in Express
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongoose';
import { IUser } from './models';

export interface ErrorResponseType {
  success: boolean;
  code: number;
  message: string;
  errors?: Record<string, unknown>;
  stack?: string;
}

export interface SuccessResponseType<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
}
// ValidationType
export type ValidationSchema = {
  params?: Schema;
  query?: Schema;
  body?: Schema;
};

//// Multer
export type DestinationCallback = (
  error: Error | null,
  destination: string
) => void;
export type FileNameCallback = (error: Error | null, filename: string) => void;

// Custom Request Interface
export interface CustomRequest<
  B = unknown,
  P extends ParamsDictionary = ParamsDictionary,
  Q extends ParsedQs = ParsedQs,
> extends Request {
  body: B;
  // file?: Express.Multer.File;
  // files?:
  //     | Express.Multer.File[]
  //     | { [fieldname: string]: Express.Multer.File[] };
  user?: IUser;
  user_id?: ObjectId;
  account_status?: string;
  is_user?: string;
  is_admin?: string;
  is_host?: string;
  nocUserId?: string;

  params: P; // Typed params
  query: Q; // Typed query
}

export interface ISeeder {
  seed(): Promise<void>;
}

export type FolderStructure = {
  folderName: string;
  childDirectory: FolderStructure[];
};

export interface NodeError extends Error {
  code?: string;
}
export interface IError extends Error {
  name: string;
  message: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface cryptoTokenExpiryType {
  unit: dayjs.ManipulateType;
  duration: number;
}

// types/config.types.ts

export type EmailConfigValue = {
  host: string;
  port: string;
  secure: boolean;
  authUser: string;
  authPassword: string;
  fromName: string;
  fromEmail: string;
  tls_rejectUnauthorized?: boolean;
};

export type SendGridConfigValue = {
  api_key: string;
};

export type ConfigValue = EmailConfigValue | SendGridConfigValue;

export type InitialConfigItem = {
  key: string;
  value: ConfigValue;
};
