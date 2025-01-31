import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../infrastructure/database/definitionDb.ts';
import executeQuery from '../../infrastructure/database/queries.ts';
import { pool } from '../../infrastructure/database/conection.ts';
import { RowDataPacket } from 'mysql2/promise';
import { clearDbTables } from '../../utils/testsDbfunctions.ts';
import auvoGroupsTables from '../../infrastructure/database/tables/auvoGroupsTables.ts';

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

  describe('Verifica criação da tabela auvo_groups', () => {
    it(`Deve verificar se a tabela "auvo_groups" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_groups', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela "auvo_groups" tem todas as colunas definidas`, async () => {
      const columnsList = ['groupId', 'description'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_groups', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Teste de erro na criação da tabela Segments', () => {
    it(`Deve retornar um erro ao tentar criar tabelas em um banco de dados inexistente`, async () => {
      process.env.DBNAME = 'bancoInexistente';

      try {
        await auvoGroupsTables.createAllTables();
      } catch (error) {
        expect(error instanceof Error).toBeTruthy();
        if (error instanceof Error) {
          expect(error.message).toContain('Falha na criação das tabelas de Groups');
        }
      }
    });
  });
})();
