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
const winston_1 = __importStar(require("winston"));
const constants_1 = require("../utils/constants");
const _1 = __importDefault(require("."));
// Custom format to handle error objects
const enumerateErrorFormat = (0, winston_1.format)((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
// Create the logger instance
const logger = winston_1.default.createLogger({
    level: _1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.DEVELOPMENT ? 'debug' : 'info',
    format: winston_1.format.combine(winston_1.format.json(), enumerateErrorFormat(), _1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.DEVELOPMENT
        ? winston_1.format.colorize()
        : winston_1.format.uncolorize(), winston_1.format.splat(), winston_1.format.printf(({ level, message }) => {
        return `${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});
winston_1.default.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
});
exports.default = logger;
