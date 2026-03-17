import multer from 'multer';
import Config from '../config';
import Mongoose from 'mongoose';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
//import { Types } from 'joi';
import { Types } from 'mongoose';
import NocFormModel from '../models/NocNoDue';
import dayjs from 'dayjs';
import User from '../models/User';
import Joi from 'joi';
import { log } from 'console';
import { CustomRequest } from '../types/common';
export const pick = <T, K extends keyof T>(
  object: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce(
    (obj, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    },
    {} as Pick<T, K>
  );
};
export function uploadNone() {
  return multer().none();
}

export function generateResetEmailVerificationTokenURL(
  token: string,
  id: string
) {
  return `${Config.FE_BASE_URL}/login?token=${token}&id=${id}`;
}
export function generateForgotPasswordTokenURL(token: string) {
  return `${Config.FE_BASE_URL}/reset?token=${token}`;
}
export function generateResetPasswordTokenURL(token: string) {
  return `${Config.FE_BASE_URL}/reset?token=${token}`;
}

export const toObjectId = (id: string) => new Mongoose.Types.ObjectId(id);

export const parseBool = (val?: string) => val?.toLowerCase() === 'true';

export const isValidDayjs = (date: string | Date | null) =>
  date && dayjs(date).isValid() ? dayjs(date).toDate() : null;
export const generateFileName = (
  prefix: string,
  originalName: string
): string => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalName);
  return `${prefix}.${uniqueSuffix}${ext}`;
};

// export const generateReferenceNumber = async (): Promise<string> => {
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const nextYear = currentYear + 1;
//   const financialYear = `${currentYear}-${nextYear.toString().slice(-2)}`;

//   // Find the last NOC record for the current financial year
//   const lastRecord = await NocFormModel.findOne({
//     refNo: { $regex: `/${financialYear}$` },
//   }).sort({ createdAt: -1 });

//   let sequenceNumber = 101; // Starting number

//   if (lastRecord && lastRecord.refNo) {
//     // Extract the sequence number from the last reference number
//     const lastRefNo = lastRecord.refNo;
//     const sequencePart = lastRefNo.split('/')[0];
//     const lastSequence = parseInt(sequencePart);

//     if (!isNaN(lastSequence)) {
//       sequenceNumber = lastSequence + 1;
//     }
//   }

//   return Promise.resolve(`${sequenceNumber}/${financialYear}`);
// };




export const generateReferenceNumber = async (): Promise<string> => {
  const now = new Date();
  const month = now.getMonth() + 1; 
  const year = now.getFullYear();

  const fyStartYear = month >= 4 ? year : year - 1;
  const fyEndYear = fyStartYear + 1;
  const financialYear = `${fyStartYear}-${fyEndYear.toString().slice(-2)}`;


  const lastRecord = await NocFormModel.findOne({})
    .sort({ createdAt: -1 })
    .select("refNo");

  let sequenceNumber = 101;

  if (lastRecord?.refNo) {
    const lastSequence = parseInt(lastRecord.refNo.split("/")[0], 10);

    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }

  return `${sequenceNumber}/${financialYear}`;
};

export function parseValidDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateUniqueUsernameUsingEmail(
  email: string,
  maxAttempts = 100
) {
  // Validate email format
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }

  // Clean and prepare base name
  let baseName = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove special characters, keep only alphanumeric

  // If base name is too short, generate a random string-based username
  if (baseName.length < 2) {
    console.log(
      '⚠️ Email username part too short, generating random string username'
    );

    // Generate a random 6-8 character string + 6-digit number
    const randomStringLength = crypto.randomInt(6, 9); // 6-8 characters
    baseName = generateRandomString(randomStringLength);
    console.log(`📝 Generated random base name: ${baseName}`);
  }

  let attempts = 0;
  let username: string;

  while (attempts < maxAttempts) {
    attempts++;

    // Generate random 6-digit number
    const randomNum = crypto.randomInt(100000, 999999);
    username = `${baseName}${randomNum}`;

    try {
      // Check DB for uniqueness
      const exists = await User.exists({ username }); // Uncomment when using with your User model

      if (!exists) {
        console.log(`✅ Found unique username after ${attempts} attempt(s)`);
        return username;
      } else {
        console.log(`🔄 Username ${username} already exists, trying again...`);
      }
    } catch (error) {
      console.error('Database error while checking username:', error);
      throw new Error('Database error during username generation');
    }
  }

  // If we've exhausted max attempts
  throw new Error(
    `Could not generate unique username after ${maxAttempts} attempts`
  );
}

function generateRandomUsername(
  usernameLettersLength: number = 3,
  usernameNumbersLength: number = 3
) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let username = '';

  // Pick 3 random letters
  for (let i = 0; i < usernameLettersLength; i++) {
    username += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Pick 3 random numbers
  for (let i = 0; i < usernameNumbersLength; i++) {
    username += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return username;
}

export async function generateUniqueRandomUsername() {
  let username = generateRandomUsername();
  while (await User.exists({ username })) {
    username = generateRandomUsername();
  }
  return username;
}

export const isValidEmail = (emailTo: string): boolean => {
  const emailSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .required();
  const { error } = emailSchema.validate(emailTo);
  return !error;
};

export const resolveNocUserFolder = async (req:CustomRequest, res:any, next:any) => {
  try {
    const nocId = req.params.id;

console.log(nocId,'nocid');

    if (nocId) {
      const nocRecord = await NocFormModel.findById(nocId).select("userId");

      if (nocRecord?.userId) {
        req.nocUserId = nocRecord.userId.toString(); // correct folder owner
      }
    }

    // fallback for safety
    if (!req.nocUserId) {
     // req.nocUserId = req.user?._id?.toString() || "unknown";
     console.log(req.user_id,"req.user_id in resolveNocUserFolder");
     
     req.nocUserId =  req.user_id && req.user_id.toString();
  
    }

    next();
  } catch (error) {
    console.error("resolveNocUserFolder error:", error);

    req.nocUserId = req.user?._id?.toString() || "unknown";
    next();
  }
};

export function extractDot(prefix: string, data: any) {
  const obj: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith(prefix + ".")) {
      const inside = key.substring(prefix.length + 1); // example: name
      obj[inside] = value;
      delete data[key]; // remove so it doesn't get assigned to noc[key]
    }
  }
  return obj;
}
