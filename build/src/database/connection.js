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
exports.MongoDBConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
const config_1 = __importDefault(require("../config"));
let connectionPromise = null;
/// Connect to MongoDB database
const MongoDBConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!connectionPromise) {
        connectionPromise = new Promise((resolve, reject) => {
            let DB_URL;
            switch (config_1.default.NODE_ENV) {
                case constants_1.NODE_ENVIRONMENT.PRODUCTION:
                    DB_URL = config_1.default.DB_URL;
                    break;
                case constants_1.NODE_ENVIRONMENT.DEVELOPMENT:
                    DB_URL = config_1.default.DB_URL;
                    break;
                default:
                    reject(new Error('Invalid environment'));
                    return;
            }
            mongoose_1.default.connect(DB_URL, {})
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    return connectionPromise;
});
exports.MongoDBConnection = MongoDBConnection;
