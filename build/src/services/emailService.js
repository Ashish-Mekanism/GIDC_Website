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
exports.SendEmailTemplateMail = exports.SendMailToUserOnEventRegistration = exports.ResetPasswordEmailService = exports.SendMailToUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailConfig_1 = __importDefault(require("./admin/config/emailConfig"));
const constants_1 = require("../utils/constants");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const emailTemplate_1 = __importDefault(require("./admin/emailTemplate"));
const Complaint_1 = __importDefault(require("../models/Complaint"));
const User_1 = __importDefault(require("../models/User"));
const BookEvent_1 = __importDefault(require("../models/BookEvent"));
const lodash_1 = __importDefault(require("lodash"));
const Contractor_1 = __importDefault(require("../models/Contractor"));
const helper_1 = require("../utils/helper");
class EmailService {
    constructor() {
        this.isInitialized = false;
        this.initPromise = null;
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized)
                return;
            // Prevent multiple simultaneous initializations
            if (this.initPromise) {
                // console.log('this.initPromise');
                return this.initPromise;
            }
            this.initPromise = this.initEmailConfig();
            yield this.initPromise;
            this.isInitialized = true;
            this.initPromise = null;
        });
    }
    initEmailConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Initializing email configuration...');
            const emailConfigService = new emailConfig_1.default();
            const emailConfig = yield emailConfigService.getEmailConfig();
            if (!emailConfig) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Email configuration not found');
            }
            const { host, port, secure, authUser, authPassword, fromName, fromEmail, tls_rejectUnauthorized = false, } = emailConfig;
            // console.log('Email config loaded:', { host, port, fromEmail });
            this.fromEmail = fromEmail;
            this.fromName = fromName;
            this.transporter = nodemailer_1.default.createTransport({
                host,
                port: Number(port),
                secure,
                auth: {
                    user: authUser,
                    pass: authPassword,
                },
                tls: {
                    rejectUnauthorized: tls_rejectUnauthorized,
                },
            });
            // Verify the connection
            yield this.transporter.verify();
            // console.log('Email transporter verified successfully');
        });
    }
    ensureInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                // console.log('Not initialized');
                yield this.init();
            }
        });
    }
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureInitialized();
                if (!this.transporter) {
                    throw new Error('Email transporter not initialized');
                }
                if (!(0, helper_1.isValidEmail)(options.to)) {
                    console.error('Email Not Sent Not a valid Email Recipient:', options.to);
                    return;
                }
                const info = yield this.transporter.sendMail({
                    from: `${this.fromName} <${this.fromEmail}>`,
                    to: options.to,
                    subject: options.subject,
                    text: options.text,
                    html: options.html,
                });
                console.log('Email sent successfully:', info.messageId);
                return info;
            }
            catch (error) {
                console.error('Error sending email:', error);
                if (error instanceof Error) {
                    throw new Error(`Failed to send email: ${error.message}`);
                }
                throw new Error('Failed to send email: Unknown error');
            }
        });
    }
    // Method to refresh configuration if needed
    refreshConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isInitialized = false;
            this.initPromise = null;
            yield this.init();
        });
    }
}
class SendMailToUser {
    constructor() {
        this.emailService = EmailService.getInstance();
    }
    sendUserEmailVerificationLink(UserEmail, emailVerificationURL, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: UserEmail,
                subject: 'Email Verification',
                text: `Dear User,

          Thank you for registering with us. Please verify your email address for the username "${user_name}" by clicking the link below or copying it into your browser:

${emailVerificationURL}

This link will expire in one hour. If you did not create an account, you can safely ignore this email.


          Best regards,
          Your Company Name`,
            };
            try {
                const emailResponse = yield this.emailService.sendEmail(mailOptions);
                return emailResponse;
            }
            catch (error) {
                // console.error('Error sending password reset email:', error);
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
    sendUserWelcomeMail(UserEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: UserEmail,
                subject: 'Welcome to Our Platform',
                text: `Dear ${UserEmail},
      
                 Welcome to Our Platform! We are excited to have you onboard.
      
                 You can now explore our features and enjoy the benefits of being a part of our community.
      
                 If you have any questions or need assistance, feel free to reach out to our support team.
      
                 Best regards,
                 Your Company Name`,
            };
            try {
                return yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
    sendUserForgotPasswordLink(UserEmail, resetPasswordURL, user_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: UserEmail,
                subject: 'Reset Your Password',
                text: `Dear ,

    We received a request to reset the password for your account (${user_name}).  
    Click the link below to set a new password:

    ${resetPasswordURL}

    If you did not request a password reset, please ignore this email or contact our support team if you have concerns.
      Best regards,
      OIA`,
            };
            try {
                // Send the email
                return yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
    sendNewPasswordMail(userEmail, userName, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: userEmail,
                subject: `Your New Login Credentials For OIA Web App`,
                text: `Hello ,

We’ve generated a new password for your account.

Username: ${userName}
New Password: ${newPassword}



Best regards,
OIA`,
            };
            try {
                yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to send new password email: ${error.message}`);
                }
                throw error;
            }
        });
    }
}
exports.SendMailToUser = SendMailToUser;
class ResetPasswordEmailService {
    constructor() {
        this.emailService = EmailService.getInstance();
    }
    sendResetPasswordEmail(email, resetURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: email,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               ${resetURL}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            try {
                return yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                // console.error('Error sending password reset email:', error);
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
}
exports.ResetPasswordEmailService = ResetPasswordEmailService;
class SendMailToUserOnEventRegistration {
    constructor() {
        this.emailService = EmailService.getInstance();
    }
    sendUserBookingApprovedMail(userEmail, eventTitle, eventDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: userEmail,
                subject: 'Event Registration Approved',
                text: `Dear User,
  
  Your registration for the event "${eventTitle}" scheduled on ${eventDate} has been approved.
  
  We look forward to seeing you at the event!
  
  Best regards,  
  Your Company Name`,
            };
            try {
                return yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
    sendUserBookingDeclineMail(userEmail, eventTitle, eventDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                to: userEmail,
                subject: 'Event Registration Declined',
                text: `Dear User,
  
  We regret to inform you that your registration for the event "${eventTitle}" on ${eventDate} has been declined.
  
  Please feel free to contact us for more information.
  
  Best regards,  
  Your Company Name`,
            };
            try {
                return yield this.emailService.sendEmail(mailOptions);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        });
    }
}
exports.SendMailToUserOnEventRegistration = SendMailToUserOnEventRegistration;
class SendEmailTemplateMail extends emailTemplate_1.default {
    constructor() {
        super();
        this.emailService = EmailService.getInstance();
    }
    renderEmail(template, tagData) {
        return template.replace(/{{(.*?)}}/g, (_, tagKey) => {
            const tag = `{{${tagKey.trim()}}}`;
            return tagData[tag] !== undefined && tagData[tag] !== null
                ? tagData[tag]
                : '-'; // or use 'N/A' if you want a visible fallback
        });
    }
    // generateTagData(
    //   tagKeys: (keyof typeof TAGS)[],
    //   dataMap: Record<string, any>
    // ) {
    //   const tagData: Record<string, any> = {};
    //   for (const key of tagKeys) {
    //     const tagList = TAGS[key] || [];
    //     tagList.forEach(({ value, field }) => {
    //       const modelData = dataMap[key.toLowerCase()];
    //       if (modelData && modelData[field] !== undefined) {
    //         tagData[value] = modelData[field];
    //       }
    //     });
    //   }
    //   return tagData;
    // }
    generateTagData(tagKeys, dataMap) {
        const tagData = {};
        for (const key of tagKeys) {
            const tagList = constants_1.TAGS[key] || [];
            tagList.forEach(({ value, field }) => {
                const modelData = dataMap[key.toLowerCase()];
                if (modelData) {
                    const nestedValue = lodash_1.default.get(modelData, field);
                    if (nestedValue !== undefined) {
                        tagData[value] = nestedValue;
                    }
                }
            });
        }
        return tagData;
    }
    // -------------------------- SEND EMAIL FOR - Service Request Email Templates --------------------------
    sendServiceRequestEmailToUser(serviceRequestId, emailTemplateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTemplate = yield this.findEmailTemplate(emailTemplateKey);
            if (!emailTemplate)
                return;
            const subjectTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.subject) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
            const bodyTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.message) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
            const complaint = yield Complaint_1.default.findById(serviceRequestId).lean();
            const emailTo = complaint === null || complaint === void 0 ? void 0 : complaint.email;
            if (!emailTo) {
                return;
            }
            const user = yield User_1.default.findById(complaint === null || complaint === void 0 ? void 0 : complaint.userId).lean();
            const tagData = this.generateTagData(['USER', 'COMPLAINT'], {
                user,
                complaint,
            });
            const renderedSubject = this.renderEmail(subjectTemplate, tagData);
            const renderedBody = this.renderEmail(bodyTemplate, tagData);
            this.emailService.sendEmail({
                to: emailTo,
                subject: renderedSubject,
                html: renderedBody,
            });
            return {
                renderedSubject,
                renderedBody,
                user,
                complaint,
                tagData,
            };
            // get complaint data and user data
        });
    }
    sendServiceRequestApprovedEmailToContractor(serviceRequestId_1) {
        return __awaiter(this, arguments, void 0, function* (serviceRequestId, emailTemplateKey = constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR) {
            const emailTemplate = yield this.findEmailTemplate(emailTemplateKey);
            if (!emailTemplate)
                return;
            const subjectTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.subject) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
            const bodyTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.message) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
            const complaint = yield Complaint_1.default.findById(serviceRequestId)
                .populate('assignContractor')
                .lean();
            const contractor = complaint === null || complaint === void 0 ? void 0 : complaint.assignContractor;
            const contractorEmail = contractor === null || contractor === void 0 ? void 0 : contractor.ContractorEmail;
            if (!contractorEmail) {
                return;
            }
            const user = yield User_1.default.findById(complaint === null || complaint === void 0 ? void 0 : complaint.userId).lean();
            const tagData = this.generateTagData(['USER', 'COMPLAINT', 'CONTRACTOR'], {
                user,
                complaint,
                contractor,
            });
            const renderedSubject = this.renderEmail(subjectTemplate, tagData);
            const renderedBody = this.renderEmail(bodyTemplate, tagData);
            this.emailService.sendEmail({
                to: contractorEmail,
                subject: renderedSubject,
                html: renderedBody,
            });
            return {
                renderedSubject,
                renderedBody,
                user,
                complaint,
                tagData,
            };
        });
    }
    //send email to admin that a service request has been initiated
    sendServiceRequestEmailToAdminAndContractors(serviceRequestId_1) {
        return __awaiter(this, arguments, void 0, function* (serviceRequestId, emailTemplateKey = constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR) {
            const emailTemplate = yield this.findEmailTemplate(emailTemplateKey);
            if (!emailTemplate)
                return;
            const subjectTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.subject) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
            const bodyTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.message) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
            const complaint = yield Complaint_1.default.findById(serviceRequestId).lean();
            console.log(complaint, 'complaint');
            const serviceCategoryId = complaint === null || complaint === void 0 ? void 0 : complaint.serviceCategory;
            const contractorsEmails = yield Contractor_1.default.aggregate([
                {
                    $match: {
                        ServiceIds: serviceCategoryId,
                        active: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        ContractorEmail: 1,
                    },
                },
            ]);
            const emailTo = emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.emailTo;
            if (!emailTo) {
                return;
            }
            const user = yield User_1.default.findById(complaint === null || complaint === void 0 ? void 0 : complaint.userId).lean();
            const tagData = this.generateTagData(['USER', 'COMPLAINT'], {
                user,
                complaint,
            });
            const renderedSubject = this.renderEmail(subjectTemplate, tagData);
            const renderedBody = this.renderEmail(bodyTemplate, tagData);
            if ((emailTo === null || emailTo === void 0 ? void 0 : emailTo.length) === 0 && (contractorsEmails === null || contractorsEmails === void 0 ? void 0 : contractorsEmails.length) === 0)
                return;
            // how to send email to admin which i have array emailToArray
            // SEND EMAIL TO ALL EMAIL TO EMAILS in ADMIN
            for (const adminEmail of emailTo) {
                try {
                    this.emailService.sendEmail({
                        to: adminEmail,
                        subject: renderedSubject,
                        html: renderedBody,
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            // SEND EMAIL TO ALL CONTRACTORS FOR THAT SERVICE CATEGORY
            for (const d of contractorsEmails) {
                try {
                    this.emailService.sendEmail({
                        to: d === null || d === void 0 ? void 0 : d.ContractorEmail,
                        subject: renderedSubject,
                        html: renderedBody,
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
    // -------------------------- SEND EMAIL FOR - Events Email Templates --------------------------
    sendEventEmailToUser(bookingId, emailTemplateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailTemplate = yield this.findEmailTemplate(emailTemplateKey);
            if (!emailTemplate)
                return;
            const subjectTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.subject) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
            const bodyTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.message) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
            const user_booking = yield BookEvent_1.default.findById(bookingId)
                .lean()
                .populate('eventId');
            const event = user_booking === null || user_booking === void 0 ? void 0 : user_booking.eventId;
            const emailTo = user_booking === null || user_booking === void 0 ? void 0 : user_booking.email;
            if (!emailTo) {
                return;
            }
            const tagData = this.generateTagData(['USER_BOOKING', 'EVENT'], {
                user_booking,
                event,
            });
            const renderedSubject = this.renderEmail(subjectTemplate, tagData);
            const renderedBody = this.renderEmail(bodyTemplate, tagData);
            this.emailService.sendEmail({
                to: emailTo,
                subject: renderedSubject,
                html: renderedBody,
            });
            return {
                renderedSubject,
                renderedBody,
                user_booking,
                event,
                tagData,
            };
            // get complaint data and user data
        });
    }
    sendEventEmailToAdmin(bookingId_1) {
        return __awaiter(this, arguments, void 0, function* (bookingId, emailTemplateKey = constants_1.EventsEmailKeys.EVENT_REQUEST_RECEIVED_ADMIN) {
            const emailTemplate = yield this.findEmailTemplate(emailTemplateKey);
            if (!emailTemplate)
                return;
            const subjectTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.subject) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
            const bodyTemplate = (emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.message) ||
                constants_1.EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
            const user_booking = yield BookEvent_1.default.findById(bookingId)
                .lean()
                .populate('eventId');
            const event = user_booking === null || user_booking === void 0 ? void 0 : user_booking.eventId;
            const emailTo = emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.emailTo;
            if (!emailTo) {
                return;
            }
            const tagData = this.generateTagData(['USER_BOOKING', 'EVENT'], {
                user_booking,
                event,
            });
            const renderedSubject = this.renderEmail(subjectTemplate, tagData);
            const renderedBody = this.renderEmail(bodyTemplate, tagData);
            if ((emailTo === null || emailTo === void 0 ? void 0 : emailTo.length) === 0)
                return;
            // how to send email to admin which i have array emailToArray
            for (const adminEmail of emailTo) {
                try {
                    this.emailService.sendEmail({
                        to: adminEmail,
                        subject: renderedSubject,
                        html: renderedBody,
                    });
                }
                catch (error) {
                    console.log(error);
                }
            }
            // return {
            //   renderedSubject,
            //   renderedBody,
            //   user_booking,
            //   event,
            //   tagData,
            // };
        });
    }
}
exports.SendEmailTemplateMail = SendEmailTemplateMail;
exports.default = EmailService;
