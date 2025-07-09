import { CustomerGroup, Group } from '../utils/auvoInterfaces.ts';
import groupRep from '../repositores/groupRep.ts';
import BaseModel from './baseMod.ts';

class GroupsModel extends BaseModel<Group, CustomerGroup> {
  protected repository = groupRep;

  protected mainKey: keyof CustomerGroup = 'groupId';

  protected mapToDatabaseFormat(group: Group): CustomerGroup {
    return {
      groupId: group.id,
      description: group.description,
    };
  }
}

export default new GroupsModel();
