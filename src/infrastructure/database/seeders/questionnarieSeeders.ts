import executeQuery, { QueryResult } from '../queries.ts';

class QuestionnarieSeeders {
  async addAllSeeders(): Promise<void> {
    try {
      await this.seedDataQuestionnaries();
    } catch (error) {
      console.log(error);
    }
  }

  async seedDataQuestionnaries(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_questionnaires (questionnaireId,\`description\`)
    SELECT questionnaireId,\`description\`
    FROM (
    SELECT 0 AS questionnaireId,"Selecione um questionario" AS \`description\`
    )AS temp
WHERE NOT EXISTS (
    SELECT 1 FROM auvo_questionnaires WHERE auvo_questionnaires.questionnaireId = temp.questionnaireId
    );
  `;
    return executeQuery(sql);
  }
}

export default new QuestionnarieSeeders();
