import auvoUsersTables from './tables/auvoUsersTables.js';

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

  async createTables() {
    try {
      await auvoUsersTables.createAllTables();
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
