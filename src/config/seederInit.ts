import Seeder from '../seeders';
import ActionSeeder from '../seeders/actionSeeder';
import AdminSeeder from '../seeders/adminSeeder';
import AdminConfigSeeder from '../seeders/configSeeder';
import EmailTemplateSeeder from '../seeders/emailTemplateSeeder';
import RoleSeeder from '../seeders/roleSeeder';
import ServiceCategorySeeder from '../seeders/serviceCategorySeeder';
import logger from './logger';

const seederInit = () => {
  const seeder = new Seeder([
    new AdminSeeder(),
    new RoleSeeder(),
    new ActionSeeder(),
    new AdminConfigSeeder(),
    new ServiceCategorySeeder(),
    new EmailTemplateSeeder(),
  ]);
  seeder
    .seed()
    .then(() => {
      logger.info('          🌲All seeders completed.🌲       ');
    })
    .catch((error: any) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
};

export default seederInit;
