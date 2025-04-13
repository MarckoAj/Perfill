import { UserRefactored } from '../utils/auvoInterfaces.ts';

import BaseRepository from './baseRep.ts';

class UserRepository extends BaseRepository<UserRefactored> {
  protected tableName = 'auvo_users';

  protected get primaryKey(): keyof UserRefactored {
    return 'userId';
  }

  protected get columns(): (keyof UserRefactored)[] {
    return [
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
    ];
  }
}

export default new UserRepository();
