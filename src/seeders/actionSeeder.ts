import { ActionService } from "../services/actionService";
import { RoleService } from "../services/roleService";
import { ISeeder } from "../types/common";

class ActionSeeder implements ISeeder{
private actionService: ActionService;

constructor() {
    this.actionService = new ActionService();
  }
  public async seed() {
    try {
      await this.actionService.seedAction();
    } catch (error) {
      console.error('Error seeding seedAction:', error);
    }
  }

}

export default ActionSeeder;