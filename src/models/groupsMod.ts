import { CustomerGroup, AuvoGroup } from '../utils/auvoInterfaces.ts';
import groupRep from '../repositories/groupRep.ts';
import BaseModel from './baseMod.ts';

class GroupsModel extends BaseModel<AuvoGroup, CustomerGroup> {
  protected repository = groupRep;

  protected mainKey: keyof CustomerGroup = 'groupId';

  protected mapToDatabaseFormat(group: AuvoGroup): CustomerGroup {
    return {
      groupId: group.id,
      description: group.description,
    };
  }
}

export default new GroupsModel();
