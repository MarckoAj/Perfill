import executeQuery from '../infrastructure/database/queries.ts';
import { CustomerGroup } from '../utils/auvoInterfaces.ts';

class groupsRepository {
  selectGroupById(groupId: number) {
    const sql = 'SELECT * FROM `auvo_groups` WHERE groupId = ?';
    return executeQuery(sql, groupId);
  }

  insertGroup(group: CustomerGroup) {
    const sql = 'INSERT INTO `auvo_groups` (groupId, description) VALUES (?, ?)';
    const values = Object.values(group);
    return executeQuery(sql, values);
  }

  updateGroup(group: CustomerGroup) {
    const sql = 'UPDATE auvo_groups  SET  `description` = ? WHERE groupId = ?;';
    return executeQuery(sql, [group.description, group.groupId]);
  }
}

export default new groupsRepository();
