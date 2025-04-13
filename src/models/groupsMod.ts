import { CustomerGroup, Group } from '../utils/auvoInterfaces.ts';
import groupRep from '../repositores/groupRep.ts';
import BaseModel from './baseMod.ts';

class GroupsModel extends BaseModel<Group, CustomerGroup> {
  protected repository = {
    selectById: groupRep.selectById,
    update: groupRep.updateEntity,
    insert: groupRep.insertEntity,
  };

  constructor() {
    super('id');
  }

  protected mapToDatabaseFormat(group: Group): CustomerGroup {
    return { groupId: group.id, description: group.description };
  }
}

export default new GroupsModel();
