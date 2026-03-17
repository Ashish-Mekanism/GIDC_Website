import AdminConfigService from '.';
import { EmailConfigValue } from '../../../types/common';

import { BaseConfigKeys } from '../../../utils/constants';

class EmailConfigService extends AdminConfigService {
  constructor() {
    super();
  }
  async getEmailConfig() {
    return (await this.getConfig(BaseConfigKeys.EMAIL_CONFIG)).value as EmailConfigValue ;
  }
  getEmailConfigKey() {
    return BaseConfigKeys.EMAIL_CONFIG;
  }
}

export default EmailConfigService;
