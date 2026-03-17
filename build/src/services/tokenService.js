"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTokenService = exports.UserTokenService = exports.TokenService = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const crypto_1 = __importDefault(require("crypto"));
const dayjs_1 = __importDefault(require("dayjs"));
class TokenService {
    constructor(expiry, secret) {
        this.tokenExpiry = expiry;
        this.tokenSecret = secret;
    }
    static ExtractTokenFromHeader(req) {
        var _a;
        return (_a = req['headers']['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    }
    // protected generateToken(payload: TokenPayload): string {
    //   return jwt.sign(payload, this.tokenSecret as string, { expiresIn: this.tokenExpiry as string });
    // }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.tokenSecret, {
            expiresIn: this.tokenExpiry
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.tokenSecret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new Error('Token has expired');
            }
            else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            else if (error instanceof jsonwebtoken_1.NotBeforeError) {
                throw new Error('Token not active');
            }
            else {
                throw new Error('Token verification failed');
            }
        }
    }
    generateCryptoToken(tokenSize) {
        return crypto_1.default.randomBytes(tokenSize).toString('hex');
    }
    //time will be in milliseconds
    createCryptoTokenExpiry(duration, unit) {
        return (0, dayjs_1.default)().add(duration, unit).toISOString();
    }
    checkCryptoTokenExpiry(time) {
        const currentTimestamp = Date.now();
        const expiryTimestamp = new Date(time).getTime();
        return currentTimestamp > expiryTimestamp;
    }
}
exports.TokenService = TokenService;
class UserTokenService extends TokenService {
    constructor() {
        super(config_1.default.JWT_TOKEN.USER.EXPIRY, config_1.default.JWT_TOKEN.USER.SECRET);
    }
    generateUserAccessToken(payload) {
        return this.generateToken(payload);
    }
    verifyUserAccessToken(token) {
        return this.verifyToken(token);
    }
}
exports.UserTokenService = UserTokenService;
class AdminTokenService extends TokenService {
    constructor() {
        super(config_1.default.JWT_TOKEN.ADMIN.EXPIRY, config_1.default.JWT_TOKEN.ADMIN.SECRET);
    }
    generateAdminAccessToken(payload) {
        return this.generateToken(payload);
    }
    verifyAdminAccessToken(token) {
        return this.verifyToken(token);
    }
}
exports.AdminTokenService = AdminTokenService;
