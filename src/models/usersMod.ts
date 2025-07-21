import { AuvoUser, UserRefactored, UserType } from '../utils/auvoInterfaces.ts';
import { QueryResult } from '../infrastructure/database/queries.ts';
import userRep from '../repositories/userRep.ts';
import BaseModel from './baseMod.ts';

type UserRequiredFields = Partial<Omit<AuvoUser, 'userID' | 'UserType'>> & {
  userID: number;
  userType: UserType;
};

class UsersModel extends BaseModel<UserRequiredFields, UserRefactored> {
  protected repository = userRep;
  protected mainKey: keyof UserRefactored = 'userId';

  protected mapToDatabaseFormat(user: AuvoUser): UserRefactored {
    const mappedUser: UserRefactored = {
      userId: user.userID,
      externalId: user.externalId,
      name: user.name,
      login: user.login,
      email: user.email,
      jobPosition: user.jobPosition,
      fk_userType: user.userType.userTypeId,
      address: user.address,
      registrationDate: user.registrationDate,
      active: true,
    };

    return mappedUser;
  }

  async desactivateUser(user: AuvoUser): Promise<QueryResult | null> {
    try {
      const userRefactored = this.mapToDatabaseFormat(user);
      const userInDatabase = await this.repository.selectById(user.userID);

      if (!userInDatabase) {
        console.warn(`Usuário com ID ${user.userID} não encontrado no banco de dados.`);
        return null;
      }

      userRefactored.name = `Inativo - ${userRefactored.name}`;
      userRefactored.active = false;

      return await this.repository.updateEntity(userRefactored);
    } catch (error) {
      console.error(`Erro ao desativar usuário: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }
}
export default new UsersModel();
