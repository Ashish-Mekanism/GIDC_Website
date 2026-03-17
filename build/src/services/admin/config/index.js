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
exports.configService = void 0;
const Config_1 = __importDefault(require("../../../models/Config"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const lodash_1 = require("lodash");
const emailService_1 = __importDefault(require("../../emailService"));
class AdminConfigService {
    constructor() {
        this.ConfigRepository = Config_1.default;
    }
    seedInitialConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const config of constants_1.InitialConfigs) {
                const existing = yield this.ConfigRepository.findOne({ key: config.key });
                if (!existing) {
                    yield this.ConfigRepository.create(config);
                    console.log(`✅ Seeded config: ${config.key}`);
                }
            }
        });
    }
    validateKey(key) {
        if (!key || !(0, lodash_1.isString)(key) || (0, lodash_1.isEmpty)(key.trim())) {
            throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid or missing config key');
        }
    }
    validateValue(value) {
        if (value === undefined || value === null) {
            throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid or missing config value');
        }
    }
    findConfig(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            return this.ConfigRepository.findOne({ key });
        });
    }
    createConfig(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            this.validateValue(value);
            const existingConfig = yield this.findConfig(key);
            if (existingConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Config already exists');
            }
            return yield this.ConfigRepository.create({ key, value });
        });
    }
    deleteConfig(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            const existingConfig = yield this.findConfig(key);
            if (!existingConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
            }
            return this.ConfigRepository.deleteOne({ key });
        });
    }
    editConfig(key, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            this.validateValue(newData);
            const existingConfig = yield this.findConfig(key);
            if (!existingConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
            }
            yield this.ConfigRepository.findOneAndUpdate({ key }, {
                $set: {
                    value: newData,
                },
            }, {
                new: true,
            });
            if (key === constants_1.BaseConfigKeys.EMAIL_CONFIG) {
                const emailService = emailService_1.default.getInstance();
                try {
                    yield emailService.refreshConfig();
                }
                catch (error) {
                    if (error instanceof Error)
                        throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, error.message);
                }
            }
        });
    }
    getConfig(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            const existingConfig = yield this.ConfigRepository.findOne({ key });
            if (!existingConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
            }
            return existingConfig;
        });
    }
    getAllConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ConfigRepository.find().exec();
        });
    }
}
exports.default = AdminConfigService;
exports.configService = new AdminConfigService();
