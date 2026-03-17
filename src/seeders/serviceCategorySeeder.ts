import { ServiceCategoryService } from '../services/admin/serviceCategory/serviceCategoryService';

import { ISeeder } from '../types/common';

class ServiceCategorySeeder implements ISeeder {
  private serviceCategoryService: ServiceCategoryService;

  constructor() {
    this.serviceCategoryService = new ServiceCategoryService();
  }
  public async seed() {
    await this.serviceCategoryService.seedServiceCategories();
  }
}

export default ServiceCategorySeeder;
