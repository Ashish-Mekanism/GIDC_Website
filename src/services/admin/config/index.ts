import ConfigModel from '../../../models/Config';
import ApiError from '../../../utils/ApiError';
import {
  BaseConfigKeys,
  InitialConfigs,
  RESPONSE_CODE,
} from '../../../utils/constants';
import { isEmpty, isString } from 'lodash';
import EmailService from '../../emailService';

class AdminConfigService {
  private ConfigRepository;

  constructor() {
    this.ConfigRepository = ConfigModel;
  }

  async seedInitialConfig() {
    for (const config of InitialConfigs) {
      const existing = await this.ConfigRepository.findOne({ key: config.key });
      if (!existing) {
        await this.ConfigRepository.create(config);
        console.log(`✅ Seeded config: ${config.key}`);
      }
    }
  }

  private validateKey(key: string) {
    if (!key || !isString(key) || isEmpty(key.trim())) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Invalid or missing config key'
      );
    }
  }

  private validateValue(value: any) {
    if (value === undefined || value === null) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Invalid or missing config value'
      );
    }
  }

  async findConfig(key: string) {
    this.validateKey(key);
    return this.ConfigRepository.findOne({ key });
  }

  async createConfig(key: string, value: any) {
    this.validateKey(key);
    this.validateValue(value);

    const existingConfig = await this.findConfig(key);
    if (existingConfig) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Config already exists');
    }

    return await this.ConfigRepository.create({ key, value });
  }

  async deleteConfig(key: string) {
    this.validateKey(key);

    const existingConfig = await this.findConfig(key);
    if (!existingConfig) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
    }

    return this.ConfigRepository.deleteOne({ key });
  }

  async editConfig(key: string, newData: any) {
    this.validateKey(key);
    this.validateValue(newData);

    const existingConfig = await this.findConfig(key);
    if (!existingConfig) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
    }

    await this.ConfigRepository.findOneAndUpdate(
      { key },
      {
        $set: {
          value: newData,
        },
      },
      {
        new: true,
      }
    );
    if (key === BaseConfigKeys.EMAIL_CONFIG) {
      const emailService = EmailService.getInstance();
      try {
        await emailService.refreshConfig();
      } catch (error) {
        if (error instanceof Error)
          throw new ApiError(RESPONSE_CODE.BAD_REQUEST, error.message);
      }
    }
  }

  async getConfig(key: string) {
    this.validateKey(key);

    const existingConfig = await this.ConfigRepository.findOne({ key });

    if (!existingConfig) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Config does not exist');
    }
    return existingConfig;
  }

  async getAllConfig() {
    return await this.ConfigRepository.find().exec();
  }
}

export default AdminConfigService;

export const configService = new AdminConfigService();
