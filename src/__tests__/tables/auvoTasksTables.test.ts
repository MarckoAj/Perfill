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

  describe('Verifica criação da tabela auvo_task_status', () => {
    it(`Deve verificar se a tabela "auvo_task_status" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_task_status', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela auvo_task_status tem todas as colunas definidas`, async () => {
      const columnsList = ['taskStatusId', 'statusDescription'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_task_status', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Verifica criação de tabelas auvo_task_priorities', () => {
    it(`Deve verificar se a tabela "auvo_task_priorities" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_task_priorities', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela auvo_task_priorities tem as colunas definidas"`, async () => {
      const columnsList = ['taskPriorityId', 'priorityDescription'];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_task_priorities', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Verifica criação da tabela auvo_task_type_requirements', () => {
    it(`Deve verificar se a tabela "auvo_task_type_requirements" existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_task_type_requirements', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela auvo_task_type_requirements tem todas as colunas definidas`, async () => {
      const columnsList = [
        'taskTypeRequirementId',
        'fk_TaskTypeId',
        'fillReport',
        'requiresSignature',
        'minimumPhotos',
        'isRequired',
      ];
      const result = (await executeQuery(
        sqlColumnCheck('auvo_task_type_requirements', process.env.DBNAME as string),
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(columnsList.sort());
    });
  });

  describe('Verifica criação da tabela auvo_tasks', () => {
    it(`Deve verificar se a tabela auvo_tasks existe no banco de dados`, async () => {
      const sql = sqlTableCheck('auvo_tasks', process.env.DBNAME as string);
      const result = (await executeQuery(sql)) as RowDataPacket[];
      expect(isRowDataPacketArray(result)).toBeTruthy();
      expect(result.length).toBe(1);
    });

    it(`Deve verificar se a tabela auvo_tasks tem todas as colunas definidas`, async () => {
      const orderedColumns = [
        'taskId',
        'fk_userFromId',
        'fk_userToId',
        'fk_taskPriorityId',
        'fk_customerId',
        'fk_taskStatusId',
        'fk_taskTypeId',
        'externalId',
        'taskDate',
        'taskCreationDate',
        'orientation',
        'deliveredOnSmarthPhone',
        'deliveredDate',
        'finished',
        'report',
        'visualized',
        'visualizedDate',
        'checkIn',
        'checkInDate',
        'checkOut',
        'checkOutDate',
        'checkinType',
        'inputedKm',
        'adoptedKm',
        'signatureUrl',
        'checkInDistance',
        'checkOutDistance',
        'taskUrl',
        'pendency',
        'dateLastUpdate',
        'displacementStart',
      ];

      const result = (await executeQuery(
        sqlColumnCheck('auvo_tasks', process.env.DBNAME as string) + 'ORDER BY ORDINAL_POSITION',
      )) as RowDataPacket[];
      const columnNames = result.map((item) => item.COLUMN_NAME);
      expect(columnNames).toEqual(orderedColumns);
    });

    describe('Verifica criação da tabela auvo_task_attachments', () => {
      it(`Deve verificar se a tabela auvo_task_attachments existe no banco de dados`, async () => {
        const sql = sqlTableCheck('auvo_task_attachments', process.env.DBNAME as string);
        const result = (await executeQuery(sql)) as RowDataPacket[];
        expect(isRowDataPacketArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
      });

      it(`Deve verificar se a tabela auvo_task_attachments tem todas as colunas definidas`, async () => {
        const columnsList = [
          'attachmentId',
          'fk_taskId',
          'url',
          'attachmentType',
          'subtitle',
          'extension',
          'attachmentDescription',
        ];
        const result = (await executeQuery(
          sqlColumnCheck('auvo_task_attachments', process.env.DBNAME as string),
        )) as RowDataPacket[];
        const columnNames = result.map((item) => item.COLUMN_NAME);
        expect(columnNames).toEqual(columnsList.sort());
      });
    });

    describe('Verifica criação da tabela auvo_questionnaire_answers', () => {
      it(`Deve verificar se a tabela "auvo_questionnaire_answers" existe no banco de dados`, async () => {
        const sql = sqlTableCheck('auvo_questionnaire_answers', process.env.DBNAME as string);
        const result = (await executeQuery(sql)) as RowDataPacket[];
        expect(isRowDataPacketArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
      });

      it(`Deve verificar se a tabela "auvo_questionnaire_answers" tem todas as colunas definidas`, async () => {
        const columnsList = ['replyId', 'fk_questionId', 'fk_taskId', 'reply', 'replyDate'];
        const result = (await executeQuery(
          sqlColumnCheck('auvo_questionnaire_answers', process.env.DBNAME as string),
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
            expect(error.message).toContain('Falha na criação das tabelas de Tasks');
          }
        }
      });
    });
  });
})();
