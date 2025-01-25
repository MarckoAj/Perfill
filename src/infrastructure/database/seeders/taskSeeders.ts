import executeQuery, { QueryResult } from '../queries.js';

class TaskSeeders {
  async addAllSeeders(): Promise<void> {
    try {
      await this.seedDataTasksPriorities();
      await this.seedDataTaskTypes();
      await this.seedDataTaskStatus();
    } catch (error) {
      console.log(error);
    }
  }

  async seedDataTasksPriorities(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_task_priorities (taskPriorityId,priorityDescription)
    SELECT taskPriorityId,priorityDescription
    FROM (
    SELECT 1 AS taskPriorityId,"Low" AS priorityDescription
    UNION ALL
    SELECT 2 AS taskPriorityId,"Mediuim" AS priorityDescription
    UNION ALL
    SELECT 3 AS taskPriorityId,"High" AS priorityDescription
    )AS temp
    WHERE NOT EXISTS (
    SELECT 1 FROM auvo_task_priorities WHERE auvo_task_priorities.taskPriorityId = temp.taskPriorityId
    );
    `;
    return executeQuery(sql);
  }

  async seedDataTaskTypes(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_task_types (taskTypeId,userCreatorId,standardQuestionnaireId,description,creationDate,standardTime,toleranceTime,active)
    SELECT taskTypeId,userCreatorId,standardQuestionnaireId,\`description\`,creationDate,standardTime,toleranceTime,active
    FROM (
    SELECT 0 AS taskTypeId,0 AS userCreatorId,0 AS standardQuestionnaireId,"Tarefa sem tipo" AS \`description\` , now() AS creationDate, 0 AS standardTime, 0 AS toleranceTime, 1 AS active
    )AS temp
    WHERE NOT EXISTS (
    SELECT 1 FROM auvo_task_types WHERE auvo_task_types.taskTypeId = temp.taskTypeId
    );
    `;
    return executeQuery(sql);
  }

  async seedDataTaskStatus(): Promise<QueryResult> {
    const sql = `
 INSERT INTO auvo_task_status (taskStatusId,statusDescription)
    SELECT taskStatusId,statusDescription
    FROM (
    SELECT 1 AS taskStatusId,"Opened" AS statusDescription
    UNION ALL
    SELECT 2 AS taskStatusId,"InDisplacement" AS statusDescription
    UNION ALL
    SELECT 3 AS taskStatusId,"CheckedIn" AS statusDescription
    UNION ALL
    SELECT 4 AS taskStatusId,"CheckedOut" AS statusDescription
    UNION ALL
    SELECT 5 AS taskStatusId,"Finished" AS statusDescription
    UNION ALL
    SELECT 6 AS taskStatusId,"Paused" AS statusDescription
    )AS temp
    WHERE NOT EXISTS (
    SELECT 1 FROM auvo_task_status WHERE auvo_task_status.taskStatusId = temp.taskStatusId
    );
    `;
    return executeQuery(sql);
  }
}
export default new TaskSeeders();
