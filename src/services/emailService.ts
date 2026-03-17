import { EmailConfigValue, EmailOptions } from '../types/common';
import nodemailer, { Transporter } from 'nodemailer';
import EmailConfigService from './admin/config/emailConfig';
import {
  EmailTemplateFallBackSubjectAndMessage,
  EventsEmailKeys,
  RESPONSE_CODE,
  ServiceRequestEmailKeys,
  TAGS,
} from '../utils/constants';
import ApiError from '../utils/ApiError';
import EmailTemplateService from './admin/emailTemplate';
import ComplaintModel from '../models/Complaint';
import { UserModelService } from './model/userModelServices';
import User from '../models/User';
import BookEvent from '../models/BookEvent';
import Event from '../models/Event';
import _ from 'lodash';
import Contractor from '../models/Contractor';
import { IContractor } from '../types/models';
import { isValidEmail } from '../utils/helper';
class EmailService {
  private static instance: EmailService;
  private transporter!: Transporter;
  private fromEmail!: string;
  private fromName!: string;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      // console.log('this.initPromise');
      return this.initPromise;
    }

    this.initPromise = this.initEmailConfig();
    await this.initPromise;
    this.isInitialized = true;
    this.initPromise = null;
  }

  private async initEmailConfig() {
    // console.log('Initializing email configuration...');
    const emailConfigService = new EmailConfigService();
    const emailConfig = await emailConfigService.getEmailConfig();

    if (!emailConfig) {
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        'Email configuration not found'
      );
    }

    const {
      host,
      port,
      secure,
      authUser,
      authPassword,
      fromName,
      fromEmail,
      tls_rejectUnauthorized = false,
    }: EmailConfigValue = emailConfig;

    // console.log('Email config loaded:', { host, port, fromEmail });

    this.fromEmail = fromEmail;
    this.fromName = fromName;

    this.transporter = nodemailer.createTransport({
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
    await this.transporter.verify();
    // console.log('Email transporter verified successfully');
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      // console.log('Not initialized');
      await this.init();
    }
  }

  public async sendEmail(options: EmailOptions): Promise<unknown> {
    try {
      await this.ensureInitialized();

      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      if (!isValidEmail(options.to)) {
        console.error(
          'Email Not Sent Not a valid Email Recipient:',
          options.to
        );
        return;
      }
      const info = await this.transporter.sendMail({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      throw new Error('Failed to send email: Unknown error');
    }
  }

  // Method to refresh configuration if needed
  public async refreshConfig(): Promise<void> {
    this.isInitialized = false;
    this.initPromise = null;
    await this.init();
  }
}

export class SendMailToUser {
  private emailService: EmailService;

  constructor() {
    this.emailService = EmailService.getInstance();
  }

  public async sendUserEmailVerificationLink(
    UserEmail: string,
    emailVerificationURL: string,
    user_name: string
  ): Promise<unknown> {
    const mailOptions: EmailOptions = {
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
      const emailResponse = await this.emailService.sendEmail(mailOptions);
      return emailResponse;
    } catch (error) {
      // console.error('Error sending password reset email:', error);
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  public async sendUserWelcomeMail(UserEmail: string): Promise<unknown> {
    const mailOptions: EmailOptions = {
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
      return await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  public async sendUserForgotPasswordLink(
    UserEmail: string,
    resetPasswordURL: string,
    user_name: string
  ): Promise<unknown> {
    const mailOptions: EmailOptions = {
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
      return await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  public async sendNewPasswordMail(
    userEmail: string,
    userName: string,
    newPassword: string
  ): Promise<void> {
    const mailOptions: EmailOptions = {
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
      await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to send new password email: ${error.message}`);
      }
      throw error;
    }
  }
}

export class ResetPasswordEmailService {
  private emailService: EmailService;

  constructor() {
    this.emailService = EmailService.getInstance();
  }

  public async sendResetPasswordEmail(
    email: string,
    resetURL: string
  ): Promise<unknown> {
    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               ${resetURL}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    try {
      return await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      // console.error('Error sending password reset email:', error);
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}

export class SendMailToUserOnEventRegistration {
  private emailService: EmailService;

  constructor() {
    this.emailService = EmailService.getInstance();
  }

  public async sendUserBookingApprovedMail(
    userEmail: string,
    eventTitle: string,
    eventDate: string
  ): Promise<unknown> {
    const mailOptions: EmailOptions = {
      to: userEmail,
      subject: 'Event Registration Approved',
      text: `Dear User,
  
  Your registration for the event "${eventTitle}" scheduled on ${eventDate} has been approved.
  
  We look forward to seeing you at the event!
  
  Best regards,  
  Your Company Name`,
    };

    try {
      return await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  public async sendUserBookingDeclineMail(
    userEmail: string,
    eventTitle: string,
    eventDate: string
  ): Promise<unknown> {
    const mailOptions: EmailOptions = {
      to: userEmail,
      subject: 'Event Registration Declined',
      text: `Dear User,
  
  We regret to inform you that your registration for the event "${eventTitle}" on ${eventDate} has been declined.
  
  Please feel free to contact us for more information.
  
  Best regards,  
  Your Company Name`,
    };

    try {
      return await this.emailService.sendEmail(mailOptions);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}

export class SendEmailTemplateMail extends EmailTemplateService {
  private emailService: EmailService;
  constructor() {
    super();
    this.emailService = EmailService.getInstance();
  }

  renderEmail(template: string, tagData: Record<string, any>) {
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

  generateTagData(
    tagKeys: (keyof typeof TAGS)[],
    dataMap: Record<string, any>
  ) {
    const tagData: Record<string, any> = {};

    for (const key of tagKeys) {
      const tagList = TAGS[key] || [];

      tagList.forEach(({ value, field }) => {
        const modelData = dataMap[key.toLowerCase()];
        if (modelData) {
          const nestedValue = _.get(modelData, field);
          if (nestedValue !== undefined) {
            tagData[value] = nestedValue;
          }
        }
      });
    }

    return tagData;
  }

  // -------------------------- SEND EMAIL FOR - Service Request Email Templates --------------------------
  async sendServiceRequestEmailToUser(
    serviceRequestId: string,
    emailTemplateKey: string
  ) {
    const emailTemplate = await this.findEmailTemplate(emailTemplateKey);
    if (!emailTemplate) return;

    const subjectTemplate =
      emailTemplate?.subject ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
    const bodyTemplate =
      emailTemplate?.message ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
    const complaint = await ComplaintModel.findById(serviceRequestId).lean();
    const emailTo = complaint?.email as string;
    if (!emailTo) {
      return;
    }
    const user = await User.findById(complaint?.userId).lean();
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
  }

  async sendServiceRequestApprovedEmailToContractor(
    serviceRequestId: string,
    emailTemplateKey: string = ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR
  ) {
    const emailTemplate = await this.findEmailTemplate(emailTemplateKey);
    if (!emailTemplate) return;

    const subjectTemplate =
      emailTemplate?.subject ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
    const bodyTemplate =
      emailTemplate?.message ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
    const complaint = await ComplaintModel.findById(serviceRequestId)
      .populate('assignContractor')
      .lean();
    const contractor = complaint?.assignContractor as Partial<IContractor>;
    const contractorEmail = contractor?.ContractorEmail;
    if (!contractorEmail) {
      return;
    }
    const user = await User.findById(complaint?.userId).lean();
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
  }

  //send email to admin that a service request has been initiated
  async sendServiceRequestEmailToAdminAndContractors(
    serviceRequestId: string,
    emailTemplateKey = ServiceRequestEmailKeys.SERVICE_REQUEST_RECEIVED_ADMIN_CONTRACTOR
  ) {
    const emailTemplate = await this.findEmailTemplate(emailTemplateKey);
    if (!emailTemplate) return;

    const subjectTemplate =
      emailTemplate?.subject ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
    const bodyTemplate =
      emailTemplate?.message ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
    const complaint = await ComplaintModel.findById(serviceRequestId).lean();
    console.log(complaint, 'complaint');
    const serviceCategoryId = complaint?.serviceCategory;
    const contractorsEmails = await Contractor.aggregate([
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

    const emailTo = emailTemplate?.emailTo as string[];
    if (!emailTo) {
      return;
    }
    const user = await User.findById(complaint?.userId).lean();
    const tagData = this.generateTagData(['USER', 'COMPLAINT'], {
      user,
      complaint,
    });
    const renderedSubject = this.renderEmail(subjectTemplate, tagData);
    const renderedBody = this.renderEmail(bodyTemplate, tagData);
    if (emailTo?.length === 0 && contractorsEmails?.length === 0) return;
    // how to send email to admin which i have array emailToArray

    // SEND EMAIL TO ALL EMAIL TO EMAILS in ADMIN
    for (const adminEmail of emailTo) {
      try {
        this.emailService.sendEmail({
          to: adminEmail,
          subject: renderedSubject,
          html: renderedBody,
        });
      } catch (error) {
        console.log(error);
      }
    }

    // SEND EMAIL TO ALL CONTRACTORS FOR THAT SERVICE CATEGORY
    for (const d of contractorsEmails) {
      try {
        this.emailService.sendEmail({
          to: d?.ContractorEmail,
          subject: renderedSubject,
          html: renderedBody,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  // -------------------------- SEND EMAIL FOR - Events Email Templates --------------------------

  async sendEventEmailToUser(bookingId: string, emailTemplateKey: string) {
    const emailTemplate = await this.findEmailTemplate(emailTemplateKey);
    if (!emailTemplate) return;

    const subjectTemplate =
      emailTemplate?.subject ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
    const bodyTemplate =
      emailTemplate?.message ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
    const user_booking = await BookEvent.findById(bookingId)
      .lean()
      .populate('eventId');
    const event = user_booking?.eventId;
    const emailTo = user_booking?.email as string;
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
  }
  async sendEventEmailToAdmin(
    bookingId: string,
    emailTemplateKey: string = EventsEmailKeys.EVENT_REQUEST_RECEIVED_ADMIN
  ) {
    const emailTemplate = await this.findEmailTemplate(emailTemplateKey);
    if (!emailTemplate) return;

    const subjectTemplate =
      emailTemplate?.subject ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].subject;
    const bodyTemplate =
      emailTemplate?.message ||
      EmailTemplateFallBackSubjectAndMessage[emailTemplateKey].message;
    const user_booking = await BookEvent.findById(bookingId)
      .lean()
      .populate('eventId');
    const event = user_booking?.eventId;
    const emailTo = emailTemplate?.emailTo as string[];
    if (!emailTo) {
      return;
    }
    const tagData = this.generateTagData(['USER_BOOKING', 'EVENT'], {
      user_booking,
      event,
    });
    const renderedSubject = this.renderEmail(subjectTemplate, tagData);
    const renderedBody = this.renderEmail(bodyTemplate, tagData);

    if (emailTo?.length === 0) return;
    // how to send email to admin which i have array emailToArray
    for (const adminEmail of emailTo) {
      try {
        this.emailService.sendEmail({
          to: adminEmail,
          subject: renderedSubject,
          html: renderedBody,
        });
      } catch (error) {
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
  }
}
export default EmailService;
