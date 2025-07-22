import dotenv from 'dotenv';
dotenv.config({ path: 'test.env' });

import definitionDb from '../../../../infrastructure/database/definitionDb.ts';
import executeQuery from '../../../../infrastructure/database/queries.ts';
import { pool } from '../../../../infrastructure/database/connection.ts';
import { RowDataPacket } from 'mysql2/promise';
import { clearDbTables } from '../../../../utils/testsDbfunctions.ts';
import auvoCustomersTables from '../../../../infrastructure/database/tables/auvoCustomersTables.ts';

import {
  sqlTableCheck,
  sqlColumnCheck,
  isRowDataPacketArray,
} from '../../../../utils/testsDbfunctions.ts';

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

  describe('Verifica a criação da tabela auvo_customers', () => {
    it('Deve verificar se a tabela "auvo_customers" existe no banco de dados', async () => {
      const sql = sqlTableCheck('auvo_customers', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it('Deve verificar se a tabela "auvo_customers" possui todas as colunas definidas', async () => {
      const columnsList = [
        'customerId',
        'fk_segmentId',
        'externalId',
        'description',
        'cpfCnpj',
        'manager',
        'note',
        'address',
        'addressComplement',
        'latitude',
        'longitude',
        'uriAttachments',
        'active',
        'dateLastUpdate',
        'creationDate',
      ];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Verifica a criação da tabela auvo_customers_groups', () => {
    it('Deve verificar se a tabela existe', async () => {
      const sql = sqlTableCheck('auvo_customers_groups', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(result.length).toBe(1);
    });

    it('Deve verificar as colunas', async () => {
      const columnsList = ['fk_customerId', 'fk_groupId'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers_groups', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Verifica a criação da tabela auvo_customers_managers', () => {
    it('Deve verificar se a tabela existe', async () => {
      const sql = sqlTableCheck('auvo_customers_managers', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(result.length).toBe(1);
    });

    it('Deve verificar as colunas', async () => {
      const columnsList = ['fk_userId', 'fk_customerId'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers_managers', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Verifica a criação da tabela auvo_customers_contacts', () => {
    it('Deve verificar se a tabela existe', async () => {
      const sql = sqlTableCheck('auvo_customers_contacts', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(result.length).toBe(1);
    });

    it('Deve verificar as colunas', async () => {
      const columnsList = [
        'contactId',
        'fk_customerId',
        'description',
        'contactJobPosition',
        'contactEmail',
        'contactPhone',
        'contactName',
      ];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers_contacts', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Verifica a criação da tabela auvo_customers_uri_attachments', () => {
    it('Deve verificar se a tabela existe', async () => {
      const sql = sqlTableCheck('auvo_customers_uri_attachments', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(result.length).toBe(1);
    });

    it('Deve verificar as colunas', async () => {
      const columnsList = ['fk_customerId', 'uri'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers_uri_attachments', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Verifica a criação da tabela auvo_customers_emails', () => {
    it('Deve verificar se a tabela existe', async () => {
      const sql = sqlTableCheck('auvo_customers_emails', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(result.length).toBe(1);
    });

    it('Deve verificar as colunas', async () => {
      const columnsList = ['fk_customerId', 'customer_email'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_customers_emails', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames.sort()).toEqual(columnsList.sort());
    });
  });

  describe('Teste de erro na criação da tabela auvo_customers', () => {
    it('Deve retornar um erro ao tentar criar tabelas em um banco de dados inexistente', async () => {
      process.env.DBNAME = 'bancoInexistente';

      try {
        await auvoCustomersTables.createAllTables();
      } catch (error) {
        expect(error instanceof Error).toBeTruthy();
        if (error instanceof Error) {
          expect(error.message).toContain('Falha na criação das tabelas de Customers');
        }
      }
    });
  });
})();
