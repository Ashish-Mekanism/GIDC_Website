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
const joi_1 = __importDefault(require("joi"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const constants_1 = require("../utils/constants");
//import MediaService from '../services/mediaService';
const lodash_1 = require("lodash");
const validateRequest = (schema, multerType) => (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validSchema = (0, lodash_1.pick)(schema, ['params', 'query', 'body']);
        const object = (0, lodash_1.pick)(req, Object.keys(validSchema));
        const { value, error } = joi_1.default.object(validSchema)
            .prefs({ errors: { label: 'key' }, abortEarly: false })
            .validate(object, {
            errors: {
                wrap: {
                    label: false,
                },
                language: req.headers['accept-language'],
            },
        });
        if (error) {
            console.log(error, 'errorr');
            //const mediaService = new MediaService();
            //   if (req.file) {
            //     const filePath = req.file.path;
            //     await mediaService.deleteFile(filePath);
            //   }
            //   if (req.files) {
            //     if (multerType === 'fields') {
            //       const filePaths = convertMulterFieldsToPaths(req.files);
            //       await mediaService.deleteMultipleFiles(filePaths);
            //     } else if (multerType === 'array') {
            //       const filePaths = convertMulterArrayToPaths(req.files);
            //       await mediaService.deleteMultipleFiles(filePaths);
            //     }
            //   }
            const errorMessages = error === null || error === void 0 ? void 0 : error.details;
            const errors = {};
            errorMessages.forEach(err => {
                var _a;
                const key = ((_a = err.context) === null || _a === void 0 ? void 0 : _a.key) || 'unknown';
                errors[key] = err.message;
            });
            return next(new ApiError_1.default(constants_1.RESPONSE_CODE.UNPROCESSABLE_ENTITY, 'Validation Error', errors));
        }
        Object.assign(req, value);
        next();
    }
    catch (_error) {
        console.error('Unexpected error in validateRequest:', _error);
        if (_error instanceof Error) {
            next(new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, _error.message, {}, false, _error.stack));
        }
        else {
            next(new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Unexpected Error', {}));
        }
    }
});
exports.default = validateRequest;
