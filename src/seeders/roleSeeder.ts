import { RoleService } from "../services/roleService";
import { ISeeder } from "../types/common";

class RoleSeeder implements ISeeder{
private roleService: RoleService;

constructor() {
    this.roleService = new RoleService();
  }
  public async seed() {
    try {
      await this.roleService.seedRoles();
    } catch (error) {
      console.error('Error seeding seedRoles:', error);
    }
  }

}

export default RoleSeeder;