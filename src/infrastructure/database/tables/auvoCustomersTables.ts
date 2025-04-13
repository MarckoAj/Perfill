import executeQuery, { QueryResult } from '../queries.ts';

class CustomersTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableCustomers();
    } catch (error) {
      throw new Error(
        `Falha na criação das tabelas de Customers: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableCustomers(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers\` (
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
        CONSTRAINT \`fk_customers_segments2\`
          FOREIGN KEY (\`fk_segmentId\`)
          REFERENCES \`auvo_segments\` (\`segmentId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4;`;

    return executeQuery(sql);
  }
}

export default new CustomersTablesDefinitions();
