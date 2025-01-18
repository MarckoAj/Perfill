import auvoUsersTables from './tables/auvoUsersTables.js';
import auvoSegmentsTables from './tables/auvoSegmentsTables.js';
import auvoGroupsTables from './tables/auvoGroupsTables.js';
import auvoCustomersTables from './tables/auvoCustomersTables.js';
import auvoQuestionnariesTables from './tables/auvoQuestionnariesTables.js';
import auvoTasksTables from './tables/auvoTasksTables.js';
class DefinitionAuvoDb {
  async init(): Promise<void> {
    try {
      await this.createTables();
      // await this.updateTriggers();
      // await this.updateDbFunctions();
      // await this.seedData();
    } catch (error) {
      console.log(error);
    }
  }

  async createTables(): Promise<void> {
    try {
      await auvoUsersTables.createAllTables();
      await auvoSegmentsTables.createAllTables();
      await auvoGroupsTables.createAllTables();
      await auvoCustomersTables.createAllTables();
      await auvoQuestionnariesTables.createAllTables();
      await auvoTasksTables.createAllTables();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async seedData() {}

  // async updateDbFunctions() {}

  // async updateTriggers() {}
}

export default new DefinitionAuvoDb();
