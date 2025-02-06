import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/connection.ts';
import executeQuery from '../../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2/promise';
import { clearDbTables } from '../../utils/testsDbfunctions.ts';

import { sqlDataCheck, isRowDataPacketArray } from '../../utils/testsDbfunctions.ts';

(async () => {
  let originalDBName: string | undefined;

  beforeAll(async () => {
    originalDBName = process.env.DBNAME;
    await definitionDb.createTables();
    await definitionDb.seedData();
  });

  afterAll(async () => {
    process.env.DBNAME = originalDBName;
    await clearDbTables(process.env.DBNAME as string);

    if (pool) {
      await pool.end();
    }
  });

  describe('Verifica se as informações iniciais das tabelas dos Usuários foram adicionadas', () => {
    it(`Informações iniciais de auvo_user_types devem existir no banco de dados`, async () => {
      const seedData = [
        { description: 'USER', userTypeId: 1 },
        { description: 'ADMIN', userTypeId: 3 },
        { description: 'MAIN_ADMIN', userTypeId: 4 },
      ];
      const sql = sqlDataCheck('auvo_user_types', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });

    it(`Informações iniciais de auvo_users devem existir no banco de dados`, async () => {
      const seedData = [
        {
          active: 1,
          address: null,
          basePoint: null,
          email: null,
          externalId: null,
          fk_userType: 1,
          jobPosition: null,
          login: null,
          name: 'NOT_ASSIGNED',
          registrationDate: null,
          userId: 0,
        },
      ];
      const sql = sqlDataCheck('auvo_users', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });

  describe('Verifica se as informações iniciais das tabelas dos Segmentos foram adicionadas', () => {
    it(`Informações iniciais de auvo_segments devem existir no banco de dados`, async () => {
      const seedData = [
        { description: 'NOT_ASSIGNED', registrationDate: null, segmentId: 0 },
        { description: 'SELECT', registrationDate: null, segmentId: 22923 },
      ];
      const sql = sqlDataCheck('auvo_segments', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });

  describe('Verifica se as informações iniciais das tabelas dos Questionários foram adicionadas', () => {
    it(`Informações iniciais de auvo_questionnaires devem existir no banco de dados`, async () => {
      const seedData = [
        {
          creationDate: null,
          description: 'SELECT',
          footer: null,
          header: null,
          questionnaireId: 0,
        },
      ];
      const sql = sqlDataCheck('auvo_questionnaires', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });

  describe('Verifica se as informações iniciais das tabelas das Tarefas foram adicionadas', () => {
    it(`Informações iniciais de auvo_task_priorities devem existir no banco de dados`, async () => {
      const seedData = [
        {
          priorityDescription: 'LOW',
          taskPriorityId: 1,
        },
        { priorityDescription: 'MEDIUM', taskPriorityId: 2 },
        { priorityDescription: 'HIGH', taskPriorityId: 3 },
      ];
      const sql = sqlDataCheck('auvo_task_priorities', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });

    it(`Informações iniciais de auvo_task_types devem existir no banco de dados`, async () => {
      const seedData = [
        {
          active: 1,
          description: 'SELECT',
          creationDate: null,
          standardQuestionnaireId: 0,
          standardTime: '00:00:00',
          taskTypeId: 0,
          toleranceTime: '00:00:00',
          userCreatorId: 0,
        },
      ];
      const sql = sqlDataCheck('auvo_task_types', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });

    it(`Informações iniciais de auvo_task_status devem existir no banco de dados`, async () => {
      const seedData = [
        {
          statusDescription: 'Opened',
          taskStatusId: 1,
        },
        {
          statusDescription: 'InDisplacement',
          taskStatusId: 2,
        },
        {
          statusDescription: 'CheckedIn',
          taskStatusId: 3,
        },
        {
          statusDescription: 'CheckedOut',
          taskStatusId: 4,
        },
        {
          statusDescription: 'Finished',
          taskStatusId: 5,
        },
        {
          statusDescription: 'Paused',
          taskStatusId: 6,
        },
      ];
      const sql = sqlDataCheck('auvo_task_status', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });
})();
