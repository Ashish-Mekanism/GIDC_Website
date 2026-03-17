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
exports.SendGridService = void 0;
// services/SendGridService.ts
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY || '');
class SendGridService {
    sendEmail(to, subject, html, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!html && !text) {
                throw new Error("Either 'html' or 'text' content is required.");
            }
            const msg = {
                to,
                from: process.env.SMTP_EMAIL_USERNAME || 'your_verified_email@example.com',
                subject,
                html,
                text: text || '',
            };
            try {
                const response = yield mail_1.default.send(msg, true);
                console.log('✅ Email sent:', response[0].statusCode);
                return response;
            }
            catch (error) {
                console.error('❌ SendGrid error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.body) || error.message);
                throw new Error('Failed to send email via SendGrid');
            }
        });
    }
}
exports.SendGridService = SendGridService;
