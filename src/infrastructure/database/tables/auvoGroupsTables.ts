import executeQuery, { QueryResult } from '../queries.ts';

class GroupsTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableGroups();
    } catch (error) {
      throw new Error(
        `Error creating Groups tables: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableGroups(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_groups\` (
        \`groupId\` INT NOT NULL,
        \`description\` TEXT NULL,
        PRIMARY KEY (\`groupId\`)
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4;`;
    return executeQuery(sql);
  }
}

export default new GroupsTablesDefinitions();
