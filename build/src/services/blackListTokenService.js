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
const BlackListToken_1 = __importDefault(require("../models/BlackListToken"));
class BlackListTokenService {
    // Add a token to the blacklist
    addTokenToBlacklist(token, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const expireTimeInMilliseconds = new Date(expiresAt * 1000);
            const blackListedToken = new BlackListToken_1.default({
                token: token,
                expiresAt: expireTimeInMilliseconds,
            });
            yield blackListedToken.save();
        });
    }
    // Check if a token is blacklisted
    isTokenBlacklisted(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            const blackListedToken = yield BlackListToken_1.default.findOne({
                token: token,
                expiresAt: { $gte: currentTime },
            });
            return !!blackListedToken;
        });
    }
    deleteExpiredTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            yield BlackListToken_1.default.deleteMany({
                expiresAt: { $lt: currentTime },
            });
        });
    }
}
exports.default = BlackListTokenService;
