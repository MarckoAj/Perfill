import executeQuery from '../infrastructure/database/queries.js';
import { UserRefactored } from '../utils/auvoInterfaces.ts';

class UserRepository {
  selectUserById(userId: number) {
    const sql = `SELECT * FROM auvo_users WHERE userId  = ?`;
    return executeQuery(sql, userId);
  }

  insertUser(user: UserRefactored) {
    const sql =
      'INSERT INTO auvo_users  (userId, active, externalId, name, login, email, jobPosition, fk_userType, address, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = Object.values(user);
    return executeQuery(sql, values);
  }

  updateUser(user: UserRefactored) {
    const sql = `
        UPDATE auvo_users
        SET  active = ?, externalId = ?, name = ?, login = ?, email = ?, jobPosition = ?, fk_userType = ?, address = ?, registrationDate = ?  WHERE userId = ?`;
    const values = Object.values(user);
    values.push(values.shift());
    return executeQuery(sql, values);
  }
}

export default new UserRepository();
