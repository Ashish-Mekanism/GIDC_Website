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
exports.emailTemplateService = void 0;
const lodash_1 = require("lodash");
const EmailTemplate_1 = __importDefault(require("../../../models/EmailTemplate"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
class EmailTemplateService {
    constructor() {
        this.EmailTemplateRepository = EmailTemplate_1.default;
    }
    seedInitialEmailTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const emailTemplate of constants_1.InitialEmailTemplates) {
                const existing = yield this.EmailTemplateRepository.findOne({
                    key: emailTemplate.key,
                });
                if (!existing) {
                    yield this.EmailTemplateRepository.create(emailTemplate);
                }
            }
        });
    }
    validateKey(key) {
        if (!key || !(0, lodash_1.isString)(key) || (0, lodash_1.isEmpty)(key.trim())) {
            throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid or missing email template key');
        }
    }
    findEmailTemplate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            return this.EmailTemplateRepository.findOne({ key });
        });
    }
    getEmailTemplate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            const existingEmailTemplate = yield this.EmailTemplateRepository.findOne({
                key,
            });
            if (!existingEmailTemplate) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Email Template does not exist');
            }
            return existingEmailTemplate;
        });
    }
    editEmailTemplate(key, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateKey(key);
            const existingConfig = yield this.findEmailTemplate(key);
            if (!existingConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
            }
            // let updatePayload: {
            //   subject?: string;
            //   message?: string;
            //   emailTo?: string[];
            // } = {};
            // if (newData?.subject) {
            //   updatePayload.subject = newData?.subject;
            // }
            // if (newData?.message) {
            //   updatePayload.message = newData?.message;
            // }
            // if (newData?.emailTo) {
            //   updatePayload.emailTo = newData?.emailTo;
            // }
            return yield this.EmailTemplateRepository.findOneAndUpdate({ key }, {
                $set: newData,
            }, {
                new: true,
            });
        });
    }
    getAllEmailTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.EmailTemplateRepository.find().exec();
        });
    }
    getServiceRequestEmailTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys_ = Object.values(constants_1.ServiceRequestEmailKeys);
            const templates = yield this.EmailTemplateRepository.find({
                key: { $in: keys_ },
            }).lean();
            return templates === null || templates === void 0 ? void 0 : templates.map(t => {
                return Object.assign(Object.assign({}, t), { tags: constants_1.EMAIL_TEMPLATE_ALLOWED_TAGS[t.key] || [] });
            });
        });
    }
    getEventEmailTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys_ = Object.values(constants_1.EventsEmailKeys);
            const templates = yield this.EmailTemplateRepository.find({
                key: { $in: keys_ },
            }).lean();
            return templates === null || templates === void 0 ? void 0 : templates.map(t => {
                return Object.assign(Object.assign({}, t), { tags: constants_1.EMAIL_TEMPLATE_ALLOWED_TAGS[t.key] || [] });
            });
        });
    }
}
exports.default = EmailTemplateService;
exports.emailTemplateService = new EmailTemplateService();
