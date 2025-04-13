import AuvoService from './auvoApiRequests.ts';
import usersMod from '../models/usersMod.ts';
import { User } from '../utils/auvoInterfaces.ts';

const userList: User[] = await AuvoService.requestListComplete('Users');
await usersMod.addUsersList(userList);
