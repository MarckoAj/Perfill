import { UserRefactored } from '../utils/auvoInterfaces.ts';
import BaseRepository from './baseRep.ts';

class UserRepository extends BaseRepository<UserRefactored> {
  constructor() {
    super({
      tableName: 'auvo_users',
      primaryKey: 'userId',
      columns: [
        'userId',
        'active',
        'externalId',
        'name',
        'login',
        'email',
        'jobPosition',
        'fk_userType',
        'address',
        'registrationDate',
      ],
    });
  }
}

const teste = new UserRepository();
const data = await teste.selectById(1);
console.log(data);

export default new UserRepository();
