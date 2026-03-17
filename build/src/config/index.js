"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../utils/constants");
const commonValidations_1 = __importDefault(require("../validations/commonValidations"));
class Config {
    static validateEnvVars() {
        const envVarsSchema = joi_1.default.object({
            PORT: joi_1.default.number().default(5000).required(),
            NODE_ENV: joi_1.default.string()
                .valid(...Object.values(constants_1.NODE_ENVIRONMENT))
                .required(),
            DB_URL: joi_1.default.string().required(),
            JWT_USER_ACCESS_TOKEN_EXPIRY: joi_1.default.string().required(),
            JWT_USER_ACCESS_TOKEN_SECRET: joi_1.default.string().required(),
            JWT_ADMIN_ACCESS_TOKEN_EXPIRY: joi_1.default.string().required(),
            JWT_ADMIN_ACCESS_TOKEN_SECRET: joi_1.default.string().required(),
            HOST: joi_1.default.string().required(),
            PROTOCOL: joi_1.default.string().required(),
            SUPER_ADMIN_EMAIL: commonValidations_1.default.emailValidator
                .required()
                .label('SUPER_ADMIN_EMAIL'),
            SUPER_ADMIN_PASSWORD: joi_1.default.string()
                .required()
                .label('SUPER_ADMIN_PASSWORD'),
            SMTP_EMAIL_USERNAME: joi_1.default.string().required(),
            SMTP_EMAIL_PASSWORD: joi_1.default.string().required(),
            FE_BASE_URL: joi_1.default.string().required(),
            SENDGRID_API_KEY: joi_1.default.string().required(),
        }).unknown(true);
        const { value: envVars, error } = envVarsSchema
            .prefs({ errors: { label: 'key' } })
            .validate(process.env);
        if (error) {
            console.error('Environment variables validation error:', error.message);
            process.exit(1);
        }
        return envVars;
    }
    static initialize() {
        dotenv_1.default.config();
        const envVars = this.validateEnvVars();
        this.PORT = envVars.PORT;
        this.NODE_ENV = envVars.NODE_ENV;
        this.DB_URL = envVars.DB_URL;
        this.JWT_TOKEN = {
            USER: {
                EXPIRY: envVars.JWT_USER_ACCESS_TOKEN_EXPIRY,
                SECRET: envVars.JWT_USER_ACCESS_TOKEN_SECRET,
            },
            ADMIN: {
                EXPIRY: envVars.JWT_ADMIN_ACCESS_TOKEN_EXPIRY,
                SECRET: envVars.JWT_ADMIN_ACCESS_TOKEN_SECRET,
            },
        };
        this.SUPER_ADMIN_EMAIL = envVars.SUPER_ADMIN_EMAIL;
        this.SUPER_ADMIN_PASSWORD = envVars.SUPER_ADMIN_PASSWORD;
        // this.UPLOAD_FOLDERS = [
        //   {
        //     folderName: FOLDER_NAMES.UPLOADS,
        //     childDirectory: [
        //       {
        //         folderName: FOLDER_NAMES.VEHICLE_IMAGES,
        //         childDirectory: [],
        //       },
        //       {
        //         folderName: FOLDER_NAMES.PROFILE_IMAGES,
        //         childDirectory: [],
        //       },
        //       {
        //         folderName: FOLDER_NAMES.VEHICLE_MAKES,
        //         childDirectory: [],
        //       },
        //       {
        //         folderName: FOLDER_NAMES.VEHICLE_FEATURES,
        //         childDirectory: [],
        //       },
        //       {
        //         folderName: FOLDER_NAMES.VEHICLE_FEATURES,
        //         childDirectory: [],
        //       },
        //       {
        //         folderName: FOLDER_NAMES.VEHICLE_DOCUMENTS,
        //         childDirectory: [],
        //       },
        //     ],
        //   },
        // ];
        this.HOST = envVars.HOST;
        this.PROTOCOL = envVars.PROTOCOL;
        this.SMTP_EMAIL_USERNAME = envVars.SMTP_EMAIL_USERNAME;
        this.SMTP_EMAIL_PASSWORD = envVars.SMTP_EMAIL_PASSWORD;
        this.FE_BASE_URL = envVars.FE_BASE_URL;
        this.SENDGRID_API_KEY = envVars.SENDGRID_API_KEY;
    }
    static get baseRoute() {
        return this.BASE_ROUTE;
    }
    static get BaseUrl() {
        const baseUrl = Config.NODE_ENV === constants_1.NODE_ENVIRONMENT.DEVELOPMENT
            ? `${Config.PROTOCOL}://${Config.HOST}:${Config.PORT}${this.baseRoute}`
            : `${Config.PROTOCOL}://${Config.HOST}${this.baseRoute}`;
        return baseUrl;
    }
}
Config.BASE_ROUTE = "";
// Initialize the configuration
Config.initialize();
exports.default = Config;
