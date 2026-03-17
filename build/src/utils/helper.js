"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNocUserFolder = exports.isValidEmail = exports.generateReferenceNumber = exports.generateFileName = exports.isValidDayjs = exports.parseBool = exports.toObjectId = exports.pick = void 0;
exports.uploadNone = uploadNone;
exports.generateResetEmailVerificationTokenURL = generateResetEmailVerificationTokenURL;
exports.generateForgotPasswordTokenURL = generateForgotPasswordTokenURL;
exports.generateResetPasswordTokenURL = generateResetPasswordTokenURL;
exports.parseValidDate = parseValidDate;
exports.generateUniqueUsernameUsingEmail = generateUniqueUsernameUsingEmail;
exports.generateUniqueRandomUsername = generateUniqueRandomUsername;
exports.extractDot = extractDot;
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const NocNoDue_1 = __importDefault(require("../models/NocNoDue"));
const dayjs_1 = __importDefault(require("dayjs"));
const User_1 = __importDefault(require("../models/User"));
const joi_1 = __importDefault(require("joi"));
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
exports.pick = pick;
function uploadNone() {
    return (0, multer_1.default)().none();
}
function generateResetEmailVerificationTokenURL(token, id) {
    return `${config_1.default.FE_BASE_URL}/login?token=${token}&id=${id}`;
}
function generateForgotPasswordTokenURL(token) {
    return `${config_1.default.FE_BASE_URL}/reset?token=${token}`;
}
function generateResetPasswordTokenURL(token) {
    return `${config_1.default.FE_BASE_URL}/reset?token=${token}`;
}
const toObjectId = (id) => new mongoose_1.default.Types.ObjectId(id);
exports.toObjectId = toObjectId;
const parseBool = (val) => (val === null || val === void 0 ? void 0 : val.toLowerCase()) === 'true';
exports.parseBool = parseBool;
const isValidDayjs = (date) => date && (0, dayjs_1.default)(date).isValid() ? (0, dayjs_1.default)(date).toDate() : null;
exports.isValidDayjs = isValidDayjs;
const generateFileName = (prefix, originalName) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path_1.default.extname(originalName);
    return `${prefix}.${uniqueSuffix}${ext}`;
};
exports.generateFileName = generateFileName;
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
const generateReferenceNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const fyStartYear = month >= 4 ? year : year - 1;
    const fyEndYear = fyStartYear + 1;
    const financialYear = `${fyStartYear}-${fyEndYear.toString().slice(-2)}`;
    const lastRecord = yield NocNoDue_1.default.findOne({})
        .sort({ createdAt: -1 })
        .select("refNo");
    let sequenceNumber = 101;
    if (lastRecord === null || lastRecord === void 0 ? void 0 : lastRecord.refNo) {
        const lastSequence = parseInt(lastRecord.refNo.split("/")[0], 10);
        if (!isNaN(lastSequence)) {
            sequenceNumber = lastSequence + 1;
        }
    }
    return `${sequenceNumber}/${financialYear}`;
});
exports.generateReferenceNumber = generateReferenceNumber;
function parseValidDate(value) {
    if (!value)
        return undefined;
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
}
function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function generateUniqueUsernameUsingEmail(email_1) {
    return __awaiter(this, arguments, void 0, function* (email, maxAttempts = 100) {
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
            console.log('⚠️ Email username part too short, generating random string username');
            // Generate a random 6-8 character string + 6-digit number
            const randomStringLength = crypto_1.default.randomInt(6, 9); // 6-8 characters
            baseName = generateRandomString(randomStringLength);
            console.log(`📝 Generated random base name: ${baseName}`);
        }
        let attempts = 0;
        let username;
        while (attempts < maxAttempts) {
            attempts++;
            // Generate random 6-digit number
            const randomNum = crypto_1.default.randomInt(100000, 999999);
            username = `${baseName}${randomNum}`;
            try {
                // Check DB for uniqueness
                const exists = yield User_1.default.exists({ username }); // Uncomment when using with your User model
                if (!exists) {
                    console.log(`✅ Found unique username after ${attempts} attempt(s)`);
                    return username;
                }
                else {
                    console.log(`🔄 Username ${username} already exists, trying again...`);
                }
            }
            catch (error) {
                console.error('Database error while checking username:', error);
                throw new Error('Database error during username generation');
            }
        }
        // If we've exhausted max attempts
        throw new Error(`Could not generate unique username after ${maxAttempts} attempts`);
    });
}
function generateRandomUsername(usernameLettersLength = 3, usernameNumbersLength = 3) {
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
function generateUniqueRandomUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = generateRandomUsername();
        while (yield User_1.default.exists({ username })) {
            username = generateRandomUsername();
        }
        return username;
    });
}
const isValidEmail = (emailTo) => {
    const emailSchema = joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required();
    const { error } = emailSchema.validate(emailTo);
    return !error;
};
exports.isValidEmail = isValidEmail;
const resolveNocUserFolder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const nocId = req.params.id;
        console.log(nocId, 'nocid');
        if (nocId) {
            const nocRecord = yield NocNoDue_1.default.findById(nocId).select("userId");
            if (nocRecord === null || nocRecord === void 0 ? void 0 : nocRecord.userId) {
                req.nocUserId = nocRecord.userId.toString(); // correct folder owner
            }
        }
        // fallback for safety
        if (!req.nocUserId) {
            // req.nocUserId = req.user?._id?.toString() || "unknown";
            console.log(req.user_id, "req.user_id in resolveNocUserFolder");
            req.nocUserId = req.user_id && req.user_id.toString();
        }
        next();
    }
    catch (error) {
        console.error("resolveNocUserFolder error:", error);
        req.nocUserId = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || "unknown";
        next();
    }
});
exports.resolveNocUserFolder = resolveNocUserFolder;
function extractDot(prefix, data) {
    const obj = {};
    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith(prefix + ".")) {
            const inside = key.substring(prefix.length + 1); // example: name
            obj[inside] = value;
            delete data[key]; // remove so it doesn't get assigned to noc[key]
        }
    }
    return obj;
}
