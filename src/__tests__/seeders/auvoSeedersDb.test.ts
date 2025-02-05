import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/conection.ts';
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

  describe('Verifica se informações iniciais das tabelas de Usuarios foram adicionados', () => {
    it(`Informações iniciais de auvo_user_types devem existir no banco de dados`, async () => {
      const seedData = [
        { description: 'User', userTypeId: 1 },
        { description: 'Admin', userTypeId: 3 },
        { description: 'Main_Admin', userTypeId: 4 },
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
          name: 'NÃO ATRIBUIDO',
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

  describe('Verifica se informações iniciais das tabelas de Segments foram adicionados', () => {
    it(`Informações iniciais de auvo_segments devem existir no banco de dados`, async () => {
      const seedData = [
        { description: 'Nao Atribuido', registrationDate: null, segmentId: 0 },
        { description: 'Selecione', registrationDate: null, segmentId: 22923 },
      ];
      const sql = sqlDataCheck('auvo_segments', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });

  describe('Verifica se informações iniciais das tabelas de Questionnaries foram adicionados', () => {
    it(`Informações iniciais de auvo_questionnaires devem existir no banco de dados`, async () => {
      const seedData = [
        {
          creationDate: null,
          description: 'Selecione um questionario',
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

  describe('Verifica se informações iniciais das tabelas de Priorities foram adicionados', () => {
    it(`Informações iniciais de auvo_task_priorities devem existir no banco de dados`, async () => {
      const seedData = [
        {
          priorityDescription: 'Low',
          taskPriorityId: 1,
        },
        { priorityDescription: 'Mediuim', taskPriorityId: 2 },
        { priorityDescription: 'High', taskPriorityId: 3 },
      ];
      const sql = sqlDataCheck('auvo_task_priorities', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result).toEqual(seedData);
    });
  });
})();
