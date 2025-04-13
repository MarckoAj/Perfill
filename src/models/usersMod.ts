import { User, UserRefactored } from '../utils/auvoInterfaces.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import userRep from '../repositores/userRep.ts';
import BaseModel from './baseMod.ts';

class UsersModel extends BaseModel<User, UserRefactored> {
  protected repository = {
    selectById: userRep.selectById,
    update: userRep.updateEntity,
    insert: userRep.insertEntity,
  };

  constructor() {
    super('userID');
  }

  protected mapToDatabaseFormat(user: User): UserRefactored {
    const filterKeys: (keyof UserRefactored)[] = [
      'externalId',
      'name',
      'login',
      'email',
      'jobPosition',
      'fk_userType',
      'address',
      'registrationDate',
    ];

    const filteredUser: UserRefactored = {
      userId: user.userID,
      active: true,
    };

    filterKeys.forEach((key) => {
      if (
        key === 'fk_userType' &&
        typeof user.userType === 'object' &&
        'userTypeId' in user.userType
      ) {
        filteredUser.fk_userType = user.userType.userTypeId;
      } else {
        filteredUser[key] = user[key as keyof User] as never;
      }
    });

    return filteredUser;
  }

  async desactivateUser(user: User): Promise<QueryResult | null> {
    try {
      const userRefactored = this.mapToDatabaseFormat(user);
      const userInDatabase = await this.repository.selectById(user.userID);

      if (!userInDatabase) {
        console.warn(`Usuário com ID ${user.userID} não encontrado no banco de dados.`);
        return null;
      }

      userRefactored.name = `Inativo - ${userRefactored.name}`;
      userRefactored.active = false;

      return await this.repository.update(userRefactored);
    } catch (error) {
      console.error(`Erro ao desativar usuário: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }

  async addUsersList(list: User[]): Promise<(QueryResult | null)[]> {
    try {
      return await Promise.all(list.map((user) => this.synchronize(user)));
    } catch (error) {
      console.error(
        `Erro ao adicionar lista de usuários: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    }
  }
}

export default new UsersModel();
