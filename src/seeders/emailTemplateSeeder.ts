import { configService } from '../services/admin/config';
import { emailTemplateService } from '../services/admin/emailTemplate';
import { ISeeder } from '../types/common';

class EmailTemplateSeeder implements ISeeder {
  constructor() {}
  public async seed() {
    await emailTemplateService.seedInitialEmailTemplates();
  }
}

export default EmailTemplateSeeder;
