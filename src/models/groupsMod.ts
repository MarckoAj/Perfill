import { QueryResult, RowDataPacket } from 'mysql2';
import { CustomerGroup, Group } from '../utils/auvoInterfaces.ts';
import groupRep from '../repositores/groupRep.ts';

class GroupsModel {
  async synchronizeGroup(group: Group): Promise<QueryResult | null> {
    const groupRefatored: CustomerGroup = { groupId: group.id, description: group.description };
    try {
      const groupInDatabase = (await groupRep.selectGroupById(group.id)) as RowDataPacket[];
      return groupInDatabase.length
        ? await groupRep.updateGroup(groupRefatored)
        : await groupRep.insertGroup(groupRefatored);
    } catch (error) {
      console.error(`Erro ao sincronizar grupo: ${error instanceof Error ? error.message : error}`);
    }
    return null;
  }

  async addGroupsList(list: Group[]): Promise<(QueryResult | null)[]> {
    try {
      return await Promise.all(list.map((group: Group) => this.synchronizeGroup(group)));
    } catch (error) {
      console.error(
        `Erro ao adicionar lista de grupos: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    }
  }
}

export default new GroupsModel();
