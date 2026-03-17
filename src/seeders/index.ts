import { ISeeder } from '../types/common';

class Seeder implements ISeeder {
  private seeders: ISeeder[];

  constructor(seeders: ISeeder[]) {
    this.seeders = seeders;
  }

  public async seed() {
    for (const seeder of this.seeders) {
      try {
        await seeder.seed();
      } catch (error) {
        console.error(
          `Error during seeding with ${seeder.constructor.name}:`,
          error
        );
      }
    }
  }
}

export default Seeder;
