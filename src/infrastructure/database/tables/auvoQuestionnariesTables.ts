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
      \`questionnaireId\` INT NOT NULL,
     \`description\` TEXT NULL,
      \`header\` TEXT NULL,
      \`footer\` TEXT NULL,
      \`creationDate\` DATETIME NULL,
      PRIMARY KEY (\`questionnaireId\`))
       ENGINE = InnoDB;`;

    return executeQuery(sql);
  }

  async createTableQuestionnariesQuestions(): Promise<QueryResult> {
    const sql = `
    CREATE TABLE IF NOT EXISTS \`perfilldb\`.\`auvo_questionnaire_questions\` (
  \`questionId\` INT NOT NULL,
  \`questionnaireId\` INT NOT NULL,
  \`answerType\` INT NULL,
  \`description\` TEXT NULL,
  \`subtitle\` TEXT NULL,
  \`requiredAnswer\` TINYINT NOT NULL,
  \`creationDate\` DATETIME NULL,
  INDEX \`fk_questionnaires_has_questions_questionnaires1_idx\` (\`questionnaireId\`),
  PRIMARY KEY (\`questionId\`),  -- Definir questionId como chave primária
  CONSTRAINT \`fk_questionnaires_has_questions_questionnaires1\`
    FOREIGN KEY (\`questionnaireId\`)
    REFERENCES \`perfilldb\`.\`auvo_questionnaires\` (\`questionnaireId\`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB;

`;

    return executeQuery(sql);
  }
}
export default new QuestionnariesTablesDefinitions();
