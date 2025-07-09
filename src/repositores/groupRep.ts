import BaseRepository from './baseRep.ts';
import { CustomerGroup } from '../utils/auvoInterfaces.ts';
import { bindPublicMethods } from '../utils/bindMethods.ts';

class GroupsRepository extends BaseRepository<CustomerGroup> {
  protected get tableName(): string {
    return 'auvo_groups';
  }

  protected get primaryKey(): keyof CustomerGroup {
    return 'groupId';
  }

  protected get columns(): (keyof CustomerGroup)[] {
    return ['groupId', 'description'];
  }
  super() {
    bindPublicMethods(this);
  }
}

export default new GroupsRepository();
