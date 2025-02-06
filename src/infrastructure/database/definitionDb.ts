import auvoUsersTables from './tables/auvoUsersTables.ts';
import auvoSegmentsTables from './tables/auvoSegmentsTables.ts';
import auvoGroupsTables from './tables/auvoGroupsTables.ts';
import auvoCustomersTables from './tables/auvoCustomersTables.ts';
import auvoQuestionnariesTables from './tables/auvoQuestionnairesTables.ts';
import auvoTasksTables from './tables/auvoTasksTables.ts';

import userSeeders from './seeders/userSeeders.ts';
import segmentSeeders from './seeders/segmentSeeders.ts';
import questionnarieSeeders from './seeders/questionnarieSeeders.ts';
import taskSeeders from './seeders/taskSeeders.ts';

class DefinitionAuvoDb {
  async init(): Promise<void> {
    try {
      await this.createTables();
      // await this.updateTriggers();
      // await this.updateDbFunctions();
      await this.seedData();
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

  async seedData(): Promise<void> {
    try {
      await userSeeders.addAllSeeders();
      await segmentSeeders.addAllSeeders();
      await questionnarieSeeders.addAllSeeders();
      await taskSeeders.addAllSeeders();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // async updateDbFunctions() {}

  // async updateTriggers() {}
}

export default new DefinitionAuvoDb();
