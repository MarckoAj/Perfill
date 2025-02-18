import { User, UserRefactored } from '../utils/auvoInterfaces.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import userRep from '../repositores/userRep.ts';
import { RowDataPacket } from 'mysql2';

class UsersModel {
  private filterUser(user: User): UserRefactored {
    const filterKeys: (keyof UserRefactored)[] = [
      'externalId',
      'name',
      'login',
      'email',
      'jobPosition',
      'userType',
      'address',
      'registrationDate',
    ];

    const filteredUser: UserRefactored = {
      userId: user.userID,
      active: true,
    };

    filterKeys.forEach((key) => {
      if (
        key === 'userType' &&
        typeof user.userType === 'object' &&
        'userTypeId' in user.userType
      ) {
        filteredUser.userType = user.userType.userTypeId;
      } else {
        filteredUser[key] = user[key as keyof User] as never;
      }
    });

    return filteredUser;
  }

  async addUser(user: User): Promise<QueryResult | null> {
    try {
      const userRefactored = this.filterUser(user);
      return await userRep.insertUser(userRefactored);
    } catch (error) {
      console.error(`Erro ao adicionar usuário: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }

  async updateUser(user: User): Promise<QueryResult | null> {
    try {
      const userRefactored = this.filterUser(user);
      return await userRep.updateUser(userRefactored);
    } catch (error) {
      console.error(`Erro ao atualizar usuário: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }

  async desactivateUser(user: User): Promise<QueryResult | null> {
    try {
      const userRefactored = this.filterUser(user);
      const userInDataBase = (await userRep.selectUserById(
        userRefactored.userId,
      )) as RowDataPacket[];

      if (!userInDataBase.length) {
        console.warn(`Usuário com ID ${userRefactored.userId} não encontrado no banco de dados.`);
        return null;
      }

      userRefactored.name = `Inativo - ${userRefactored.name}`;
      userRefactored.active = false;
      return await userRep.updateUser(userRefactored);
    } catch (error) {
      console.error(`Erro ao desativar usuário: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }

  async synchronizeUser(user: User): Promise<QueryResult | null> {
    try {
      const userInDataBase = (await userRep.selectUserById(user.userID)) as RowDataPacket[];
      return userInDataBase.length ? await this.updateUser(user) : await this.addUser(user);
    } catch (error) {
      console.error(
        `Erro ao sincronizar usuário: ${error instanceof Error ? error.message : error}`,
      );
      return null;
    }
  }

  async addUsersList(list: User[]): Promise<(QueryResult | null)[]> {
    try {
      return await Promise.all(list.map((user) => this.synchronizeUser(user)));
    } catch (error) {
      console.error(
        `Erro ao adicionar lista de usuários: ${error instanceof Error ? error.message : error}`,
      );
      return list.map(() => null);
    }
  }
}

export default new UsersModel();
