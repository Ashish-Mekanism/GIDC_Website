import { configService } from '../services/admin/config';
import { ISeeder } from '../types/common';

class AdminConfigSeeder implements ISeeder {
  constructor() {}
  public async seed() {
    await configService.seedInitialConfig();
  }
}

export default AdminConfigSeeder;
