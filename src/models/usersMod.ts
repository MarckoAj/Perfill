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
  protected mainKey: keyof UserRefactored = 'userId';

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
}

const userList2 = [
  {
    userID: 179747,
    externalId: '',
    name: 'Ueder Pereira de Souza Alves',
    smartPhoneNumber: '',
    login: 'ueder.pereira',
    email: '',
    culture: 'pt-BR',
    jobPosition: 'Tecnico de Instalação',
    userType: { userTypeId: 1, description: 'User' },
    address: 'Barreiras, BA, Brasil',
    latitude: -12.14764,
    longitude: -44.9949,
    workDaysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    startWorkHour: '08:00:00',
    endWorkHour: '18:00:00',
    startLunchHour: '12:00:00',
    endLunchHour: '14:00:00',
    hourValue: 0,
    pictureUrl: '',
    basePoint: {
      address: 'Barreiras, BA, Brasil',
      latitude: -12.14764,
      longitude: -44.9949,
    },
    openTaskInPlace: false,
    grabGalleryPhotos: true,
    gpsFrequency: 300,
    checkInManual: true,
    unavailableForTasks: false,
    editTaskAfterCheckout: true,
    informStartTravel: true,
    changeBasePoint: true,
    registrationDate: '2024-11-13T15:59:47',
    monitoringNotification: { gpsActivation: 0, gpsDisabling: 0, appLogin: 0, appLogout: 0 },
    employeeNotification: { basePointChange: 0 },
    clientNotification: { adressChange: 0 },
    taskNotification: {
      checkIn: 0,
      checkout: 0,
      rescheduling: 0,
      travelStart: 0,
      researchAnswer: 0,
      delay: 0,
      taskDelete: 0,
    },
  },
  {
    userID: 139816,
    externalId: '',
    name: 'Valdieres Mendes dos Santos',
    smartPhoneNumber: '',
    login: 'valdieres.mendes',
    email: '',
    culture: 'pt-BR',
    jobPosition: 'Tecnico de Instalação e Manutenção',
    userType: { userTypeId: 1, description: 'User' },
    address: 'Porto Seguro, Porto Seguro-BA, 45810-000',
    latitude: -16.45097,
    longitude: -39.06462,
    workDaysOfWeek: [1, 2, 3, 4, 5, 6, 7],
    startWorkHour: '08:00:00',
    endWorkHour: '18:00:00',
    startLunchHour: '12:00:00',
    endLunchHour: '14:00:00',
    hourValue: 14.8,
    pictureUrl: '',
    basePoint: {
      address: 'Porto Seguro, Porto Seguro-BA, 45810-000',
      latitude: -16.45097,
      longitude: -39.06462,
    },
    openTaskInPlace: false,
    grabGalleryPhotos: true,
    gpsFrequency: 60,
    checkInManual: true,
    unavailableForTasks: false,
    editTaskAfterCheckout: true,
    informStartTravel: true,
    changeBasePoint: false,
    registrationDate: '2023-06-30T16:38:33',
    monitoringNotification: { gpsActivation: 0, gpsDisabling: 0, appLogin: 0, appLogout: 0 },
    employeeNotification: { basePointChange: 0 },
    clientNotification: { adressChange: 0 },
    taskNotification: {
      checkIn: 0,
      checkout: 0,
      rescheduling: 0,
      travelStart: 0,
      researchAnswer: 0,
      delay: 0,
      taskDelete: 0,
    },
  },
];

const teste = new UsersModel();
const listaRefatorada = await teste.addList(userList2);
console.log(listaRefatorada);
export default new UsersModel();
