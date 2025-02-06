import executeQuery, { QueryResult } from '../queries.ts';

class TasksTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableAuvoTaskStatus();
      await this.createTableAuvoTaskPriorities();
      await this.createTableAuvoTaskTypes();
      await this.createTableAuvoTaskTypeRequirements();
      await this.createTableAuvoTasks();
      await this.createTableAuvoTaskAttachments();
      await this.createTableAuvoQuestionnairesAnswers();
    } catch (error) {
      throw new Error(
        `Falha na criação das tabelas: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableAuvoTaskStatus(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_task_status\` (
        \`taskStatusId\` INT NOT NULL,
        \`statusDescription\` VARCHAR(100) NULL,
        PRIMARY KEY (\`taskStatusId\`)
      ) ENGINE = InnoDB;
    `;
    return executeQuery(sql);
  }

  async createTableAuvoTaskPriorities(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_task_priorities\` (
        \`taskPriorityId\` INT NOT NULL,
        \`priorityDescription\` VARCHAR(100) NULL,
        PRIMARY KEY (\`taskPriorityId\`)
      ) ENGINE = InnoDB;
    `;
    return executeQuery(sql);
  }

  async createTableAuvoTaskTypes(): Promise<QueryResult> {
    const sql = `CREATE TABLE IF NOT EXISTS \`auvo_task_types\` (
  \`taskTypeId\` INT NOT NULL,
  \`userCreatorId\` INT NOT NULL,
  \`standardQuestionnaireId\` INT NOT NULL,
  \`description\` TEXT NULL,
  \`creationDate\` DATETIME NULL,
  \`standardTime\` TIME NULL,
  \`toleranceTime\` TIME NULL,
  \`active\` TINYINT NULL,
  PRIMARY KEY (\`taskTypeId\`, \`userCreatorId\`),
  INDEX \`idx_standardQuestionnaireId\` (\`standardQuestionnaireId\` ASC),
  CONSTRAINT \`fk_task_types_questionnaires\`
    FOREIGN KEY (\`standardQuestionnaireId\`)
    REFERENCES \`auvo_questionnaires\` (\`questionnaireId\`),
  CONSTRAINT \`fk_task_types_users\`
    FOREIGN KEY (\`userCreatorId\`)
    REFERENCES \`auvo_users\` (\`userId\`)
) ENGINE = InnoDB;
`;
    return executeQuery(sql);
  }

  async createTableAuvoTaskTypeRequirements(): Promise<QueryResult> {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`auvo_task_type_requirements\` (
        \`taskTypeRequirementId\` INT NOT NULL AUTO_INCREMENT,
        \`fk_TaskTypeId\` INT NOT NULL,
        \`fillReport\` TEXT NULL,
        \`requiresSignature\` TINYINT NULL,
        \`minimumPhotos\` INT NULL DEFAULT 0,
        \`isRequired\` TINYINT NULL DEFAULT NULL,
        PRIMARY KEY (\`taskTypeRequirementId\`),
        INDEX \`idx_fkTaskTypeId\` (\`fk_TaskTypeId\` ASC),
        UNIQUE INDEX \`taskTypeId_unique\` (\`fk_TaskTypeId\` ASC),
        CONSTRAINT \`fk_task_type_requirements_task_types\`
          FOREIGN KEY (\`fk_TaskTypeId\`)
          REFERENCES \`auvo_task_types\` (\`taskTypeId\`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION
      ) ENGINE = InnoDB;
    `;
    return executeQuery(sql);
  }

  async createTableAuvoTasks(): Promise<QueryResult> {
    const sql = `CREATE TABLE IF NOT EXISTS \`auvo_tasks\` (
    \`taskId\` INT NOT NULL,
    \`fk_userFromId\` INT NOT NULL,
    \`fk_userToId\` INT NOT NULL,
    \`fk_taskPriorityId\` INT NOT NULL,
    \`fk_customerId\` INT NOT NULL,
    \`fk_taskStatusId\` INT NOT NULL,
    \`fk_taskTypeId\` INT NOT NULL,
    \`externalId\` INT NULL,
    \`taskDate\` DATETIME NULL,
    \`taskCreationDate\` DATETIME NULL,
    \`orientation\` TEXT NULL,
    \`deliveredOnSmarthPhone\` TINYINT NULL,
    \`deliveredDate\` DATETIME NULL,
    \`finished\` TINYINT NULL,
    \`report\` TEXT NULL,
    \`visualized\` TINYINT NULL,
    \`visualizedDate\` DATETIME NULL,
    \`checkIn\` TINYINT NULL,
    \`checkInDate\` DATETIME NULL,
    \`checkOut\` TINYINT NULL,
    \`checkOutDate\` DATETIME NULL,
    \`checkinType\` INT NULL,
    \`inputedKm\` DECIMAL(10,2) NULL,
    \`adoptedKm\` DECIMAL(10,2) NULL,
    \`signatureUrl\` TEXT NULL,
    \`checkInDistance\` DECIMAL(10,2) NULL,
    \`checkOutDistance\` DECIMAL(10,2) NULL,
    \`taskUrl\` TEXT NULL,
    \`pendency\` TEXT NULL,
    \`dateLastUpdate\` DATETIME NULL,
    \`displacementStart\` DATETIME NULL,
    PRIMARY KEY (\`taskId\`),
    INDEX \`fk_tasks_auvo_users_auvo1_idx\` (\`fk_userFromId\`),
    INDEX \`fk_tasks_auvo_users_auvo2_idx\` (\`fk_userToId\`),
    INDEX \`fk_tasks_auvo_customers_auvo1_idx\` (\`fk_customerId\`),
    INDEX \`fk_tasks_auvo_task_status1_idx\` (\`fk_taskStatusId\`),
    INDEX \`fk_tasks_auvo_task_priorities1_idx\` (\`fk_taskPriorityId\`),
    INDEX \`fk_tasks_auvo_task_types1_idx\` (\`fk_taskTypeId\`),
    CONSTRAINT \`fk_tasks_auvo_users_auvo1\`
      FOREIGN KEY (\`fk_userFromId\`)
      REFERENCES \`auvo_users\` (\`userId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_tasks_auvo_users_auvo2\`
      FOREIGN KEY (\`fk_userToId\`)
      REFERENCES \`auvo_users\` (\`userId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_tasks_auvo_customers_auvo1\`
      FOREIGN KEY (\`fk_customerId\`)
      REFERENCES \`auvo_customers\` (\`customerId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_tasks_auvo_task_status1\`
      FOREIGN KEY (\`fk_taskStatusId\`)
      REFERENCES \`auvo_task_status\` (\`taskStatusId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_tasks_auvo_task_priorities1\`
      FOREIGN KEY (\`fk_taskPriorityId\`)
      REFERENCES \`auvo_task_priorities\` (\`taskPriorityId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_tasks_auvo_task_types1\`
      FOREIGN KEY (\`fk_taskTypeId\`)
      REFERENCES \`auvo_task_types\` (\`taskTypeId\`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
) ENGINE = InnoDB;
`;
    return executeQuery(sql);
  }

  async createTableAuvoTaskAttachments(): Promise<QueryResult> {
    const sql = `CREATE TABLE IF NOT EXISTS \`auvo_task_attachments\`(
    \`attachmentId\` INT NOT NULL AUTO_INCREMENT,
    \`fk_taskId\` INT NOT NULL,
    \`url\` MEDIUMTEXT NULL DEFAULT NULL,
    \`attachmentType\` INT NULL DEFAULT NULL,
    \`subtitle\` MEDIUMTEXT NULL DEFAULT NULL,
    \`extension\` VARCHAR(50) NULL DEFAULT NULL,
    \`attachmentDescription\` TEXT NULL DEFAULT NULL,
    PRIMARY KEY (\`attachmentId\`, \`fk_taskId\`),
    INDEX \`fk_task_attachments_tasks1_idx\` (\`fk_taskId\`),
    CONSTRAINT \`fk_task_attachments_tasks1\`
    FOREIGN KEY (\`fk_taskId\`)
    REFERENCES \`auvo_tasks\` (\`taskId\`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    )
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8mb4
    COLLATE = utf8mb4_0900_ai_ci;`;
    return executeQuery(sql);
  }
  async createTableAuvoQuestionnairesAnswers(): Promise<QueryResult> {
    const sql = `
  CREATE TABLE IF NOT EXISTS \`auvo_questionnaire_answers\`(
    \`replyId\` INT NOT NULL,
    \`fk_questionId\` INT NOT NULL,
    \`fk_taskId\` INT NOT NULL,
    \`reply\` MEDIUMTEXT NULL,
    \`replyDate\` DATETIME NULL,
    PRIMARY KEY (\`replyId\`, \`fk_questionId\`, \`fk_taskId\`),
    INDEX \`fk_questionnaires_answers_tasks1_idx\` (\`fk_taskId\`),
    INDEX \`fk_questionnaires_answers_questionnaires_questions1_idx\` (\`fk_questionId\`),  -- Índice para a coluna fk_questionId
    CONSTRAINT \`fk_questionnaires_answers_questionnaires_questions1\`
      FOREIGN KEY (\`fk_questionId\`)
      REFERENCES \`auvo_questionnaire_questions\` (\`questionId\`)
      ON DELETE CASCADE
      ON UPDATE NO ACTION,
    CONSTRAINT \`fk_questionnaires_answers_tasks1\`
      FOREIGN KEY (\`fk_taskId\`)
      REFERENCES \`auvo_tasks\` (\`taskId\`)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
)
ENGINE = InnoDB;
`;
    return executeQuery(sql);
  }
}

export default new TasksTablesDefinitions();
