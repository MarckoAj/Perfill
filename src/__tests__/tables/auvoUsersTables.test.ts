import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import { pool } from '../../infrastructure/database/connection.ts';
import executeQuery from '../../infrastructure/database/queries.ts';
import { RowDataPacket } from 'mysql2/promise';
import { clearDbTables } from '../../utils/testsDbfunctions.ts';
import auvoUsersTables from '../../infrastructure/database/tables/auvoUsersTables.ts';

import {
  sqlTableCheck,
  sqlColumnCheck,
  isRowDataPacketArray,
} from '../../utils/testsDbfunctions.ts';

(async () => {
  let originalDBName: string | undefined;

  beforeAll(async () => {
    originalDBName = process.env.DBNAME;
    await definitionDb.createTables();
  });

  afterAll(async () => {
    process.env.DBNAME = originalDBName;
    await clearDbTables(process.env.DBNAME as string);

    if (pool) {
      await pool.end();
    }
  });

  describe('Verifica criação da tabela auvo_user_types', () => {
    it(`Deve verificar se a tabela "auvo_user_types" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_user_types', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela "auvo_user_types" tem todas as colunas definidas`, async () => {
      const columnsList = ['userTypeId', 'description'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_user_types', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Verifica criação de tabelas auvo_users', () => {
    it(`Deve verificar se a tabela "auvo_users" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_users', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela "auvo_users" possui todas as colunas definidas"`, async () => {
      const columnsList = [
        'userId',
        'fk_userType',
        'name',
        'externalId',
        'login',
        'email',
        'jobPosition',
        'address',
        'registrationDate',
        'active',
      ];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_users', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Teste de erro na criação das tabelas Usuarios', () => {
    it(`Deve retornar um erro ao tentar criar tabelas em um banco de dados inexistente`, async () => {
      process.env.DBNAME = 'bancoInexistente';

      try {
        await auvoUsersTables.createAllTables();
      } catch (error) {
        expect(error instanceof Error).toBeTruthy();
        if (error instanceof Error) {
          expect(error.message).toContain('Falha na criação das tabelas de Usuários');
        }
      }
    });
  });
})();
