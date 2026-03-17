import dotenv from 'dotenv';
import Joi from 'joi';
import { NODE_ENVIRONMENT } from '../utils/constants';
import commonValidations from '../validations/commonValidations';
import { FolderStructure } from '../types/common';

class Config {
  public static PORT: number;
  public static NODE_ENV: string;
  public static DB_URL: string;
  public static JWT_TOKEN: {
    USER: {
      EXPIRY: string;
      SECRET: string;
    };
    ADMIN: {
      EXPIRY: string;
      SECRET: string;
    };
  };
  public static SUPER_ADMIN_EMAIL: string;
  public static SUPER_ADMIN_PASSWORD: string;
  public static UPLOAD_FOLDERS: FolderStructure[];
  public static HOST: string;
  public static PROTOCOL: string;
  public static SMTP_EMAIL_USERNAME: string;
  public static SMTP_EMAIL_PASSWORD: string;
  public static FE_BASE_URL: string;

  public static BASE_ROUTE = "";

  public static SENDGRID_API_KEY: string;

  private static validateEnvVars() {
    const envVarsSchema = Joi.object({
      PORT: Joi.number().default(5000).required(),
      NODE_ENV: Joi.string()
        .valid(...Object.values(NODE_ENVIRONMENT))
        .required(),
      DB_URL: Joi.string().required(),
      JWT_USER_ACCESS_TOKEN_EXPIRY: Joi.string().required(),
      JWT_USER_ACCESS_TOKEN_SECRET: Joi.string().required(),
      JWT_ADMIN_ACCESS_TOKEN_EXPIRY: Joi.string().required(),
      JWT_ADMIN_ACCESS_TOKEN_SECRET: Joi.string().required(),
      HOST: Joi.string().required(),
      PROTOCOL: Joi.string().required(),
      SUPER_ADMIN_EMAIL: commonValidations.emailValidator
        .required()
        .label('SUPER_ADMIN_EMAIL'),
      SUPER_ADMIN_PASSWORD: Joi.string()
        .required()
        .label('SUPER_ADMIN_PASSWORD'),
      SMTP_EMAIL_USERNAME: Joi.string().required(),
      SMTP_EMAIL_PASSWORD: Joi.string().required(),
      FE_BASE_URL: Joi.string().required(),
      SENDGRID_API_KEY: Joi.string().required(),

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

  public static initialize() {
    dotenv.config();
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
    const baseUrl =
      Config.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT
        ? `${Config.PROTOCOL}://${Config.HOST}:${Config.PORT}${this.baseRoute}`
        : `${Config.PROTOCOL}://${Config.HOST}${this.baseRoute}`;
    return baseUrl;

  }
}

// Initialize the configuration
Config.initialize();

export default Config;
