import BaseRepository from './baseRep.ts';
import { CustomerGroup } from '../utils/auvoInterfaces.ts';

class groupsRepository extends BaseRepository<CustomerGroup> {
  protected tableName = 'auvo_segments';

  protected get primaryKey(): keyof CustomerGroup {
    return 'groupId';
  }

  protected get columns(): (keyof CustomerGroup)[] {
    return ['groupId', 'description'];
  }
}

export default new groupsRepository();
