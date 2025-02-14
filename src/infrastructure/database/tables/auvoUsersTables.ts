import executeQuery, { QueryResult } from '../queries.ts';

class UsersTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableUsersTypes();
      await this.createTableUsers();
    } catch (error) {
      console.error(
        `Erro ao criar tabelas de usuários: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(
        `Falha na criação das tabelas de usuários: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableUsersTypes(): Promise<QueryResult> {
    const sql: string = `
      CREATE TABLE IF NOT EXISTS \`auvo_user_types\` (
        \`userTypeId\` INT NOT NULL,
        \`description\` TEXT NULL DEFAULT NULL,
        PRIMARY KEY (\`userTypeId\`)
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4;
    `;
    return executeQuery(sql);
  }

  async createTableUsers(): Promise<QueryResult> {
    const sql: string = `
      CREATE TABLE IF NOT EXISTS \`auvo_users\` (
        \`userId\` INT NOT NULL,
        \`fk_userType\` INT NOT NULL,
        \`name\` VARCHAR(100) NULL DEFAULT NULL,
        \`externalId\` VARCHAR(200) NULL DEFAULT NULL,
        \`login\` VARCHAR(100) NULL DEFAULT NULL,
        \`email\` VARCHAR(100) NULL DEFAULT NULL,
        \`jobPosition\` VARCHAR(100) NULL DEFAULT NULL,
        \`address\` VARCHAR(255) NULL DEFAULT NULL,
        \`registrationDate\` DATETIME NULL,
        \`active\` tinyint,
        PRIMARY KEY (\`userId\`),
        INDEX \`fk_users_usersTypes_idx\` (\`fk_userType\` ASC) VISIBLE,
        CONSTRAINT \`fk_users_userTypes\`
          FOREIGN KEY (\`fk_userType\`)
          REFERENCES \`auvo_user_types\` (\`userTypeId\`)
          ON DELETE RESTRICT
      )
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb4;
    `;
    return executeQuery(sql);
  }
}

export default new UsersTablesDefinitions();
