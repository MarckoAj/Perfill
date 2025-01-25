import executeQuery, { QueryResult } from '../queries.js';

class CustomersTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableCustomers();
    } catch (error) {
      throw new Error(
        `Error creating Customers tables : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableCustomers(): Promise<QueryResult> {
    const sql = `CREATE TABLE IF NOT EXISTS \`perfilldb\`.\`auvo_customers\` (
      \`customerId\` INT NOT NULL,
      \`fk_segmentId\` INT NOT NULL,
      \`externalId\` VARCHAR(200) NULL,
      \`description\` TEXT NULL,
      \`cpfCnpj\` VARCHAR(50) NULL,
      \`manager\` VARCHAR(100) NULL,
      \`note\` TEXT NULL,
      \`address\` TEXT NULL,
      \`addressComplement\` TEXT NULL,
      \`latitude\` VARCHAR(30) NULL,
      \`longitude\` VARCHAR(30) NULL,
      \`uriAttachments\` TEXT NULL,
      \`active\` TINYINT NULL,
      \`dateLastUpdate\` DATETIME NULL,
      \`creationDate\` DATETIME NULL,
      PRIMARY KEY (\`customerId\`),
      CONSTRAINT \`fk_customers_segments1\`
          FOREIGN KEY (\`fk_segmentId\`)
          REFERENCES \`perfilldb\`.\`auvo_segments\` (\`segmentId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
  ) ENGINE = InnoDB;`;

    return executeQuery(sql);
  }
}

export default new CustomersTablesDefinitions();
