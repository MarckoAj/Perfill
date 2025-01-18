import executeQuery, { QueryResult } from '../queries.js';

class QuestionnariesTablesDefinitions {
  async createAllTables(): Promise<void> {
    try {
      await this.createTableQuestionnaries();
      await this.createTableQuestionnariesQuestions();
    } catch (error) {
      throw new Error(
        `Error creating Questionnaries tables : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createTableQuestionnaries(): Promise<QueryResult> {
    const sql = `
    CREATE TABLE IF NOT EXISTS \`perfilldb\`.\`auvo_questionnaires\` (
      \`questionaryId\` INT NOT NULL,
     \`description\` TEXT NULL,
      \`header\` TEXT NULL,
      \`footer\` TEXT NULL,
      \`creationDate\` DATETIME NULL,
      PRIMARY KEY (\`questionaryId\`))
       ENGINE = InnoDB;`;

    return executeQuery(sql);
  }

  async createTableQuestionnariesQuestions(): Promise<QueryResult> {
    const sql = `
    CREATE TABLE IF NOT EXISTS \`perfilldb\`.\`auvo_questionnaire_questions\` (
      \`questionId\` INT NOT NULL,
      \`fk_questionaryId\` INT NOT NULL,
      \`answerType\` INT NULL,
      \`description\` TEXT NULL,
      \`subtitle\` TEXT NULL,
      \`requiredAnswer\` TINYINT NOT NULL,
      \`creationDate\` DATETIME NULL,
      PRIMARY KEY (\`fk_questionaryId\`, \`questionId\`),
      CONSTRAINT \`fk_questionnaires_has_questions_questionnaires1\`
        FOREIGN KEY (\`fk_questionaryId\`)
        REFERENCES \`perfilldb\`.\`auvo_questionnaires\` (\`questionaryId\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
      ENGINE = InnoDB;`;

    return executeQuery(sql);
  }
}
export default new QuestionnariesTablesDefinitions();
