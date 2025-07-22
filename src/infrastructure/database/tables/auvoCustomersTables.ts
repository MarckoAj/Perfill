import executeQuery, { QueryResult } from '../queries.ts';

class CustomersTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableCustomers();
      await this.createTableCustomersGroups();
      await this.createTableCustomersManagers();
      await this.createTableCustomersContacts();
      await this.createTableCustomersUriAttachments();
      await this.createTableCustomersEmails();
    } catch (error) {
      throw new Error(
        `Falha na criação das tabelas de Customers: ${
          error instanceof Error ? error.message : String(error)
        }`,
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

  async createTableCustomersGroups(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers_groups\` (
        \`fk_customerId\` INT NOT NULL,
        \`fk_groupId\` INT NOT NULL,
        PRIMARY KEY (\`fk_customerId\`, \`fk_groupId\`),
        INDEX \`fk_customer_has_groups_groups1_idx\` (\`fk_groupId\` ASC),
        INDEX \`fk_customer_has_groups_customer1_idx\` (\`fk_customerId\` ASC),
        CONSTRAINT \`fk_customer_has_groups_customer1\`
          FOREIGN KEY (\`fk_customerId\`)
          REFERENCES \`auvo_customers\` (\`customerId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT \`fk_customer_has_groups_groups1\`
          FOREIGN KEY (\`fk_groupId\`)
          REFERENCES \`auvo_groups\` (\`groupId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB;`;
    return executeQuery(sql);
  }

  async createTableCustomersManagers(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers_managers\` (
        \`fk_userId\` INT NOT NULL,
        \`fk_customerId\` INT NOT NULL,
        INDEX \`fk_users_has_customer_customer1_idx\` (\`fk_customerId\` ASC),
        INDEX \`fk_users_has_customer_users1_idx\` (\`fk_userId\` ASC),
        CONSTRAINT \`fk_users_has_customer_users1\`
          FOREIGN KEY (\`fk_userId\`)
          REFERENCES \`auvo_users\` (\`userId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT \`fk_users_has_customer_customer1\`
          FOREIGN KEY (\`fk_customerId\`)
          REFERENCES \`auvo_customers\` (\`customerId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb3;`;
    return executeQuery(sql);
  }

  async createTableCustomersContacts(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers_contacts\` (
        \`contactId\` INT NOT NULL,
        \`fk_customerId\` INT NOT NULL,
        \`description\` TEXT NULL,
        \`contactJobPosition\` VARCHAR(45) NULL,
        \`contactEmail\` VARCHAR(45) NULL,
        \`contactPhone\` VARCHAR(45) NULL,
        \`contactName\` VARCHAR(45) NULL,
        INDEX \`fk_contacts_customers1_idx\` (\`fk_customerId\` ASC),
        CONSTRAINT \`fk_contacts_customers1\`
          FOREIGN KEY (\`fk_customerId\`)
          REFERENCES \`auvo_customers\` (\`customerId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB;`;
    return executeQuery(sql);
  }

  async createTableCustomersUriAttachments(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers_uri_attachments\` (
        \`fk_customerId\` INT NOT NULL,
        \`uri\` TEXT NULL,
        INDEX \`fk_uri_customers1_idx\` (\`fk_customerId\`),
        CONSTRAINT \`fk_uri_customers1\`
          FOREIGN KEY (\`fk_customerId\`)
          REFERENCES \`auvo_customers\` (\`customerId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB;`;
    return executeQuery(sql);
  }

  async createTableCustomersEmails(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_customers_emails\` (
        \`fk_customerId\` INT NOT NULL,
        \`customer_email\` VARCHAR(45) NULL,
        INDEX \`fk_emails_customers1_idx\` (\`fk_customerId\`),
        CONSTRAINT \`fk_emails_customers1\`
          FOREIGN KEY (\`fk_customerId\`)
          REFERENCES \`auvo_customers\` (\`customerId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      )
      ENGINE = InnoDB;`;
    return executeQuery(sql);
  }
}

export default new CustomersTablesDefinitions();
