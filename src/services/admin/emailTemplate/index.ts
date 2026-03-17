import { isEmpty, isString } from 'lodash';
import EmailTemplateModel from '../../../models/EmailTemplate';
import ApiError from '../../../utils/ApiError';
import {
  EMAIL_TEMPLATE_ALLOWED_TAGS,
  EventsEmailKeys,
  InitialEmailTemplates,
  RESPONSE_CODE,
  ServiceRequestEmailKeys,
} from '../../../utils/constants';

class EmailTemplateService {
  private EmailTemplateRepository;
  constructor() {
    this.EmailTemplateRepository = EmailTemplateModel;
  }

  async seedInitialEmailTemplates() {
    for (const emailTemplate of InitialEmailTemplates) {
      const existing = await this.EmailTemplateRepository.findOne({
        key: emailTemplate.key,
      });
      if (!existing) {
        await this.EmailTemplateRepository.create(emailTemplate);
      }
    }
  }
  private validateKey(key: string) {
    if (!key || !isString(key) || isEmpty(key.trim())) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Invalid or missing email template key'
      );
    }
  }
  async findEmailTemplate(key: string) {
    this.validateKey(key);
    return this.EmailTemplateRepository.findOne({ key });
  }
  async getEmailTemplate(key: string) {
    this.validateKey(key);
    const existingEmailTemplate = await this.EmailTemplateRepository.findOne({
      key,
    });

    if (!existingEmailTemplate) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Email Template does not exist'
      );
    }
    return existingEmailTemplate;
  }

  async editEmailTemplate(
    key: string,
    newData: { subject: string; message: string; emailTo: string[] }
  ) {
    this.validateKey(key);
    const existingConfig = await this.findEmailTemplate(key);
    if (!existingConfig) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
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
    return await this.EmailTemplateRepository.findOneAndUpdate(
      { key },
      {
        $set: newData,
      },
      {
        new: true,
      }
    );
  }
  async getAllEmailTemplates() {
    return await this.EmailTemplateRepository.find().exec();
  }
  async getServiceRequestEmailTemplates() {
    const keys_ = Object.values(ServiceRequestEmailKeys);
    const templates = await this.EmailTemplateRepository.find({
      key: { $in: keys_ },
    }).lean();
    return templates?.map(t => {
      return {
        ...t,
        tags: EMAIL_TEMPLATE_ALLOWED_TAGS[t.key] || [],
      };
    });
  }
  async getEventEmailTemplates() {
    const keys_ = Object.values(EventsEmailKeys);
    const templates = await this.EmailTemplateRepository.find({
      key: { $in: keys_ },
    }).lean();
    return templates?.map(t => {
      return {
        ...t,
        tags: EMAIL_TEMPLATE_ALLOWED_TAGS[t.key] || [],
      };
    });
  }
}

export default EmailTemplateService;
export const emailTemplateService = new EmailTemplateService();
