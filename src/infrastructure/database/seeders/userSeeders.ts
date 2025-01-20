import executeQuery, { QueryResult } from '../queries.js';

class UserSeeders {
  async addAllSeeders(): Promise<void> {
    try {
      await this.seedDataUserTypes();
      await this.seedDataUsers();
    } catch (error) {
      console.log(error);
    }
  }

  async seedDataUserTypes(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_user_types (userTypeId, description)
SELECT temp.userTypeId, temp.description
FROM (
    SELECT 3 AS userTypeId, 'Admin' AS description
    UNION ALL
    SELECT 4 AS userTypeId, 'Main_Admin' AS description
    UNION ALL
    SELECT 1 AS userTypeId, 'User' AS description
) AS temp
WHERE NOT EXISTS (
    SELECT 1
    FROM auvo_user_types
    WHERE auvo_user_types.userTypeId = temp.userTypeId
);

    `;
    return executeQuery(sql);
  }

  async seedDataUsers(): Promise<QueryResult> {
    const sql = `
    INSERT INTO auvo_users (userId,\`name\`,fk_userType,\`registrationDate\`,\`active\`)
 SELECT temp.userId, temp.\`name\`, temp.fk_userType, temp.registrationDate, temp.active
 FROM(
      SELECT 0 AS userId, "NÃO ATRIBUIDO" AS \`name\`, 1 AS fk_userType, NOW() AS registrationDate, 1 AS active
   ) AS temp
   WHERE NOT EXISTS (
    SELECT 1 FROM auvo_users WHERE auvo_users.userId = temp.userId
    );
    `;
    return executeQuery(sql);
  }
}

export default new UserSeeders();
