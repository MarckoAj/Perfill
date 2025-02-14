import auvoService from '../api/auvoApiRequests.ts';
import { User, UserRefactored } from '../utils/auvoInterfaces.ts';

class UsersModel {
  filterUser(user: User): UserRefactored {
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
      if (key === 'userType' && typeof user.userType === 'object') {
        filteredUser.userType = user.userType.userTypeId;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filteredUser as any)[key] = user[key as keyof User];
      }
    });

    return filteredUser;
  }
}

export default UsersModel;
const userModel = new UsersModel();
const teste: User[] = (await auvoService.requestListComplete('users')) as User[];
const testeRefatorado = teste.map((obj) => userModel.filterUser(obj));
console.log(testeRefatorado);
