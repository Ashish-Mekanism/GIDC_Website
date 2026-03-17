import AdminAuthService from '../services/admin/auth';
import { IUser } from '../types/models';
import { ISeeder } from '../types/common';
import Config from '../config';
import AdminService from '../services/admin';
import { ACCOUNT_STATUS } from '../utils/constants';

class AdminSeeder implements ISeeder {
  private adminAuthService: AdminAuthService;
  private adminService: AdminService

  constructor() {
    this.adminAuthService = new AdminAuthService();
    this.adminService = new AdminService();
  }

  public async seed() {
    try {
      const adminUserData: Partial<IUser> = {
        email: Config.SUPER_ADMIN_EMAIL,
        password: Config.SUPER_ADMIN_PASSWORD,
        //first_name: 'Admin',
      };

      const admin = await this.adminService.findAdminByEmail(adminUserData?.email);
      if (admin) {
        return;
      }
      await this.adminAuthService.register(adminUserData);
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }
}

export default AdminSeeder;
