import executeQuery, { QueryResult } from '../queries.ts';

class SegmentsTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableSegments();
    } catch (error) {
      throw new Error(
        `Error creating Segments tables: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableSegments(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_segments\` (
        \`segmentId\` INT NOT NULL,
        \`description\` VARCHAR(100) NULL,
        \`registrationDate\` DATETIME NULL,
        PRIMARY KEY (\`segmentId\`)
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4;`;
    return executeQuery(sql);
  }
}

export default new SegmentsTablesDefinitions();
