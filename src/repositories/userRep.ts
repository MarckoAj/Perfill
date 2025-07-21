import { UserRefactored } from '../utils/auvoInterfaces.ts';
import BaseRepository from './baseRep.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class UserRepository extends BaseRepository<UserRefactored> {
  protected get tableName(): string {
    return 'auvo_users';
  }

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
  constructor() {
    super();
    bindPublicMethods(this);
  }
}

export default new UserRepository();
